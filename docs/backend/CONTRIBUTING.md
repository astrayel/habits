# Contributing to Habits Manager Backend

Guide pour contribuer au code backend de l'intégration.

## Table des matières

1. [Setup de développement](#setup-de-développement)
2. [Structure du code](#structure-du-code)
3. [Ajouter une nouvelle fonctionnalité](#ajouter-une-nouvelle-fonctionnalité)
4. [Tester le code](#tester-le-code)
5. [Style de code](#style-de-code)
6. [Bonnes pratiques](#bonnes-pratiques)

---

## Setup de développement

### Prérequis

- Python 3.11+
- Home Assistant OS ou supervised
- Accès SSH à Home Assistant
- Git

### Installation

Voir [docs/development/QUICKSTART.md](../development/QUICKSTART.md)

---

## Structure du code

Voir [STRUCTURE.md](./STRUCTURE.md) pour l'organisation complète.

**Règle d'or:** Chaque composant a une responsabilité unique.

```
Managers  → Logique métier uniquement
Storage   → Persistance uniquement  
Services  → Calculs/utilitaires uniquement
Core      → Modèles de données uniquement
```

---

## Ajouter une nouvelle fonctionnalité

### 1. Ajouter un nouveau service

**Exemple:** Ajouter `reset_child_points`

#### Étape 1: Définir le service dans `services.yaml`

```yaml
reset_child_points:
  name: Réinitialiser les points
  description: Remet les points d'un enfant à zéro
  fields:
    child_id:
      name: ID enfant
      description: Identifiant de l'enfant
      required: true
      example: "child_abc123"
      selector:
        text:
```

#### Étape 2: Ajouter la constante dans `const.py`

```python
SERVICE_RESET_CHILD_POINTS = "reset_child_points"
```

#### Étape 3: Ajouter la méthode dans le manager approprié

`managers/child_manager.py`:
```python
async def reset_points(self, child_id: str) -> Child:
    """Remet les points d'un enfant à zéro.
    
    Args:
        child_id: ID de l'enfant
        
    Returns:
        Child mis à jour
        
    Raises:
        ChildNotFoundError: Si l'enfant n'existe pas
    """
    child = await self.get_child(child_id)
    child.points = 0
    child.updated_at = datetime.now()
    
    await self.storage.save_child(child)
    await self.entity_mgr.update_child_entities(child)
    
    _LOGGER.info(f"Reset points for child {child.name} ({child.id})")
    
    return child
```

#### Étape 4: Enregistrer le service dans `__init__.py`

```python
async def register_services(hass: HomeAssistant):
    # ... autres services ...
    
    async def handle_reset_child_points(call):
        """Handle reset_child_points service call."""
        child_id = call.data.get("child_id")
        child_mgr = hass.data[DOMAIN].get("child_manager")
        
        try:
            await child_mgr.reset_points(child_id)
        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_RESET_CHILD_POINTS,
        handle_reset_child_points,
        schema=vol.Schema({
            vol.Required("child_id"): cv.string,
        })
    )
```

#### Étape 5: Tester

```yaml
# Dans DevTools > Services
service: habits_manager.reset_child_points
data:
  child_id: "child_abc123"
```

#### Étape 6: Documenter

Ajouter dans `docs/backend/API_REFERENCE.md`

---

### 2. Ajouter un nouveau sensor

**Exemple:** Ajouter `sensor.habits_{child_id}_completed_tasks_today`

#### Étape 1: Créer la classe du sensor

`sensor.py`:
```python
class ChildCompletedTasksTodaySensor(BaseChildSensor):
    """Sensor pour les tâches complétées aujourd'hui."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"habits {self._child_id} completed tasks today"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_completed_tasks_today"

    @property
    def state(self):
        """État du sensor."""
        # Compter les instances VALIDATED pour aujourd'hui
        task_mgr = self.hass.data[DOMAIN].get("task_manager")
        today = date.today()
        
        try:
            instances = await task_mgr.get_task_instances(
                child_id=self._child_id,
                status=TaskInstanceStatus.VALIDATED,
                date=today
            )
            return len(instances)
        except Exception:
            return 0

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "tasks"
```

#### Étape 2: Ajouter dans `_create_child_sensors()`

```python
def _create_child_sensors(hass, child_id, child_data):
    """Crée les sensors pour un enfant."""
    return [
        # ... sensors existants ...
        ChildCompletedTasksTodaySensor(hass, child_id, child_data),
    ]
```

#### Étape 3: Tester

Redémarrez HA et vérifiez que le sensor apparaît:
- DevTools > États > rechercher `habits`

#### Étape 4: Documenter

Ajouter dans `docs/backend/SENSORS.md`

---

### 3. Ajouter un nouveau manager

**Exemple:** Ajouter `PenaltyManager` pour gérer les pénalités

#### Étape 1: Créer le fichier

`managers/penalty_manager.py`:
```python
"""Penalty manager for Habits Manager."""

from ..const import _LOGGER
from ..core.models import Child, Penalty
from ..core.exceptions import ChildNotFoundError
from ..storage.storage_manager import StorageManager
from ..storage.entity_manager import EntityManager


class PenaltyManager:
    """Gère les pénalités."""

    def __init__(self, storage: StorageManager, entity_mgr: EntityManager):
        """Initialise le penalty manager.
        
        Args:
            storage: Manager de stockage
            entity_mgr: Manager d'entités HA
        """
        self.storage = storage
        self.entity_mgr = entity_mgr

    async def apply_penalty(self, child_id: str, points: int) -> Child:
        """Applique une pénalité à un enfant.
        
        Args:
            child_id: ID de l'enfant
            points: Points à déduire
            
        Returns:
            Child mis à jour
            
        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        # Implémentation...
        pass
```

#### Étape 2: Instancier dans `__init__.py`

```python
async def async_setup_entry(hass, entry):
    # ... autres managers ...
    
    penalty_mgr = PenaltyManager(storage, entity_mgr)
    
    hass.data[DOMAIN] = {
        # ...
        "penalty_manager": penalty_mgr,
    }
```

#### Étape 3: Utiliser dans les services

```python
penalty_mgr = hass.data[DOMAIN].get("penalty_manager")
await penalty_mgr.apply_penalty(child_id, 10)
```

---

## Tester le code

### Tests manuels

Voir [docs/development/TESTING.md](../development/TESTING.md)

### Tests automatisés

Créer un fichier de test dans `tests/`:

```python
"""Tests for child_manager."""

import pytest
from custom_components.habits_manager.managers.child_manager import ChildManager
from custom_components.habits_manager.core.exceptions import ChildNotFoundError


@pytest.mark.asyncio
async def test_create_child(hass, storage_manager, entity_manager):
    """Test de création d'enfant."""
    manager = ChildManager(storage_manager, entity_manager)
    
    child = await manager.create_child(
        name="Test Child",
        person_entity="person.test"
    )
    
    assert child.name == "Test Child"
    assert child.points == 0
    assert child.level == 1


@pytest.mark.asyncio
async def test_get_child_not_found(hass, storage_manager, entity_manager):
    """Test enfant introuvable."""
    manager = ChildManager(storage_manager, entity_manager)
    
    with pytest.raises(ChildNotFoundError):
        await manager.get_child("invalid_id")
```

Lancer les tests:
```bash
pytest tests/
```

---

## Style de code

### Python

Suivre [PEP 8](https://pep8.org/) et les conventions Home Assistant.

**Formatage:**
```bash
# Formatter avec black
black custom_components/habits_manager/

# Linter avec pylint
pylint custom_components/habits_manager/
```

**Conventions:**

✅ **Bon:**
```python
async def create_child(self, name: str, person_entity: str) -> Child:
    """Crée un nouvel enfant.
    
    Args:
        name: Nom de l'enfant
        person_entity: Entité person de HA
        
    Returns:
        Child créé
        
    Raises:
        ValidationError: Si les données sont invalides
    """
    if not name:
        raise ValidationError("Name is required")
    
    child_id = f"child_{uuid.uuid4().hex[:8]}"
    child = Child(id=child_id, name=name, person_entity=person_entity)
    
    await self.storage.save_child(child)
    await self.entity_mgr.create_child_entities(child)
    
    _LOGGER.info(f"Child created: {child.name} ({child.id})")
    
    return child
```

❌ **Mauvais:**
```python
def createChild(self,n,p):  # Pas async, pas de types, pas de docstring
    c=Child(id="child_"+str(random.randint(0,9999)),name=n,person=p)  # ID non unique
    self.storage.saveChild(c)  # Pas await, méthode synchrone
    return c
```

### Docstrings

**Format Google:**
```python
def calculate_points(difficulty: int, multiplier: float = 1.0) -> int:
    """Calcule les points selon la difficulté.
    
    Cette fonction applique un multiplicateur basé sur la difficulté
    de la tâche et retourne le nombre de points à attribuer.
    
    Args:
        difficulty: Niveau de difficulté (1-3)
        multiplier: Multiplicateur optionnel (défaut: 1.0)
        
    Returns:
        Nombre de points calculés
        
    Raises:
        ValueError: Si difficulty hors limites
        
    Example:
        >>> calculate_points(2, 1.5)
        45
    """
    if not 1 <= difficulty <= 3:
        raise ValueError("Difficulty must be between 1 and 3")
    
    base_points = [10, 20, 30][difficulty - 1]
    return int(base_points * multiplier)
```

### Type hints

**Toujours utiliser les type hints:**

✅ **Bon:**
```python
from typing import List, Optional
from datetime import date

async def get_task_instances(
    self,
    child_id: str,
    status: Optional[TaskInstanceStatus] = None,
    date_filter: Optional[date] = None
) -> List[TaskInstance]:
    """Récupère les instances de tâches."""
    pass
```

❌ **Mauvais:**
```python
async def get_task_instances(self, child_id, status=None, date_filter=None):
    """Récupère les instances de tâches."""
    pass
```

---

## Bonnes pratiques

### 1. Gestion d'erreurs

✅ **Bon:**
```python
async def get_child(self, child_id: str) -> Child:
    """Récupère un enfant."""
    child = await self.storage.get_child(child_id)
    if child is None:
        raise ChildNotFoundError(f"Child {child_id} not found")
    return child
```

❌ **Mauvais:**
```python
async def get_child(self, child_id: str) -> Child:
    """Récupère un enfant."""
    return await self.storage.get_child(child_id)  # Retourne None si non trouvé!
```

### 2. Logging

✅ **Bon:**
```python
_LOGGER.debug(f"Loading tasks for child {child_id}")
tasks = await self.get_tasks_for_child(child_id)
_LOGGER.info(f"Loaded {len(tasks)} tasks for child {child_id}")
```

**Niveaux:**
- `DEBUG`: Détails techniques
- `INFO`: Actions importantes
- `WARNING`: Situations anormales non-critiques
- `ERROR`: Erreurs qui empêchent l'opération

### 3. Async/await

✅ **Bon:**
```python
async def complete_task(self, task_id: str, child_id: str):
    """Complète une tâche."""
    # Opérations I/O en parallèle
    task, child = await asyncio.gather(
        self.get_task(task_id),
        self.get_child(child_id)
    )
    
    # Logique synchrone
    task.status = TaskInstanceStatus.COMPLETED
    
    # Sauvegarde async
    await self.storage.save_task(task)
```

❌ **Mauvais:**
```python
async def complete_task(self, task_id: str, child_id: str):
    """Complète une tâche."""
    # Séquentiel alors qu'on pourrait paralléliser
    task = await self.get_task(task_id)
    child = await self.get_child(child_id)
    
    task.status = TaskInstanceStatus.COMPLETED
    await self.storage.save_task(task)
```

### 4. Immutabilité des dataclasses

✅ **Bon:**
```python
async def add_points(self, child_id: str, points: int) -> Child:
    """Ajoute des points."""
    child = await self.get_child(child_id)
    child.points += points
    child.updated_at = datetime.now()  # Toujours mettre à jour updated_at
    await self.storage.save_child(child)
    return child
```

### 5. Validation des données

✅ **Bon:**
```python
async def create_task(self, title: str, difficulty: int, **kwargs) -> Task:
    """Crée une tâche."""
    # Validation en amont
    if not title or len(title) > 100:
        raise ValidationError("Title must be 1-100 characters")
    
    if not 1 <= difficulty <= 3:
        raise ValidationError("Difficulty must be 1, 2, or 3")
    
    # Création seulement si valide
    task = Task(id=self._generate_id(), title=title, difficulty=difficulty)
    await self.storage.save_task(task)
    return task
```

---

## Checklist avant commit

- [ ] Code formaté avec `black`
- [ ] Pas d'erreurs `pylint`
- [ ] Type hints présents
- [ ] Docstrings complètes
- [ ] Logs appropriés
- [ ] Gestion d'erreurs
- [ ] Tests ajoutés (si applicable)
- [ ] Documentation mise à jour
- [ ] Testé manuellement dans HA

---

## Ressources

### Documentation Home Assistant

- [Developer Docs](https://developers.home-assistant.io/)
- [Integration Structure](https://developers.home-assistant.io/docs/creating_integration_file_structure/)
- [Services](https://developers.home-assistant.io/docs/dev_101_services/)
- [Sensors](https://developers.home-assistant.io/docs/core/entity/sensor/)

### Documentation Habits Manager

- [API_REFERENCE.md](./API_REFERENCE.md) - Référence des services
- [SENSORS.md](./SENSORS.md) - Documentation des sensors
- [STRUCTURE.md](./STRUCTURE.md) - Architecture du backend
- [EVENTS.md](./EVENTS.md) - Système d'événements

---

## Obtenir de l'aide

- Ouvrir une issue sur GitHub
- Consulter les discussions existantes
- Lire le code existant (les patterns sont cohérents)

---

## Merci de contribuer! 🎉
