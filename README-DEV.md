# Guide de Développement - Habits Manager

Ce guide explique comment développer et tester l'intégration Habits Manager efficacement sur Windows avec Home Assistant en SSH.

## 🏗️ Architecture

```
habits/
├── custom_components/habits_manager/    # Backend Python
│   ├── __init__.py                      # Point d'entrée, services
│   ├── const.py                         # Constantes
│   ├── sensor.py                        # Capteurs HA
│   ├── services.yaml                    # Schémas de services
│   ├── manifest.json                    # Métadonnées
│   ├── managers/                        # Gestionnaires métier
│   └── www/                             # Frontend compilé (copié depuis www/)
│
└── www/habits-manager/                  # Sources frontend TypeScript
    ├── src/                             # Code source TypeScript
    │   ├── cards/                       # Cartes Lovelace
    │   ├── components/                  # Composants réutilisables
    │   ├── services/                    # API client, store
    │   ├── types/                       # Types TypeScript
    │   └── styles/                      # Styles CSS
    ├── dist/                            # Bundles JS compilés
    └── package.json                     # Configuration npm
```

## 🚀 Configuration Initiale

### 1. Prérequis

- **Windows 11** avec PowerShell 5.1+
- **OpenSSH Client** (inclus dans Windows 10/11)
- **Node.js 18+** et **npm**
- **Git**
- **Home Assistant** accessible via SSH

### 2. Configuration SSH

Testez votre connexion SSH :

```powershell
ssh root@homeassistant "echo 'Connexion OK'"
```

