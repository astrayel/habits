@echo off
REM Script de lancement des tests pour Habits Manager (Windows)
REM Usage: run_tests.bat [options]

setlocal enabledelayedexpansion

REM Valeurs par défaut
set QUICK=0
set COVERAGE_HTML=0
set VERBOSE=
set PATTERN=
set RUN_LINT=1
set RUN_FORMAT=1

REM Parser les arguments
:parse_args
if "%~1"=="" goto :start_tests
if /i "%~1"=="-h" goto :show_help
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-q" set QUICK=1
if /i "%~1"=="--quick" set QUICK=1
if /i "%~1"=="-c" set COVERAGE_HTML=1
if /i "%~1"=="--coverage" set COVERAGE_HTML=1
if /i "%~1"=="-v" set VERBOSE=-v
if /i "%~1"=="--verbose" set VERBOSE=-v
if /i "%~1"=="--no-lint" set RUN_LINT=0
if /i "%~1"=="--no-format" set RUN_FORMAT=0
shift
goto :parse_args

:show_help
echo Usage: run_tests.bat [OPTIONS]
echo.
echo Options:
echo     -h, --help          Afficher cette aide
echo     -q, --quick         Tests rapides seulement (sans coverage)
echo     -c, --coverage      Générer le rapport de coverage HTML
echo     -v, --verbose       Mode verbose
echo     --no-lint           Sauter le linting
echo     --no-format         Sauter le formatage
echo.
echo Exemples:
echo     run_tests.bat                # Tous les tests avec coverage
echo     run_tests.bat -q             # Tests rapides
echo     run_tests.bat -c -v          # Coverage HTML en verbose
echo.
exit /b 0

:start_tests

REM Vérifier pytest
where pytest >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] pytest n'est pas installe
    echo Installer avec: pip install -r requirements_test.txt
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║   Tests Habits Manager                 ║
echo ╔════════════════════════════════════════╗
echo.

REM Formatage
if %RUN_FORMAT%==1 if %QUICK%==0 (
    echo ==^> Formatage du code avec Black...
    where black >nul 2>nul
    if %errorlevel%==0 (
        black custom_components\habits_manager tests
        echo [OK] Code formate
    ) else (
        echo [WARNING] Black non installe, passage ignore
    )
    echo.
)

REM Linting
if %RUN_LINT%==1 if %QUICK%==0 (
    echo ==^> Linting avec Ruff...
    where ruff >nul 2>nul
    if %errorlevel%==0 (
        ruff check custom_components\habits_manager tests
        echo [OK] Linting OK
    ) else (
        echo [WARNING] Ruff non installe, passage ignore
    )
    echo.
)

REM Construction de la commande pytest
set PYTEST_CMD=pytest %VERBOSE%

REM Coverage
if %QUICK%==0 (
    set PYTEST_CMD=!PYTEST_CMD! --cov=custom_components.habits_manager
    if %COVERAGE_HTML%==1 (
        set PYTEST_CMD=!PYTEST_CMD! --cov-report=html --cov-report=term-missing
    ) else (
        set PYTEST_CMD=!PYTEST_CMD! --cov-report=term-missing
    )
)

REM Exécution des tests
echo ==^> Execution des tests...
echo Commande: !PYTEST_CMD!
echo.

call !PYTEST_CMD!

if %errorlevel%==0 (
    echo.
    echo [OK] Tous les tests sont passes !

    if %COVERAGE_HTML%==1 (
        echo.
        echo [OK] Rapport de coverage HTML genere dans htmlcov\
        echo Ouvrir avec: start htmlcov\index.html
    )

    echo.
    echo ╔════════════════════════════════════════╗
    echo ║   ✓ Tests reussis                      ║
    echo ╔════════════════════════════════════════╗
    echo.
    exit /b 0
) else (
    echo.
    echo [ERREUR] Des tests ont echoue
    echo.
    echo ╔════════════════════════════════════════╗
    echo ║   ✗ Tests echoues                      ║
    echo ╔════════════════════════════════════════╗
    echo.
    exit /b 1
)
