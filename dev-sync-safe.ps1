# Habits Manager - Script de Synchronisation Developpement
# Usage:
#   .\dev-sync-safe.ps1                  # Sync tout
#   .\dev-sync-safe.ps1 -Backend         # Sync uniquement backend Python
#   .\dev-sync-safe.ps1 -Frontend        # Sync uniquement frontend JS
#   .\dev-sync-safe.ps1 -NoRestart       # Ne pas redemarrer HA
#   .\dev-sync-safe.ps1 -HAHost "192.168.1.100"  # Specifier l'IP/hostname

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

function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-ErrorMsg { Write-Host $args -ForegroundColor Red }

Write-Info "==============================================================="
Write-Info "  Habits Manager - Synchronisation Developpement"
Write-Info "==============================================================="
Write-Host ""

# Verifier SSH
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
    Write-ErrorMsg "    3. L'hostname est correct (essayez avec l'IP)"
    exit 1
}

Write-Host ""

$syncBackend = $Backend -or (-not $Frontend)
$syncFrontend = $Frontend -or (-not $Backend)

# Sync Backend
if ($syncBackend) {
    Write-Info "[2/4] Synchronisation du backend Python..."

    ssh $SshOptions "${User}@${HAHost}" "mkdir -p $RemotePath" 2>&1 | Out-Null

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

    if (Test-Path "custom_components/habits_manager/managers") {
        Write-Host "  -> managers/"
        ssh $SshOptions "${User}@${HAHost}" "mkdir -p ${RemotePath}/managers" 2>&1 | Out-Null
        scp $SshOptions -q -r "custom_components/habits_manager/managers/*" "${User}@${HAHost}:${RemotePath}/managers/" 2>&1 | Out-Null
    }

    Write-Success "  [OK] Backend synchronise"
}

# Sync Frontend
if ($syncFrontend) {
    Write-Info "[3/4] Synchronisation du frontend JavaScript..."

    ssh $SshOptions "${User}@${HAHost}" "mkdir -p ${RemotePath}/www" 2>&1 | Out-Null

    $jsFiles = Get-ChildItem "custom_components/habits_manager/www/*.js" -ErrorAction SilentlyContinue

    if ($jsFiles.Count -eq 0) {
        Write-Warning "  [ATTENTION] Aucun fichier JS trouve"
        Write-Warning "  Assurez-vous d'avoir compile avec 'npm run build'"
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

# Redemarrage
if (-not $NoRestart) {
    Write-Info "[4/4] Redemarrage de Home Assistant..."
    Write-Host ""
    Write-Warning "  Un redemarrage complet est recommande"
    Write-Host "  Voulez-vous redemarrer maintenant ? (O/N)"
    $response = Read-Host

    if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
        Write-Info "  Envoi de la commande de redemarrage..."
        ssh $SshOptions "${User}@${HAHost}" "ha core restart" 2>&1 | Out-Null
        Write-Success "  [OK] Commande envoyee"
        Write-Info "  Home Assistant redemarre... (30-60 secondes)"
    }
    else {
        Write-Warning "  [ANNULE] Pensez a redemarrer manuellement"
    }
}
else {
    Write-Warning "  [INFO] Option -NoRestart - redemarrez manuellement"
}

Write-Host ""
Write-Success "==============================================================="
Write-Success "  Synchronisation terminee avec succes !"
Write-Success "==============================================================="
Write-Host ""
Write-Info "Astuce: cd www\habits-manager puis npm run watch"
Write-Host ""
