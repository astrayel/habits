# ================================================================
# Script de Watch Développement Frontend - Habits Manager
# ================================================================
# Ce script surveille les fichiers TypeScript, recompile automatiquement
# et synchronise vers Home Assistant.
#
# Usage:
#   .\dev-watch.ps1              # Watch avec sync auto vers HA
#   .\dev-watch.ps1 -NoSync      # Watch sans sync (build local uniquement)
# ================================================================

param(
    [switch]$NoSync,
    [string]$Host = "homeassistant",
    [string]$User = "root",
    [string]$RemotePath = "/config/custom_components/habits_manager/www"
)

$ErrorActionPreference = "Stop"

# Couleurs pour les messages
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "  Habits Manager - Mode Watch Développement"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

if ($NoSync) {
    Write-Warning "Mode local uniquement (pas de sync vers HA)"
} else {
    Write-Info "Mode sync automatique vers $Host"
    Write-Info "Les fichiers seront copiés après chaque compilation"
}

Write-Host ""
Write-Info "📦 Lancement du watch mode de Rollup..."
Write-Host ""

# Démarrer npm run watch en arrière-plan
$watchProcess = Start-Process -FilePath "npm" -ArgumentList "run", "watch" -NoNewWindow -PassThru

# Si NoSync, on s'arrête là
if ($NoSync) {
    Write-Info "✓ Watch mode démarré (PID: $($watchProcess.Id))"
    Write-Info "  Appuyez sur Ctrl+C pour arrêter"
    Wait-Process -Id $watchProcess.Id
    exit
}

# Sinon, on surveille le dossier dist/ pour les changements
Write-Info "✓ Watch mode démarré (PID: $($watchProcess.Id))"
Write-Info "🔍 Surveillance du dossier dist/ pour les changements..."
Write-Host ""

$lastSync = @{}
$syncDelay = 2 # Délai en secondes avant sync (pour éviter les syncs multiples)

try {
    while ($true) {
        Start-Sleep -Seconds 1

        # Vérifier si le processus watch tourne toujours
        if ($watchProcess.HasExited) {
            Write-Warning "⚠ Le processus watch s'est arrêté"
            break
        }

        # Vérifier les fichiers .js dans dist/
        $jsFiles = Get-ChildItem "dist/*.js" -ErrorAction SilentlyContinue

        foreach ($file in $jsFiles) {
            $filename = $file.Name
            $lastWrite = $file.LastWriteTime

            # Si le fichier a changé récemment
            if (-not $lastSync.ContainsKey($filename) -or
                ($lastWrite - $lastSync[$filename]).TotalSeconds -gt $syncDelay) {

                Write-Info "🔄 Détection de changement: $filename"
                Write-Host "  → Copie vers $Host..."

                # Copier vers HA
                try {
                    scp -q "$($file.FullName)" "${User}@${Host}:${RemotePath}/" 2>&1 | Out-Null
                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "  ✓ $filename synchronisé"
                        $lastSync[$filename] = $lastWrite
                        Write-Warning "  💡 Rechargez la page dans votre navigateur (F5)"
                        Write-Host ""
                    } else {
                        Write-Error "  ✗ Erreur lors de la copie"
                    }
                } catch {
                    Write-Error "  ✗ Erreur: $_"
                }
            }
        }
    }
} finally {
    # Nettoyer à la sortie
    if (-not $watchProcess.HasExited) {
        Write-Info "`n🛑 Arrêt du watch mode..."
        Stop-Process -Id $watchProcess.Id -Force
    }
}
