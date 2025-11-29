@echo off
REM Script d'installation de l'environnement de test
REM Usage: setup_tests.bat

echo.
echo ╔════════════════════════════════════════╗
echo ║   Setup Tests - Habits Manager         ║
echo ╔════════════════════════════════════════╗
echo.

REM Vérifier si venv existe déjà
if exist "venv\Scripts\activate.bat" (
    echo [INFO] Environnement virtuel existant detecte
    goto :activate_venv
)

echo [1/3] Creation de l'environnement virtuel...
python -m venv venv
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible de creer l'environnement virtuel
    echo Verifiez que Python est installe correctement
    exit /b 1
)
echo [OK] Environnement virtuel cree

:activate_venv
echo.
echo [2/3] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible d'activer l'environnement virtuel
    exit /b 1
)
echo [OK] Environnement virtuel active

echo.
echo [3/3] Installation des dependances...
python -m pip install --upgrade pip
pip install -r requirements_test.txt
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible d'installer les dependances
    exit /b 1
)
echo [OK] Dependances installees

echo.
echo ╔════════════════════════════════════════╗
echo ║   ✓ Setup termine avec succes          ║
echo ╔════════════════════════════════════════╗
echo.
echo Pour lancer les tests:
echo   1. Activer l'environnement: venv\Scripts\activate
echo   2. Lancer les tests: pytest
echo.
echo Ou utilisez directement: test.bat
echo.

pause
