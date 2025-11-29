# Plan d'Implémentation - Task Instance Workflow

> **Date:** 2025-11-29 (mise à jour)
> **Status actuel:** 208/208 tests passent, 71% coverage
> **Objectif:** ✅ COMPLET - Toutes les fonctionnalités sont implémentées

## Vue d'ensemble

Le workflow d'instances de tâches est **entièrement implémenté**.

### État actuel

| Composant | Status |
|-----------|--------|
| `generate_task_instances()` | ✅ Implémenté |
| `mark_completed()` | ✅ Implémenté (avec support photo_url) |
| `validate_task()` | ✅ Implémenté |
| `refuse_task()` | ✅ Implémenté |
| `cancel_task_instance()` | ✅ Implémenté |
| `reschedule_task_instance()` | ✅ Implémenté |
| `TaskInstanceStatus.CANCELLED` | ✅ Implémenté |
| `photo_url` (preuve photo) | ✅ Implémenté |

---

## ✅ Phase 1: Compléter l'Enum TaskInstanceStatus (FAIT)

**Fichier:** `custom_components/habits_manager/core/models.py`

```python
class TaskInstanceStatus(Enum):
    PENDING = "pending"
    COMPLETED_WAITING = "completed_waiting"
    VALIDATED = "validated"
    REFUSED = "refused"
    FAILED = "failed"
    CANCELLED = "cancelled"  # ✅ AJOUTÉ
```

---

## ✅ Phase 2: Implémenter cancel_task_instance() (FAIT)

**Fichier:** `custom_components/habits_manager/managers/task_manager.py`

```python
async def cancel_task_instance(
    self,
    instance_id: str,
    reason: str = ""
) -> TaskInstance:
    """Annule une instance de tâche.

    Args:
        instance_id: ID de l'instance à annuler
        reason: Raison de l'annulation

    Returns:
        TaskInstance mise à jour

    Raises:
        ValueError: Si l'instance n'existe pas ou n'est pas en status PENDING
    """
    instance = await self.get_instance(instance_id)

    if not instance:
        raise ValueError(f"Instance {instance_id} not found")

    if instance.status != TaskInstanceStatus.PENDING:
        raise ValueError(f"Cannot cancel instance with status {instance.status.value}")

    instance.status = TaskInstanceStatus.CANCELLED
    instance.cancelled_at = datetime.now()
    instance.cancel_reason = reason

    await self.storage.save_task_instance(instance)

    _LOGGER.info(f"Task instance {instance_id} cancelled: {reason}")

    return instance
```

---

## ✅ Phase 3: Implémenter reschedule_task_instance() (FAIT)

**Fichier:** `custom_components/habits_manager/managers/task_manager.py`

```python
async def reschedule_task_instance(
    self,
    instance_id: str,
    new_date: date
) -> TaskInstance:
    """Replanifie une instance de tâche à une nouvelle date.

    Args:
        instance_id: ID de l'instance à replanifier
        new_date: Nouvelle date d'échéance

    Returns:
        TaskInstance mise à jour

    Raises:
        ValueError: Si l'instance n'existe pas ou date dans le passé
    """
    instance = await self.get_instance(instance_id)

    if not instance:
        raise ValueError(f"Instance {instance_id} not found")

    if instance.status not in [TaskInstanceStatus.PENDING, TaskInstanceStatus.FAILED]:
        raise ValueError(f"Cannot reschedule instance with status {instance.status.value}")

    if new_date < date.today():
        raise ValueError("Cannot reschedule to a past date")

    old_date = instance.due_date
    instance.due_date = new_date
    instance.status = TaskInstanceStatus.PENDING  # Reset si était FAILED
    instance.rescheduled_at = datetime.now()
    instance.rescheduled_from = old_date

    await self.storage.save_task_instance(instance)

    _LOGGER.info(f"Task instance {instance_id} rescheduled: {old_date} → {new_date}")

    return instance
```

---

## ✅ Phase 4: Mettre à jour le modèle TaskInstance (FAIT)

**Fichier:** `custom_components/habits_manager/core/models.py`

Ajouter les champs optionnels au dataclass `TaskInstance`:

```python
@dataclass
class TaskInstance:
    # ... champs existants ...

    # Nouveaux champs pour cancel/reschedule
    cancelled_at: Optional[datetime] = None
    cancel_reason: Optional[str] = None
    rescheduled_at: Optional[datetime] = None
    rescheduled_from: Optional[date] = None
```

