# 🚀 Démarrage Rapide - Développement

Guide rapide pour commencer à développer sur Windows avec Home Assistant en SSH.

## ⚡ Setup Initial (Une seule fois)

### 1. Tester SSH

```powershell
ssh root@homeassistant "echo 'OK'"
```

✅ Si ça affiche "OK", passez à l'étape 2
❌ Si erreur, configurez SSH d'abord (voir README-DEV.md)

### 2. Installer les dépendances frontend

```powershell
cd www\habits-manager
npm install
```

## 🔨 Développement Quotidien

### Scénario 1 : Je modifie le Backend Python

```powershell
# 1. Modifier les fichiers Python dans custom_components/habits_manager/

# 2. Synchroniser vers HA
.\dev-sync.ps1 -Backend

# 3. Redémarrer quand demandé (ou dire Non et redémarrer plus tard)

# 4. Tester dans Home Assistant
```

### Scénario 2 : Je modifie le Frontend TypeScript

```powershell
# 1. Ouvrir un terminal PowerShell

# 2. Lancer le mode watch automatique
cd www\habits-manager
.\dev-watch.ps1

# 3. Dans VSCode, modifier vos fichiers .ts dans src/

# 4. Sauvegarder (Ctrl+S)
#    → La compilation et le sync se font automatiquement !

# 5. Recharger le navigateur (F5) pour voir les changements

# 6. Répéter étapes 3-5 autant que nécessaire

# 7. Quand terminé : Ctrl+C pour arrêter le watch
```

### Scénario 3 : Je modifie Backend ET Frontend

```powershell
# Terminal 1 - Watch Frontend
cd www\habits-manager
.\dev-watch.ps1

# Terminal 2 - Sync Backend quand vous modifiez Python
.\dev-sync.ps1 -Backend
```

## 📦 Avant de Commit

```powershell
# 1. Arrêter le watch mode (Ctrl+C si actif)

# 2. Compiler le frontend
cd www\habits-manager
npm run build

# 3. Copier les bundles compilés
Copy-Item dist\*.js ..\..\custom_components\habits_manager\www\

# 4. Commit normalement
cd ..\..
git add .
git commit -m "feat: ma nouvelle fonctionnalité"
git push
```

## 🎯 Commandes Essentielles

| Commande | Usage |
|----------|-------|
| `.\dev-sync.ps1` | Sync tout vers HA |
| `.\dev-sync.ps1 -Backend` | Sync uniquement Python |
| `.\dev-sync.ps1 -Frontend` | Sync uniquement JS |
| `.\dev-sync.ps1 -NoRestart` | Sync sans redémarrer HA |
| `.\dev-watch.ps1` | Watch frontend avec sync auto |
| `.\dev-watch.ps1 -NoSync` | Watch sans sync (local) |

## 🐛 Problèmes Fréquents

**"ssh: Could not resolve hostname"**
→ Utilisez l'IP : `.\dev-sync.ps1 -Host "192.168.1.XXX"`

**"Permission denied"**
→ Configurez l'authentification SSH (voir README-DEV.md)

**Les changements ne s'affichent pas**
→ Rechargez avec Ctrl+F5 (force reload)

**npm not found**
→ Installez Node.js : https://nodejs.org/

## 📖 Documentation Complète

Pour plus de détails, consultez **README-DEV.md**
