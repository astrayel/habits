# Guide de Tests - Habits Manager

Ce document explique comment tester automatiquement l'intégration Habits Manager pour Home Assistant.

## Table des matières

1. [Architecture des tests](#architecture-des-tests)
2. [Installation](#installation)
3. [Exécution des tests](#exécution-des-tests)
4. [Types de tests](#types-de-tests)
5. [Coverage](#coverage)
6. [Écrire de nouveaux tests](#écrire-de-nouveaux-tests)
7. [CI/CD](#cicd)

## Architecture des tests

Les tests sont organisés selon la structure suivante :

```
tests/
├── __init__.py
├── conftest.py                    # Fixtures pytest communes
├── test_child_services.py         # Tests services enfants
├── test_task_services.py          # Tests services tâches
├── test_habit_services.py         # Tests services habitudes
├── test_reward_services.py        # Tests services récompenses
├── test_cosmetic_services.py      # Tests services cosmétiques
├── test_stats_services.py         # Tests services statistiques
├── test_config_services.py        # Tests services configuration
└── test_integration.py            # Tests d'intégration complets
```

### Principes de conception

- **Tests unitaires** : Un test par service, vérifiant les entrées/sorties
- **Tests d'intégration** : Workflows complets utilisant plusieurs services
- **Fixtures réutilisables** : Données de test centralisées dans `conftest.py`
- **Isolation** : Chaque test utilise un stockage temporaire isolé

## Installation

### 1. Installer les dépendances de test

```bash
pip install -r requirements_test.txt
```

Les principales dépendances installées :

- `pytest` - Framework de test
- `pytest-asyncio` - Support async/await
- `pytest-cov` - Coverage de code
- `pytest-homeassistant-custom-component` - Utilitaires HA
- `pytest-mock` - Mocking avancé

### 2. Vérifier l'installation

```bash
pytest --version
```

## Exécution des tests

### Lancer tous les tests

```bash
pytest
```

### Lancer des tests spécifiques

```bash
# Un fichier de tests
pytest tests/test_child_services.py

# Une classe de tests
pytest tests/test_child_services.py::TestChildServices

# Un test spécifique
pytest tests/test_child_services.py::TestChildServices::test_create_child

# Tests par marqueur
pytest -m unit
pytest -m integration
pytest -m "not slow"
```

### Options utiles

```bash
# Mode verbose avec détails
pytest -v

# Arrêter au premier échec
pytest -x

# Afficher les prints
pytest -s

# Parallélisation (nécessite pytest-xdist)
pytest -n auto

# Réexécuter les tests échoués
pytest --lf

# Coverage détaillé
pytest --cov --cov-report=html
```

## Types de tests

### Tests unitaires

Tests isolés pour chaque service. Exemple :

```python
async def test_create_child(self, mock_hass, sample_child_data):
    """Test creating a child."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_child",
        sample_child_data,
        blocking=True,
        return_response=True,
    )

    assert "child" in response
    assert response["child"]["name"] == sample_child_data["name"]
```

### Tests d'intégration

Workflows complets simulant des scénarios réels :

```python
async def test_complete_task_workflow(self, mock_hass):
    """Test workflow complet : créer enfant, tâche, compléter, valider."""
    # 1. Créer enfant
    child = await create_child(...)

    # 2. Créer tâche
    task = await create_task(...)

    # 3. Compléter tâche
    instance = await mark_completed(...)

    # 4. Valider et vérifier récompenses
    result = await validate_task(...)
    assert result["rewards_earned"]["points"] > 0
```

### Tests de validation

Tests vérifiant que les erreurs sont correctement gérées :

```python
async def test_claim_reward_insufficient_points(self, mock_hass):
    """Test que réclamer sans points échoue."""
    with pytest.raises(HomeAssistantError):
        await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {"reward_id": "...", "child_id": "..."},
            blocking=True,
        )
```

## Coverage

### Générer le rapport de coverage

```bash
pytest --cov=custom_components.habits_manager --cov-report=html
```

Ouvrir `htmlcov/index.html` dans un navigateur pour voir le rapport détaillé.

### Objectifs de coverage

- **Minimum acceptable** : 70%
- **Cible** : 85%
- **Idéal** : 95%+

### Zones prioritaires

1. **Services API** (P0) : 95%+ requis
2. **Managers** : 90%+ recommandé
3. **Models** : 80%+ acceptable
4. **Utilitaires** : 70%+ acceptable

### Exclure du coverage

Certaines sections peuvent être exclues avec `# pragma: no cover` :

```python
def debug_function():  # pragma: no cover
    """Fonction de debug non testée."""
    print("Debug info")
```

## Écrire de nouveaux tests

### Structure d'un test

```python
"""Tests for my_new_feature."""
import pytest
from homeassistant.exceptions import HomeAssistantError
from custom_components.habits_manager.const import DOMAIN


class TestMyFeature:
    """Test my new feature."""

    async def test_basic_functionality(self, mock_hass, setup_test_child):
        """Test basic functionality."""
        # Arrange
        input_data = {"child_id": setup_test_child, "value": 42}

        # Act
        response = await mock_hass.services.async_call(
            DOMAIN,
            "my_service",
            input_data,
            blocking=True,
            return_response=True,
        )

        # Assert
        assert response["success"] is True
        assert response["value"] == 42

    async def test_error_handling(self, mock_hass):
        """Test error handling."""
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "my_service",
                {"invalid": "data"},
                blocking=True,
            )
```

### Utiliser les fixtures

Les fixtures disponibles dans `conftest.py` :

```python
# Fixtures de données
async def test_with_data(
    self,
    sample_child_data,     # Données enfant
    sample_task_data,      # Données tâche
    sample_habit_data,     # Données habitude
    sample_reward_data,    # Données récompense
    sample_cosmetic_data   # Données cosmétique
):
    pass

# Fixtures d'entités créées
async def test_with_entities(
    self,
    setup_test_child,      # Enfant créé
    setup_test_task,       # Tâche créée
    setup_test_habit,      # Habitude créée
    setup_test_reward,     # Récompense créée
    setup_test_cosmetic    # Cosmétique créé
):
    pass

# Fixtures d'infrastructure
async def test_with_infra(
    self,
    mock_hass,            # Instance HA mockée
    mock_storage_dir      # Répertoire de stockage temporaire
):
    pass
```

### Créer des fixtures personnalisées

Dans `conftest.py` :

```python
@pytest.fixture
async def setup_completed_task(mock_hass, setup_test_child, setup_test_task):
    """Fixture: tâche déjà complétée."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "mark_task_completed",
        {
            "task_id": setup_test_task,
            "child_id": setup_test_child,
        },
        blocking=True,
        return_response=True,
    )
    return response["task_instance"]["id"]
```

### Bonnes pratiques

1. **Noms descriptifs** : `test_claim_reward_insufficient_points` plutôt que `test_error_1`
2. **Un concept par test** : Ne pas tester plusieurs choses dans un seul test
3. **Arrange-Act-Assert** : Structure claire en 3 parties
4. **Messages d'erreur clairs** : `assert x == y, f"Expected {y}, got {x}"`
5. **Indépendance** : Chaque test doit pouvoir s'exécuter seul
6. **Rapidité** : Privilégier les mocks aux appels réels

## CI/CD

### GitHub Actions

Créer `.github/workflows/test.yml` :

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.11, 3.12]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          pip install -r requirements_test.txt

      - name: Run tests
        run: |
          pytest --cov --cov-report=xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          fail_ci_if_error: true
```

### Pre-commit hooks

Installer pre-commit :

```bash
pip install pre-commit
```

Créer `.pre-commit-config.yaml` :

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
        language_version: python3.11

  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]

  - repo: local
    hooks:
      - id: pytest-check
        name: pytest-check
        entry: pytest
        language: system
        pass_filenames: false
        always_run: true
```

Installer les hooks :

```bash
pre-commit install
```

### Tests locaux avant commit

Script `run_tests.sh` :

```bash
#!/bin/bash
set -e

echo "🧹 Formatting code..."
black custom_components/habits_manager tests

echo "🔍 Linting..."
ruff check custom_components/habits_manager tests

echo "🧪 Running tests..."
pytest --cov --cov-report=term-missing

echo "✅ All checks passed!"
```

## Debugging des tests

### Utiliser pdb

```python
async def test_debug(self, mock_hass):
    result = await some_service_call()
    import pdb; pdb.set_trace()  # Point d'arrêt
    assert result == expected
```

### Logs détaillés

```python
import logging
logging.basicConfig(level=logging.DEBUG)

async def test_with_logs(self, mock_hass):
    # Les logs seront affichés
    pass
```

### Capturer les événements

```python
async def test_events(self, mock_hass):
    events = []

    def capture_event(event):
        events.append(event)

    mock_hass.bus.async_listen("habits_manager_update", capture_event)

    # Faire quelque chose qui déclenche un événement
    await some_action()

    # Vérifier les événements
    assert len(events) == 1
    assert events[0].data["update_type"] == "child_updated"
```

## Résolution de problèmes

### Problème : Tests async qui échouent

**Solution** : Vérifier que `pytest-asyncio` est installé et `asyncio_mode = auto` dans `pytest.ini`

### Problème : Fixtures non trouvées

**Solution** : Vérifier que `conftest.py` est dans le bon répertoire et importable

### Problème : Coverage incomplet

**Solution** :
1. Vérifier que tous les fichiers sont dans le path de coverage
2. Ajouter des tests pour les branches non couvertes
3. Utiliser `--cov-report=html` pour identifier les lignes manquantes

### Problème : Tests lents

**Solution** :
1. Utiliser `pytest -n auto` pour parallélisation
2. Marquer les tests lents avec `@pytest.mark.slow`
3. Éviter les sleeps, utiliser des mocks

## Ressources

- [Pytest Documentation](https://docs.pytest.org/)
- [Home Assistant Testing](https://developers.home-assistant.io/docs/development_testing)
- [pytest-homeassistant-custom-component](https://github.com/MatthewFlamm/pytest-homeassistant-custom-component)

## Checklist avant PR

- [ ] Tous les tests passent : `pytest`
- [ ] Coverage >= 85% : `pytest --cov`
- [ ] Code formaté : `black .`
- [ ] Linting OK : `ruff check .`
- [ ] Nouveaux tests pour nouvelles fonctionnalités
- [ ] Tests d'intégration mis à jour si workflow modifié
- [ ] Documentation des tests mise à jour

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-01-27