**Si ça ne fonctionne pas**, configurez SSH sur Home Assistant :
1. Installez l'add-on "Terminal & SSH" ou "Advanced SSH & Web Terminal"
2. Configurez l'authentification par clé SSH (recommandé) :
   ```powershell
   # Générer une clé SSH (si vous n'en avez pas)
   ssh-keygen -t ed25519 -C "votre-email@example.com"

   # Copier la clé publique vers HA
   type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@homeassistant "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

### 3. Installation des Dépendances

```powershell
# Frontend
cd www/habits-manager
npm install
```

## 🔧 Workflow de Développement

### Option A : Développement Backend (Python)

1. **Modifier le code Python** dans `custom_components/habits_manager/`

2. **Synchroniser vers Home Assistant** :
   ```powershell
   .\dev-sync.ps1 -Backend
   ```

3. **Redémarrer HA** quand demandé (ou plus tard manuellement)

4. **Tester** dans Home Assistant

**Commandes disponibles :**
```powershell
.\dev-sync.ps1                # Sync backend + frontend
.\dev-sync.ps1 -Backend       # Sync uniquement backend
.\dev-sync.ps1 -NoRestart     # Sync sans redémarrer
```

### Option B : Développement Frontend (TypeScript/JS)

#### Mode Manuel (Build + Sync)

1. **Modifier le code TypeScript** dans `www/habits-manager/src/`

2. **Compiler** :
   ```powershell
   cd www/habits-manager
   npm run build
   ```

3. **Copier les bundles** :
   ```powershell
   Copy-Item dist/*.js ../../custom_components/habits_manager/www/
   ```

4. **Synchroniser vers HA** :
   ```powershell
   cd ../..
   .\dev-sync.ps1 -Frontend -NoRestart
   ```

5. **Recharger la page** dans le navigateur (F5)

#### Mode Automatique (Recommandé)

Lance un watch qui détecte les changements, recompile et synchronise automatiquement :

```powershell
cd www/habits-manager
.\dev-watch.ps1
```

**Ce script :**
1. 👀 Surveille les fichiers `.ts` dans `src/`
2. 🔨 Recompile automatiquement avec Rollup
3. 📤 Copie les bundles vers HA via SSH
4. 💡 Vous rappelle de recharger le navigateur (F5)

**Sortie :**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Habits Manager - Mode Watch Développement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mode sync automatique vers homeassistant
Les fichiers seront copiés après chaque compilation

📦 Lancement du watch mode de Rollup...
✓ Watch mode démarré (PID: 12345)
🔍 Surveillance du dossier dist/ pour les changements...

🔄 Détection de changement: habits-manager-card.js
  → Copie vers homeassistant...
  ✓ habits-manager-card.js synchronisé
  💡 Rechargez la page dans votre navigateur (F5)
```

**Pour arrêter :** Appuyez sur `Ctrl+C`

### Option C : Développement Full-Stack

Pour travailler sur backend ET frontend simultanément :

**Terminal 1 - Watch Frontend :**
```powershell
cd www/habits-manager
.\dev-watch.ps1
```

**Terminal 2 - Sync Backend quand nécessaire :**
```powershell
.\dev-sync.ps1 -Backend
```

## 📝 Bonnes Pratiques

### Avant de Commit

1. **Vérifier le linting** :
   ```powershell
   cd www/habits-manager
   npm run lint
   npm run format
   ```

2. **Builder le frontend** :
   ```powershell
   npm run build
   ```

3. **Copier les bundles** :
   ```powershell
   Copy-Item dist/*.js ../../custom_components/habits_manager/www/
   ```

4. **Tester sur HA** une dernière fois

5. **Commit et push** :
   ```powershell
   git add .
   git commit -m "fix: description du changement"
   git push
   ```

### Structure des Commits

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `refactor:` Refactoring sans changement de comportement
- `docs:` Documentation uniquement
- `style:` Formatage, point-virgules, etc.
- `test:` Ajout ou correction de tests
- `chore:` Maintenance (dépendances, config, etc.)

**Exemples :**
```
feat: Add habit streak bonuses
fix: Resolve task validation error
refactor: Extract child manager to separate file
docs: Update development workflow in README
```

## 🐛 Debugging

### Backend Python

**Logs Home Assistant :**
```bash
ssh root@homeassistant "tail -f /config/home-assistant.log | grep habits_manager"
```

**Logs en temps réel dans HA :**
Configuration > Journaux > Filtrer par "habits_manager"

**Ajouter des logs de debug :**
```python
_LOGGER.debug("Ma variable: %s", ma_variable)
_LOGGER.info("Information importante")
_LOGGER.error("Erreur: %s", err)
```

### Frontend JavaScript

**Console du navigateur :**
1. Appuyez sur `F12` dans votre navigateur
2. Onglet "Console"
3. Filtrez par "habits" ou "Store"

**Ajouter des logs de debug :**
```typescript
console.log('Store state:', this.state);
console.error('Error:', error);
```

## 🔄 Workflow Complet - Exemple

Supposons que vous voulez ajouter une nouvelle fonctionnalité "Récompenses quotidiennes" :

### Étape 1 : Backend

```powershell
# 1. Créer une branche
git checkout -b feat/daily-rewards

# 2. Modifier le backend
code custom_components/habits_manager/managers/reward_manager.py

# 3. Synchroniser et tester
.\dev-sync.ps1 -Backend
# Tester dans HA

# 4. Ajouter un service dans __init__.py
code custom_components/habits_manager/__init__.py

# 5. Re-sync et re-test
.\dev-sync.ps1 -Backend
```

### Étape 2 : Frontend

```powershell
# 1. Lancer le watch mode
cd www/habits-manager
.\dev-watch.ps1

# 2. Dans un autre terminal, modifier le code
code src/cards/habits-manager-card.ts

# 3. Sauvegarder (Ctrl+S)
# → Le watch détecte, recompile et sync automatiquement

# 4. Recharger le navigateur (F5)
# → Tester les changements

# 5. Répéter 2-4 jusqu'à satisfaction
```

### Étape 3 : Commit

```powershell
# 1. Arrêter le watch (Ctrl+C)

# 2. Copier les bundles
Copy-Item dist/*.js ../../custom_components/habits_manager/www/

# 3. Vérifier les changements
cd ../..
git status
git diff

# 4. Commit
git add .
git commit -m "feat: Add daily rewards system with frontend UI"

# 5. Push
git push origin feat/daily-rewards
```

## ⚙️ Options Avancées des Scripts

### dev-sync.ps1

```powershell
# Changer l'hôte SSH
.\dev-sync.ps1 -Host "192.168.1.100" -User "root"

# Changer le chemin distant
.\dev-sync.ps1 -RemotePath "/config/custom_components/habits_manager"

# Sync sans redémarrage
.\dev-sync.ps1 -NoRestart
```

### dev-watch.ps1

```powershell
# Watch sans synchronisation (build local uniquement)
.\dev-watch.ps1 -NoSync

# Changer l'hôte SSH
.\dev-watch.ps1 -Host "192.168.1.100" -User "root"
```

## 🆘 Problèmes Courants

### "ssh: Could not resolve hostname homeassistant"

**Solution :** Ajoutez l'IP de votre HA au fichier hosts :
```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```
Ajoutez :
```
192.168.1.XXX homeassistant
```

### "Permission denied (publickey)"

**Solution :** Configurez l'authentification par clé SSH ou ajoutez un mot de passe :
```powershell
ssh-copy-id root@homeassistant
```

### "npm: command not found"

**Solution :** Installez Node.js depuis https://nodejs.org/

### Les changements frontend ne s'affichent pas

**Solutions :**
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Rechargez avec Ctrl+F5 (force reload)
3. Vérifiez que les bundles ont bien été copiés vers HA
4. Vérifiez les erreurs dans la console (F12)

### Home Assistant ne redémarre pas

**Solution :** Redémarrez manuellement :
```powershell
ssh root@homeassistant "ha core restart"
```

## 📚 Ressources

- [Home Assistant Developer Docs](https://developers.home-assistant.io/)
- [Lit Element Documentation](https://lit.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PowerShell Docs](https://docs.microsoft.com/powershell/)

## 🎯 Checklist Avant Release

- [ ] Backend testé sur HA
- [ ] Frontend testé dans navigateur
- [ ] Aucune erreur dans les logs HA
- [ ] Aucune erreur dans la console navigateur
- [ ] Code formaté (`npm run format`)
- [ ] Linting passé (`npm run lint`)
- [ ] Frontend compilé et bundles copiés
- [ ] Commits propres avec messages descriptifs
- [ ] Branch pushée sur GitHub
- [ ] Documentation à jour

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez les logs détaillés.
