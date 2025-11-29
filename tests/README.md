# Tests Habits Manager

Suite de tests automatisés pour l'intégration Home Assistant Habits Manager.

## Quick Start

```bash
# Installer les dépendances
pip install -r requirements_test.txt

# Lancer tous les tests
pytest

# Lancer avec coverage
pytest --cov

# Lancer des tests spécifiques
pytest tests/test_child_services.py
```

## Structure des tests

| Fichier | Description | Tests |
|---------|-------------|-------|
| `conftest.py` | Fixtures et configuration pytest | - |
| `test_child_services.py` | Services de gestion des enfants | 13 tests |
| `test_task_services.py` | Services de gestion des tâches | 16 tests |
| `test_habit_services.py` | Services de gestion des habitudes | 9 tests |
| `test_reward_services.py` | Services de gestion des récompenses | 10 tests |
| `test_cosmetic_services.py` | Services de gestion des cosmétiques | 11 tests |
| `test_stats_services.py` | Services de statistiques | 4 tests |
| `test_config_services.py` | Services de configuration | 7 tests |
| `test_integration.py` | Tests d'intégration complets | 8 workflows |

**Total : ~78 tests**

## Coverage

Objectifs de coverage par module :

- ✅ **Services API** : 95%+
- ✅ **Managers** : 90%+
- ✅ **Models** : 80%+
- ⚠️ **Utils** : 70%+

Voir le rapport complet : `pytest --cov --cov-report=html` puis ouvrir `htmlcov/index.html`

## Fixtures disponibles

### Données de test
- `sample_child_data` - Données pour créer un enfant
- `sample_task_data` - Données pour créer une tâche
- `sample_habit_data` - Données pour créer une habitude
- `sample_reward_data` - Données pour créer une récompense
- `sample_cosmetic_data` - Données pour créer un cosmétique

### Entités pré-créées
- `setup_test_child` - Enfant déjà créé
- `setup_test_task` - Tâche déjà créée
- `setup_test_habit` - Habitude déjà créée
- `setup_test_reward` - Récompense déjà créée
- `setup_test_cosmetic` - Cosmétique déjà créé

### Infrastructure
- `mock_hass` - Instance Home Assistant mockée
- `mock_storage_dir` - Répertoire de stockage temporaire

## Exemples

### Test basique

```python
async def test_create_child(self, mock_hass, sample_child_data):
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_child",
        sample_child_data,
        blocking=True,
        return_response=True,
    )
    assert "child" in response
```

### Test d'erreur

```python
async def test_insufficient_coins(self, mock_hass, setup_test_child):
    with pytest.raises(HomeAssistantError):
        await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {"cosmetic_id": "...", "child_id": setup_test_child},
            blocking=True,
        )
```

### Test d'intégration

```python
async def test_task_workflow(self, mock_hass):
    # Créer enfant
    child = await create_child()
    # Créer tâche
    task = await create_task()
    # Compléter
    instance = await complete_task()
    # Valider
    result = await validate_task()
    # Vérifier
    assert result["rewards_earned"]["points"] > 0
```

## Documentation complète

Voir [docs/TESTING.md](../docs/TESTING.md) pour :
- Guide détaillé d'installation
- Options avancées de pytest
- Écriture de nouveaux tests
- Configuration CI/CD
- Debugging et résolution de problèmes
