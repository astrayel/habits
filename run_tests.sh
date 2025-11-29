#!/bin/bash
# Script de lancement des tests pour Habits Manager
# Usage: ./run_tests.sh [options]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Fonction d'aide
show_help() {
    cat << EOF
Usage: ./run_tests.sh [OPTIONS]

Options:
    -h, --help          Afficher cette aide
    -q, --quick         Tests rapides seulement (sans coverage)
    -u, --unit          Tests unitaires seulement
    -i, --integration   Tests d'intégration seulement
    -c, --coverage      Générer le rapport de coverage HTML
    -v, --verbose       Mode verbose
    -f, --failed        Réexécuter les tests échoués
    -k PATTERN          Exécuter les tests correspondant au pattern
    -m MARKER           Exécuter les tests avec le marker spécifié
    --no-lint           Sauter le linting
    --no-format         Sauter le formatage

Exemples:
    ./run_tests.sh                    # Tous les tests avec coverage
    ./run_tests.sh -q                 # Tests rapides
    ./run_tests.sh -u -v              # Tests unitaires en verbose
    ./run_tests.sh -k "test_child"    # Tests contenant "child"
    ./run_tests.sh -m integration     # Tests d'intégration

EOF
    exit 0
}

# Valeurs par défaut
QUICK=false
UNIT_ONLY=false
INTEGRATION_ONLY=false
COVERAGE_HTML=false
VERBOSE=""
FAILED_ONLY=false
PATTERN=""
MARKER=""
RUN_LINT=true
RUN_FORMAT=true

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        -q|--quick)
            QUICK=true
            shift
            ;;
        -u|--unit)
            UNIT_ONLY=true
            shift
            ;;
        -i|--integration)
            INTEGRATION_ONLY=true
            shift
            ;;
        -c|--coverage)
            COVERAGE_HTML=true
            shift
            ;;
        -v|--verbose)
            VERBOSE="-v"
            shift
            ;;
        -f|--failed)
            FAILED_ONLY=true
            shift
            ;;
        -k)
            PATTERN="$2"
            shift 2
            ;;
        -m)
            MARKER="$2"
            shift 2
            ;;
        --no-lint)
            RUN_LINT=false
            shift
            ;;
        --no-format)
            RUN_FORMAT=false
            shift
            ;;
        *)
            print_error "Option inconnue: $1"
            show_help
            ;;
    esac
done

# Vérifier que pytest est installé
if ! command -v pytest &> /dev/null; then
    print_error "pytest n'est pas installé"
    echo "Installer avec: pip install -r requirements_test.txt"
    exit 1
fi

# En-tête
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Tests Habits Manager                 ║"
echo "╔════════════════════════════════════════╗"
echo ""

# Formatage du code
if [ "$RUN_FORMAT" = true ] && [ "$QUICK" = false ]; then
    print_step "Formatage du code avec Black..."
    if command -v black &> /dev/null; then
        black custom_components/habits_manager tests
        print_success "Code formaté"
    else
        print_warning "Black non installé, passage ignoré"
    fi
    echo ""
fi

# Linting
if [ "$RUN_LINT" = true ] && [ "$QUICK" = false ]; then
    print_step "Linting avec Ruff..."
    if command -v ruff &> /dev/null; then
        ruff check custom_components/habits_manager tests
        print_success "Linting OK"
    else
        print_warning "Ruff non installé, passage ignoré"
    fi
    echo ""
fi

# Construction de la commande pytest
PYTEST_CMD="pytest"

# Ajouter les options
if [ -n "$VERBOSE" ]; then
    PYTEST_CMD="$PYTEST_CMD $VERBOSE"
fi

if [ "$FAILED_ONLY" = true ]; then
    PYTEST_CMD="$PYTEST_CMD --lf"
fi

if [ -n "$PATTERN" ]; then
    PYTEST_CMD="$PYTEST_CMD -k $PATTERN"
fi

if [ -n "$MARKER" ]; then
    PYTEST_CMD="$PYTEST_CMD -m $MARKER"
fi

if [ "$UNIT_ONLY" = true ]; then
    PYTEST_CMD="$PYTEST_CMD -m unit"
fi

if [ "$INTEGRATION_ONLY" = true ]; then
    PYTEST_CMD="$PYTEST_CMD -m integration"
fi

# Coverage
if [ "$QUICK" = false ]; then
    PYTEST_CMD="$PYTEST_CMD --cov=custom_components.habits_manager"
    if [ "$COVERAGE_HTML" = true ]; then
        PYTEST_CMD="$PYTEST_CMD --cov-report=html --cov-report=term-missing"
    else
        PYTEST_CMD="$PYTEST_CMD --cov-report=term-missing"
    fi
fi

# Exécution des tests
print_step "Exécution des tests..."
echo "Commande: $PYTEST_CMD"
echo ""

if $PYTEST_CMD; then
    echo ""
    print_success "Tous les tests sont passés !"

    if [ "$COVERAGE_HTML" = true ]; then
        echo ""
        print_success "Rapport de coverage HTML généré dans htmlcov/"
        echo "Ouvrir avec: open htmlcov/index.html"
    fi

    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║   ✓ Tests réussis                      ║"
    echo "╔════════════════════════════════════════╗"
    echo ""
    exit 0
else
    echo ""
    print_error "Des tests ont échoué"
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║   ✗ Tests échoués                      ║"
    echo "╔════════════════════════════════════════╗"
    echo ""
    echo "Pour réexécuter les tests échoués: ./run_tests.sh -f"
    exit 1
fi