---

## ✅ Phase 5: Écrire les vrais tests (FAIT)

**Fichier:** `tests/test_task_services.py`

### test_mark_task_completed
```python
async def test_mark_task_completed(self, mock_hass, setup_test_child, setup_test_task):
    """Test marking a task as completed."""
    instance_id = setup_test_task  # fixture retourne maintenant instance_id

    response = await mock_hass.services.async_call(
        DOMAIN,
        "mark_task_completed",
        {
            "instance_id": instance_id,
            "child_id": setup_test_child,
        },
        blocking=True,
        return_response=True,
    )

    assert "instance" in response
    assert response["instance"]["status"] == "completed_waiting"
    assert response["instance"]["id"] == instance_id
```

### test_validate_task
```python
async def test_validate_task(self, mock_hass, setup_test_child, setup_test_task):
    """Test validating a completed task."""
    instance_id = setup_test_task

    # Mark as completed first
    await mock_hass.services.async_call(
        DOMAIN,
        "mark_task_completed",
        {"instance_id": instance_id, "child_id": setup_test_child},
        blocking=True,
    )

    # Then validate
    response = await mock_hass.services.async_call(
        DOMAIN,
        "validate_task",
        {"task_instance_id": instance_id, "validator_comment": "Bien fait !"},
        blocking=True,
        return_response=True,
    )

    assert response["task_instance"]["status"] == "validated"
    assert "rewards_earned" in response
```

### test_cancel_task_instance
```python
async def test_cancel_task_instance(self, mock_hass, setup_test_child, setup_test_task):
    """Test cancelling a task instance."""
    instance_id = setup_test_task

    response = await mock_hass.services.async_call(
        DOMAIN,
        "cancel_task_instance",
        {"instance_id": instance_id, "reason": "Maladie"},
        blocking=True,
        return_response=True,
    )

    assert response["instance"]["status"] == "cancelled"
    assert "cancelled_at" in response["instance"]
```

### test_reschedule_task_instance
```python
async def test_reschedule_task_instance(self, mock_hass, setup_test_child, setup_test_task):
    """Test rescheduling a task instance."""
    from datetime import date, timedelta

    instance_id = setup_test_task
    new_date = (date.today() + timedelta(days=1)).isoformat()

    response = await mock_hass.services.async_call(
        DOMAIN,
        "reschedule_task_instance",
        {"instance_id": instance_id, "new_date": new_date},
        blocking=True,
        return_response=True,
    )

    assert response["instance"]["due_date"] == new_date
    assert response["instance"]["status"] == "pending"
```

---

## 📋 Résumé des Modifications

| Fichier | Modifications |
|---------|---------------|
| `models.py` | Ajouter `CANCELLED` à l'enum + champs au dataclass |
| `task_manager.py` | Ajouter `cancel_task_instance()` et `reschedule_task_instance()` |
| `test_task_services.py` | Réécrire 4 tests avec le vrai workflow |
| `test_integration.py` | Optionnel: réactiver `test_complete_task_workflow` |

---

## 🎯 Plan d'Exécution

1. **Modifier `models.py`** - Ajouter status CANCELLED + champs
2. **Modifier `task_manager.py`** - Ajouter les 2 méthodes
3. **Réécrire les tests** - 4 tests task_services
4. **Lancer les tests** - Valider 77+ tests passent

---

## ✅ Historique - Corrections Complétées

> Les sections ci-dessous documentent les corrections déjà effectuées.

### Session 2025-11-29 - 208/208 tests passent (71% coverage)

**Nouvelles fonctionnalités:**
- ✅ `photo_url` dans `TaskInstance` - preuve photo pour tâches
- ✅ `mark_completed()` accepte `photo_url` optionnel
- ✅ `services.yaml` mis à jour avec le paramètre `photo_url`
- ✅ `storage_manager.py` charge tous les champs `TaskInstance`

### Session 2025-11-28 - 77/77 tests passent

**Corrections appliquées:**
- ✅ XP/Niveaux: `add_currency_manual` avec param `xp`, `set_level()`
- ✅ Habitudes: handlers corrigés
- ✅ Cosmétiques: handlers corrigés
- ✅ Récompenses: handlers corrigés
- ✅ Configuration: handlers implémentés
- ✅ Tests adaptés à l'implémentation actuelle
- ✅ `cancel_task_instance()` et `reschedule_task_instance()` implémentés
- ✅ `TaskInstanceStatus.CANCELLED` ajouté
