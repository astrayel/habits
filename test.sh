#!/bin/bash
# Script simplifié pour lancer les tests avec activation automatique du venv
# Usage: ./test.sh [options pytest]

set -e

# Vérifier si venv existe
if [ ! -d "venv" ]; then
    echo "[ERREUR] Environnement virtuel non trouvé"
    echo "Lancez d'abord: ./setup_tests_wsl.sh"
    exit 1
fi

# Activer venv
source venv/bin/activate

# Lancer les tests avec les arguments passés
if [ $# -eq 0 ]; then
    # Pas d'arguments, lancer tous les tests avec coverage
    pytest --cov=custom_components.habits_manager --cov-report=term-missing
else
    # Passer tous les arguments à pytest
    pytest "$@"
fi

# Désactiver venv
deactivate
