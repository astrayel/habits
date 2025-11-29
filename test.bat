@echo off
REM Script simplifié pour lancer les tests avec activation automatique du venv
REM Usage: test.bat [options pytest]

REM Vérifier si venv existe
if not exist "venv\Scripts\activate.bat" (
    echo [ERREUR] Environnement virtuel non trouve
    echo Lancez d'abord: setup_tests.bat
    exit /b 1
)

REM Activer venv
call venv\Scripts\activate.bat

REM Lancer les tests avec les arguments passés
if "%~1"=="" (
    REM Pas d'arguments, lancer tous les tests avec coverage
    pytest --cov=custom_components.habits_manager --cov-report=term-missing
) else (
    REM Passer tous les arguments à pytest
    pytest %*
)

REM Désactiver venv
deactivate
