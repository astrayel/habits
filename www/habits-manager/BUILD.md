# Build des cartes Kids Tasks pour habits-manager

## Vue d'ensemble

Ce projet contient les cartes **Kids Tasks** adaptées pour fonctionner avec le backend **habits-manager**.

Les cartes portent les noms originaux de [kids-tasks-ha-card](https://github.com/astrayel/kids-tasks-ha-card) mais utilisent le backend `habits_manager` au lieu de `kids_tasks`.

---

## Scripts npm disponibles

### Build en mode production
```bash
npm run build
```
- Compile `src/cards/main.js` → `dist/kids-tasks-card.js`
- **Code minifié** avec Terser
- **Sans sourcemaps**
- Variables d'environnement: `__DEV__=false`, `__PROD__=true`
- **Copie automatique** vers `custom_components/habits_manager/www/`

### Build en mode développement
```bash
npm run build:dev
```
- Compile `src/cards/main.js` → `dist/kids-tasks-card.dev.js`
- **Code lisible** (non minifié)
- **Avec sourcemaps** pour le débogage
- Variables d'environnement: `__DEV__=true`, `__PROD__=false`
- **Copie automatique** vers `custom_components/habits_manager/www/`

### Watch mode (développement avec auto-rebuild)
```bash
npm run watch
```
- Recompile automatiquement à chaque modification de fichier
- Mode développement
- Utile pour le développement actif

---

## Vérifier le build

### 1. Fichiers compilés générés
```bash
ls -lh dist/kids-tasks-card*.js
```
Attendu:
- `kids-tasks-card.js` (173K) - Production
- `kids-tasks-card.dev.js` (241K) - Développement

### 2. Fichiers copiés dans Home Assistant
```bash
ls -lh ../../custom_components/habits_manager/www/kids-tasks-card*.js
```

### 3. Vérifier les adaptations habits-manager
```bash
grep -m 5 "habits_manager" dist/kids-tasks-card.dev.js
```
Vous devriez voir :
- `const SERVICE_DOMAIN = 'habits_manager';`
- `const ENTITY_PREFIX = 'habits_manager';`

---

## Utiliser les cartes dans Home Assistant

### 1. Ajouter la ressource dans Lovelace

**Mode développement** :
```yaml
resources:
  - url: /local/community/habits_manager/kids-tasks-card.dev.js
    type: module
```

**Mode production** :
```yaml
resources:
  - url: /local/community/habits_manager/kids-tasks-card.js
    type: module
```

### 2. Créer les cartes dans votre dashboard

**Carte dashboard (vue d'ensemble familiale)** :
```yaml
type: custom:kids-tasks-card
title: "Tableau de bord familial"
```
En dev: `custom:kids-tasks-card-dev`

**Carte enfant (interface individuelle)** :
```yaml
type: custom:kids-tasks-child-card
child_id: "child_001"
title: "Mon espace"
show_avatar: true
```
En dev: `custom:kids-tasks-child-card-dev`

**Onglets disponibles** :
- ✅ **Tâches** (actives, bonus, terminées)
- ⭐ **Habitudes** (avec suivi de streaks)
- 🎁 **Récompenses** (récompenses réelles)
- 🛍️ **Boutique** (cosmétiques avec raretés)
- 📈 **Historique**

**Carte manager (administration)** :
```yaml
type: custom:kids-tasks-manager
```
En dev: `custom:kids-tasks-manager-dev`

**Sections disponibles** :
- 👨‍👩‍👧‍👦 **Enfants** (CRUD)
- 📋 **Tâches** (CRUD avec workflow de validation)
- ⭐ **Habitudes** (CRUD avec bonus de streaks)
- 🎁 **Récompenses** (CRUD)
- 🛍️ **Cosmétiques** (CRUD avec raretés)
- ✅ **Validation** (file d'attente parent)

---

## Debugging en mode développement

Quand `__DEV__ = true`, les cartes exposent des utilitaires de débogage :

### Console du navigateur
```javascript
// Informations système
window.KidsTasksDebug.systemInfo()

// Recharger toutes les cartes
window.KidsTasksDebug.reloadAllCards()

// Recharger une carte spécifique
const card = document.querySelector('kids-tasks-child-card-dev');
window.KidsTasksDebug.reloadCard(card)

// Inspecter une carte
window.KidsTasksDebug.inspectCard(card)

// Performance
window.KidsTasksDebug.performance.report()
window.KidsTasksDebug.performance.toggle()

// Erreurs
window.KidsTasksDebug.errors.stats()
window.KidsTasksDebug.errors.clear()

// Accessibilité
window.KidsTasksDebug.accessibility.announce("Message")
```

---

## Architecture

```
www/habits-manager/
├── rollup.config.js          # Configuration de build
├── package.json              # Scripts npm et dépendances
├── src/
│   └── cards/                # Sources des cartes
│       ├── main.js           # Point d'entrée
│       ├── base-card.js      # Classe de base (adapté pour habits-manager)
│       ├── card.js           # Carte dashboard
│       ├── child-card.js     # Carte enfant (+ Habitudes + Cosmétiques)
│       ├── manager-card.js   # Carte administration
│       ├── constants.js      # Mappings kids_tasks → habits_manager
│       ├── service-adapter.js
│       ├── data-adapter.js
│       └── ...
│
├── dist/                     # Builds générés
│   ├── kids-tasks-card.js        # Production (173K)
│   └── kids-tasks-card.dev.js    # Développement (241K)
│
└── ../../custom_components/habits_manager/www/
    ├── kids-tasks-card.js        # Copie auto (prod)
    └── kids-tasks-card.dev.js    # Copie auto (dev)
```

---

## Adaptations pour habits-manager

| Aspect | Original (kids-tasks-ha) | Adapté (habits-manager) |
|--------|--------------------------|-------------------------|
| **Backend** | `kids_tasks` | `habits_manager` |
| **Entités** | `sensor.kidtasks_*` | `sensor.habits_manager_*` |
| **Services** | `kids_tasks.complete_task` | `habits_manager.mark_task_completed` |
| **Nouveautés** | - | ⭐ Habitudes, 🛍️ Cosmétiques, ✅ Validation |

### Services utilisés

**kids_tasks (original)** → **habits_manager (adapté)** :
- `complete_task` → `mark_task_completed`
- `remove_child` → `delete_child`

**Nouveaux services** :
- `validate_task` - Validation parentale des tâches
- `refuse_task` - Refus avec option de pénalités
- `approve_claim` - Approbation des réclamations
- `complete_habit` - Complétion d'habitudes avec streaks
- `purchase_cosmetic` - Achat de cosmétiques
- `list_habits`, `list_cosmetics` - Listing des nouvelles entités

---

## Workflow de développement

### 1. Modifier le code source
```bash
# Éditer les fichiers dans:
src/cards/
```

### 2. Recompiler en watch mode
```bash
npm run watch
```

### 3. Recharger Home Assistant
- Vider le cache du navigateur (Ctrl+F5)
- Ou redémarrer Home Assistant

### 4. Tester
- Ouvrir la console du navigateur
- Vérifier les logs avec `window.KidsTasksDebug`

---

## Troubleshooting

### Erreur: "rollup: not found"
```bash
npm install
```

### Erreur: "Cannot find module"
Vérifiez que tous les fichiers sont présents dans `src/cards/`

### Les cartes n'apparaissent pas dans Lovelace
1. Vérifiez que le fichier est bien dans `custom_components/habits_manager/www/`
2. Videz le cache du navigateur (Ctrl+Shift+F5)
3. Vérifiez dans la console : `customElements.get('kids-tasks-card-dev')`

### Les adaptations habits-manager ne fonctionnent pas
Vérifiez que le build contient les bonnes constantes :
```bash
grep "habits_manager" dist/kids-tasks-card.dev.js
```

### Erreur lors du build
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build:dev
```

---

## Différences avec le repo original

Ce projet est une **adaptation** de [kids-tasks-ha-card](https://github.com/astrayel/kids-tasks-ha-card) :

✅ **Conservé** :
- Noms des cartes identiques
- Structure du code
- Interface utilisateur

✅ **Adapté** :
- Backend `habits_manager` au lieu de `kids_tasks`
- Préfixe d'entités `habits_manager_*`
- Nouveaux services API

➕ **Ajouté** :
- **Onglet Habitudes** avec système de streaks
- **Boutique de cosmétiques** avec 4 raretés
- **File de validation** parentale
- Adaptateurs de service et données

---

## Ressources

- [Documentation des cartes](./src/cards/README.md)
- [Plan de migration](../../MIGRATION_PLAN.md)
- [Synthèse de migration](../../MIGRATION_SUMMARY.md)
- [Rollup config](./rollup.config.js)
- [Repo original](https://github.com/astrayel/kids-tasks-ha-card)
