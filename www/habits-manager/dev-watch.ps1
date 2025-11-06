# ================================================================
# Script de Watch Developpement Frontend - Habits Manager
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

Write-Info "==============================================================="
Write-Info "  Habits Manager - Mode Watch Developpement"
Write-Info "==============================================================="
Write-Host ""

if ($NoSync) {
    Write-Warning "Mode local uniquement (pas de sync vers HA)"
}
else {
    Write-Info "Mode sync automatique vers $Host"
    Write-Info "Les fichiers seront copies apres chaque compilation"
}

Write-Host ""
Write-Info "[1/2] Lancement du watch mode de Rollup..."
Write-Host ""

# Demarrer npm run watch en arriere-plan
$watchProcess = Start-Process -FilePath "npm" -ArgumentList "run", "watch" -WorkingDirectory (Get-Location) -NoNewWindow -PassThru

# Si NoSync, on s'arrete la
if ($NoSync) {
    Write-Info "[OK] Watch mode demarre (PID: $($watchProcess.Id))"
    Write-Info "  Appuyez sur Ctrl+C pour arreter"
    Wait-Process -Id $watchProcess.Id
    exit
}

# Sinon, on surveille le dossier dist/ pour les changements
Write-Info "[OK] Watch mode demarre (PID: $($watchProcess.Id))"
Write-Info "[2/2] Surveillance du dossier dist/ pour les changements..."
Write-Host ""

$lastSync = @{}
$syncDelay = 2 # Delai en secondes avant sync (pour eviter les syncs multiples)

try {
    while ($true) {
        Start-Sleep -Seconds 1

        # Verifier si le processus watch tourne toujours
        if ($watchProcess.HasExited) {
            Write-Warning "  [ATTENTION] Le processus watch s'est arrete"
            break
        }

        # Verifier les fichiers .js dans dist/
        $jsFiles = Get-ChildItem "dist/*.js" -ErrorAction SilentlyContinue

        foreach ($file in $jsFiles) {
            $filename = $file.Name
            $lastWrite = $file.LastWriteTime

            # Si le fichier a change recemment
            if (-not $lastSync.ContainsKey($filename) -or
                ($lastWrite - $lastSync[$filename]).TotalSeconds -gt $syncDelay) {

                Write-Info "[CHANGEMENT] Detection: $filename"
                Write-Host "  -> Copie vers $Host..."

                # Copier vers HA
                try {
                    scp -q "$($file.FullName)" "${User}@${Host}:${RemotePath}/" 2>&1 | Out-Null
                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "  [OK] $filename synchronise"
                        $lastSync[$filename] = $lastWrite
                        Write-Warning "  [INFO] Rechargez la page dans votre navigateur (F5)"
                        Write-Host ""
                    }
                    else {
                        Write-Host "  [ERREUR] Erreur lors de la copie" -ForegroundColor Red
                    }
                }
                catch {
                    Write-Host "  [ERREUR] $_" -ForegroundColor Red
                }
            }
        }
    }
}
finally {
    # Nettoyer a la sortie
    if (-not $watchProcess.HasExited) {
        Write-Info "`n[ARRET] Arret du watch mode..."
        Stop-Process -Id $watchProcess.Id -Force
    }
}
