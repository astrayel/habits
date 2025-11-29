#!/bin/bash
# Script d'installation de l'environnement de test pour WSL
# Usage: ./setup_tests_wsl.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Setup Tests - Habits Manager (WSL)   ║"
echo "╔════════════════════════════════════════╗"
echo ""

# Vérifier si venv existe déjà
if [ -d "venv" ]; then
    echo -e "${BLUE}==>${NC} Environnement virtuel existant détecté"
else
    echo -e "${BLUE}==>${NC} [1/3] Création de l'environnement virtuel..."
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Environnement virtuel créé"
fi

echo ""
echo -e "${BLUE}==>${NC} [2/3] Activation de l'environnement virtuel..."
source venv/bin/activate
echo -e "${GREEN}✓${NC} Environnement virtuel activé"

echo ""
echo -e "${BLUE}==>${NC} [3/3] Installation des dépendances..."
pip install --upgrade pip -q
pip install -r requirements_test.txt

echo ""
echo -e "${GREEN}✓${NC} Setup terminé avec succès"
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Pour lancer les tests:               ║"
echo "║   1. source venv/bin/activate          ║"
echo "║   2. pytest                            ║"
echo "║                                        ║"
echo "║   Ou utilisez: ./test.sh               ║"
echo "╔════════════════════════════════════════╗"
echo ""
