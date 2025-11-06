# ================================================================
# Script de Synchronisation Développement - Habits Manager
# ================================================================
# Ce script synchronise les fichiers locaux vers Home Assistant via SSH
# et redémarre l'intégration pour appliquer les changements.
#
# Usage:
#   .\dev-sync.ps1              # Sync tout
#   .\dev-sync.ps1 -Backend     # Sync uniquement backend Python
#   .\dev-sync.ps1 -Frontend    # Sync uniquement frontend JS
#   .\dev-sync.ps1 -NoRestart   # Ne pas redémarrer HA
# ================================================================

param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$NoRestart,
    [string]$Host = "homeassistant",
    [string]$User = "root",
    [string]$RemotePath = "/config/custom_components/habits_manager"
)

$ErrorActionPreference = "Stop"

# Couleurs pour les messages
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "  Habits Manager - Synchronisation Développement"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# Vérifier que SSH fonctionne
Write-Info "🔍 Vérification de la connexion SSH à $Host..."
try {
    $testConnection = ssh "${User}@${Host}" "echo 'OK'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Connexion SSH échouée"
    }
    Write-Success "✓ Connexion SSH OK"
} catch {
    Write-Error "✗ Impossible de se connecter à $Host"
    Write-Error "  Assurez-vous que:"
    Write-Error "  1. SSH est activé sur Home Assistant"
    Write-Error "  2. Vous avez configuré l'authentification par clé SSH"
    Write-Error "  3. L'hostname 'homeassistant' est correct"
    exit 1
}

Write-Host ""

# Déterminer quoi synchroniser
$syncBackend = $Backend -or (-not $Frontend)
$syncFrontend = $Frontend -or (-not $Backend)

# ================================================================
# Synchronisation Backend Python
# ================================================================
if ($syncBackend) {
    Write-Info "📦 Synchronisation du backend Python..."

    # Créer le dossier distant si nécessaire
    ssh "${User}@${Host}" "mkdir -p $RemotePath"

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
            Write-Host "  → $filename"
            scp -q "$file" "${User}@${Host}:${RemotePath}/" 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Error "✗ Erreur lors de la copie de $file"
                exit 1
            }
        }
    }

    # Copier le dossier managers
    if (Test-Path "custom_components/habits_manager/managers") {
        Write-Host "  → managers/"
        ssh "${User}@${Host}" "mkdir -p ${RemotePath}/managers"
        scp -q -r "custom_components/habits_manager/managers/*" "${User}@${Host}:${RemotePath}/managers/" 2>&1 | Out-Null
    }

    Write-Success "✓ Backend synchronisé"
}

# ================================================================
# Synchronisation Frontend JavaScript
# ================================================================
if ($syncFrontend) {
    Write-Info "📦 Synchronisation du frontend JavaScript..."

    # Créer le dossier www distant
    ssh "${User}@${Host}" "mkdir -p ${RemotePath}/www"

    # Copier les bundles compilés
    $jsFiles = Get-ChildItem "custom_components/habits_manager/www/*.js" -ErrorAction SilentlyContinue

    if ($jsFiles.Count -eq 0) {
        Write-Warning "⚠ Aucun fichier JS trouvé dans custom_components/habits_manager/www/"
        Write-Warning "  Assurez-vous d'avoir compilé le frontend avec 'npm run build'"
    } else {
        foreach ($file in $jsFiles) {
            Write-Host "  → $($file.Name)"
            scp -q "$($file.FullName)" "${User}@${Host}:${RemotePath}/www/" 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Error "✗ Erreur lors de la copie de $($file.Name)"
                exit 1
            }
        }
        Write-Success "✓ Frontend synchronisé"
    }
}

Write-Host ""

# ================================================================
# Redémarrage de Home Assistant
# ================================================================
if (-not $NoRestart) {
    Write-Info "🔄 Redémarrage de l'intégration Habits Manager..."

    # Option 1: Recharger uniquement les custom components (plus rapide mais pas toujours disponible)
    # Option 2: Redémarrage complet de HA (plus lent mais garantit le chargement)

    Write-Warning "⚠ Un redémarrage complet de Home Assistant est recommandé"
    Write-Host "  Voulez-vous redémarrer maintenant ? (O/N)"
    $response = Read-Host

    if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
        Write-Info "  Envoi de la commande de redémarrage..."
        ssh "${User}@${Host}" "ha core restart" 2>&1 | Out-Null
        Write-Success "✓ Commande de redémarrage envoyée"
        Write-Info "  Home Assistant redémarre... (attendez ~30-60 secondes)"
    } else {
        Write-Warning "⚠ Redémarrage annulé - pensez à redémarrer manuellement"
    }
} else {
    Write-Warning "⚠ Option -NoRestart activée - pensez à redémarrer HA manuellement"
}

Write-Host ""
Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Success "  Synchronisation terminée avec succès !"
Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Info "💡 Astuce: Pour synchroniser automatiquement le frontend:"
Write-Info "   cd www/habits-manager"
Write-Info "   npm run dev"
Write-Host ""
