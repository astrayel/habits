# ================================================================
# Script de Synchronisation Developpement - Habits Manager
# ================================================================
# Ce script synchronise les fichiers locaux vers Home Assistant via SSH
# et redemarre l'integration pour appliquer les changements.
#
# Usage:
#   .\dev-sync.ps1              # Sync tout
#   .\dev-sync.ps1 -Backend     # Sync uniquement backend Python
#   .\dev-sync.ps1 -Frontend    # Sync uniquement frontend JS
#   .\dev-sync.ps1 -NoRestart   # Ne pas redemarrer HA
# ================================================================

param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$NoRestart,
    [string]$HAHost = "homeassistant",
    [string]$User = "root",
    [string]$RemotePath = "/config/custom_components/habits_manager"
)

$ErrorActionPreference = "Stop"

# Options SSH pour compatibilite
$SshOptions = "-o MACs=hmac-sha2-512-etm@openssh.com"

# Couleurs pour les messages
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-ErrorMsg { Write-Host $args -ForegroundColor Red }

Write-Info "==============================================================="
Write-Info "  Habits Manager - Synchronisation Developpement"
Write-Info "==============================================================="
Write-Host ""

# Verifier que SSH fonctionne
Write-Info "[1/4] Verification de la connexion SSH a $HAHost..."
try {
    $testConnection = ssh $SshOptions "${User}@${HAHost}" "echo 'OK'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Connexion SSH echouee"
    }
    Write-Success "  [OK] Connexion SSH OK"
}
catch {
    Write-ErrorMsg "  [ERREUR] Impossible de se connecter a $HAHost"
    Write-ErrorMsg "  Assurez-vous que:"
    Write-ErrorMsg "    1. SSH est active sur Home Assistant"
    Write-ErrorMsg "    2. Vous avez configure l'authentification par cle SSH"
    Write-ErrorMsg "    3. L'hostname 'homeassistant' est correct"
    exit 1
}

Write-Host ""

# Determiner quoi synchroniser
$syncBackend = $Backend -or (-not $Frontend)
$syncFrontend = $Frontend -or (-not $Backend)

# ================================================================
# Synchronisation Backend Python
# ================================================================
if ($syncBackend) {
    Write-Info "[2/4] Synchronisation du backend Python..."

    # Creer le dossier distant si necessaire
    ssh $SshOptions "${User}@${HAHost}" "mkdir -p $RemotePath" 2>&1 | Out-Null

    # Copier les fichiers Python
    $files = @(
        "custom_components/habits_manager/__init__.py",
        "custom_components/habits_manager/const.py",
        "custom_components/habits_manager/sensor.py",
        "custom_components/habits_manager/manifest.json",
        "custom_components/habits_manager/services.yaml"
    )

    foreach ($file in $files) {
        if (Test-Path $file) {
            $filename = Split-Path $file -Leaf
            Write-Host "  -> $filename"
            scp $SshOptions -q "$file" "${User}@${HAHost}:${RemotePath}/" 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-ErrorMsg "  [ERREUR] Erreur lors de la copie de $file"
                exit 1
            }
        }
    }

    # Copier le dossier managers
    if (Test-Path "custom_components/habits_manager/managers") {
        Write-Host "  -> managers/"
        ssh $SshOptions "${User}@${HAHost}" "mkdir -p ${RemotePath}/managers" 2>&1 | Out-Null
        scp $SshOptions -q -r "custom_components/habits_manager/managers/*" "${User}@${HAHost}:${RemotePath}/managers/" 2>&1 | Out-Null
    }

    Write-Success "  [OK] Backend synchronise"
}

# ================================================================
# Synchronisation Frontend JavaScript
# ================================================================
if ($syncFrontend) {
    Write-Info "[3/4] Synchronisation du frontend JavaScript..."

    # Creer le dossier www distant
    ssh $SshOptions "${User}@${HAHost}" "mkdir -p ${RemotePath}/www" 2>&1 | Out-Null

    # Copier les bundles compiles
    $jsFiles = Get-ChildItem "custom_components/habits_manager/www/*.js" -ErrorAction SilentlyContinue

    if ($jsFiles.Count -eq 0) {
        Write-Warning "  [ATTENTION] Aucun fichier JS trouve dans custom_components/habits_manager/www/"
        Write-Warning "  Assurez-vous d'avoir compile le frontend avec 'npm run build'"
    }
    else {
        foreach ($file in $jsFiles) {
            Write-Host "  -> $($file.Name)"
            scp $SshOptions -q "$($file.FullName)" "${User}@${HAHost}:${RemotePath}/www/" 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-ErrorMsg "  [ERREUR] Erreur lors de la copie de $($file.Name)"
                exit 1
            }
        }
        Write-Success "  [OK] Frontend synchronise"
    }
}

Write-Host ""

# ================================================================
# Redemarrage de Home Assistant
# ================================================================
if (-not $NoRestart) {
    Write-Info "[4/4] Redemarrage de l'integration Habits Manager..."
    Write-Host ""
    Write-Warning "  Un redemarrage complet de Home Assistant est recommande"
    Write-Host "  Voulez-vous redemarrer maintenant ? (O/N)"
    $response = Read-Host

    if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
        Write-Info "  Envoi de la commande de redemarrage..."
        ssh $SshOptions "${User}@${HAHost}" "ha core restart" 2>&1 | Out-Null
        Write-Success "  [OK] Commande de redemarrage envoyee"
        Write-Info "  Home Assistant redemarre... (attendez environ 30-60 secondes)"
    }
    else {
        Write-Warning "  [ANNULE] Redemarrage annule - pensez a redemarrer manuellement"
    }
}
else {
    Write-Warning "  [INFO] Option -NoRestart activee - pensez a redemarrer HA manuellement"
}

Write-Host ""
Write-Success "==============================================================="
Write-Success "  Synchronisation terminee avec succes !"
Write-Success "==============================================================="
Write-Host ""
Write-Info "Astuce: Pour synchroniser automatiquement le frontend:"
Write-Info "  cd www/habits-manager"
Write-Info "  .\dev-watch.ps1"
Write-Host ""
