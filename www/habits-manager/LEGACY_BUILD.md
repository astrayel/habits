# Build des cartes Legacy (kids-tasks-ha-card adaptées)

## Vue d'ensemble

Ce document explique comment compiler les cartes **kids-tasks-legacy** qui ont été adaptées pour fonctionner avec le backend **habits-manager**.

---

## Scripts npm disponibles

### Build en mode développement
```bash
npm run build:legacy:dev
```
- Compile `src/cards/kids-tasks-legacy/main.js` → `dist/kids-tasks-legacy.dev.js`
- **Avec sourcemaps** pour le débogage
- **Code non minifié** (lisible)
- Variables d'environnement: `__DEV__=true`, `__PROD__=false`
- **Copie automatique** vers `custom_components/habits_manager/www/`

### Build en mode production
```bash
npm run build:legacy
```
- Compile `src/cards/kids-tasks-legacy/main.js` → `dist/kids-tasks-legacy.js`
- **Sans sourcemaps**
- **Code minifié** avec Terser
- Variables d'environnement: `__DEV__=false`, `__PROD__=true`
- **Copie automatique** vers `custom_components/habits_manager/www/`

### Watch mode (développement avec auto-rebuild)
```bash
npm run watch:legacy
```
- Recompile automatiquement à chaque modification de fichier
- Mode développement
- Utile pour le développement actif

### Build complet (toutes les cartes)
```bash
# Dev
npm run build:all:dev

# Production
npm run build:all
```
- Compile les cartes TypeScript (habits-manager-card, etc.)
- **ET** les cartes legacy

---

## Configuration Rollup

Le fichier `rollup.config.legacy.js` gère la compilation des cartes legacy :

### Adaptations par rapport au build original

1. **Remplacement de variables** :
   - `__DEV__` → `true` ou `false`
   - `__PROD__` → `true` ou `false`
   - `process.env.VERSION` → `"2.0.0-habits-manager"`
   - `process.env.NODE_ENV` → `"development"` ou `"production"`

2. **Plugin simple-replace** :
   - Remplace les variables sans dépendances additionnelles
   - Pas besoin de `@rollup/plugin-replace`

3. **Copie automatique** :
   - En dev: `dist/kids-tasks-legacy.dev.js` → `custom_components/habits_manager/www/`
   - En prod: `dist/kids-tasks-legacy.js` → `custom_components/habits_manager/www/`

---

## Vérifier le build

### 1. Fichier compilé généré
```bash
ls -lh dist/kids-tasks-legacy.dev.js
# Attendu: ~241K en mode dev
```

### 2. Fichier copié dans Home Assistant
```bash
ls -lh ../../custom_components/habits_manager/www/kids-tasks-legacy.dev.js
```

### 3. Vérifier les adaptations
```bash
grep -m 5 "habits_manager" dist/kids-tasks-legacy.dev.js
```
Vous devriez voir :
- `const SERVICE_DOMAIN = 'habits_manager';`
- `const ENTITY_PREFIX = 'habits_manager';`

---

## Utiliser les cartes dans Home Assistant

### 1. En mode développement

Dans votre dashboard Lovelace :

```yaml
# Carte dashboard
type: custom:kids-tasks-card-dev
title: "Tableau de bord familial"

# Carte enfant
type: custom:kids-tasks-child-card-dev
child_id: "child_001"
title: "Mon espace"

# Carte manager
type: custom:kids-tasks-manager-dev
```

**Note**: Le suffixe `-dev` est automatiquement ajouté en mode développement.

### 2. En mode production

```yaml
# Carte dashboard
type: custom:kids-tasks-card
title: "Tableau de bord familial"

# Carte enfant
type: custom:kids-tasks-child-card
child_id: "child_001"

# Carte manager
type: custom:kids-tasks-manager
```

### 3. Référencer le fichier dans Lovelace

Ajoutez le fichier dans votre configuration Lovelace :

**Mode développement** :
```yaml
resources:
  - url: /local/community/habits_manager/kids-tasks-legacy.dev.js
    type: module
```

**Mode production** :
```yaml
resources:
  - url: /local/community/habits_manager/kids-tasks-legacy.js
    type: module
```

---

## Debugging en mode développement

Quand `__DEV__ = true`, les cartes exposent des utilitaires de débogage :

### Dans la console du navigateur
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

## Architecture du build

```
www/habits-manager/
├── rollup.config.legacy.js      # Configuration de build legacy
├── package.json                 # Scripts npm
├── src/
│   └── cards/
│       └── kids-tasks-legacy/   # Sources adaptées
│           ├── main.js          # Point d'entrée
│           ├── base-card.js     # Adapté avec habits-manager
│           ├── child-card.js    # Adapté avec Habitudes + Cosmétiques
│           ├── constants.js     # Mappings kids_tasks → habits_manager
│           ├── service-adapter.js
│           ├── data-adapter.js
│           └── ...
│
└── dist/
    ├── kids-tasks-legacy.dev.js     # Build dev (241K)
    └── kids-tasks-legacy.js         # Build prod (minifié)
```

---

## Workflow de développement

### 1. Modifier le code source
```bash
# Éditer les fichiers dans:
src/cards/kids-tasks-legacy/
```

### 2. Recompiler en watch mode
```bash
npm run watch:legacy
```

### 3. Recharger Home Assistant
- Vider le cache du navigateur (Ctrl+F5)
- Ou redémarrer Home Assistant

### 4. Tester
- Ouvrir la console du navigateur
- Vérifier les logs avec `window.KidsTasksDebug`

---

## Différences avec le build original

| Aspect | kids-tasks-ha-card (original) | kids-tasks-legacy (adapté) |
|--------|-------------------------------|----------------------------|
| **Backend** | `kids_tasks` | `habits_manager` |
| **Entités** | `sensor.kidtasks_*` | `sensor.habits_manager_*` |
| **Services** | `kids_tasks.complete_task` | `habits_manager.mark_task_completed` |
| **Fonctionnalités** | Tâches, Récompenses | Tâches, Récompenses, **Habitudes**, **Cosmétiques**, **Validation** |
| **Fichier compilé** | `kids-tasks-card.js` | `kids-tasks-legacy.js` |
| **Version** | `2.0.0` | `2.0.0-habits-manager` |

---

## Troubleshooting

### Erreur: "rollup: not found"
```bash
npm install
```

### Erreur: "Cannot find module 'constants.js'"
Vérifiez que tous les fichiers legacy sont présents dans `src/cards/kids-tasks-legacy/`

### Les cartes n'apparaissent pas dans Lovelace
1. Vérifiez que le fichier est bien dans `custom_components/habits_manager/www/`
2. Videz le cache du navigateur
3. Vérifiez dans la console : `customElements.get('kids-tasks-card-dev')`

### Les adaptations habits-manager ne fonctionnent pas
Vérifiez que le build contient les bonnes constantes :
```bash
grep "habits_manager" dist/kids-tasks-legacy.dev.js
```

---

## Prochaines étapes

1. ✅ Build dev fonctionnel
2. ⏳ Tests dans Home Assistant
3. ⏳ Validation des workflows (Habitudes, Cosmétiques, Validation)
4. ⏳ Build production et déploiement final

---

## Ressources

- [Documentation complète](./src/cards/kids-tasks-legacy/README.md)
- [Plan de migration](../../MIGRATION_PLAN.md)
- [Synthèse de migration](../../MIGRATION_SUMMARY.md)
- [Rollup config](./rollup.config.legacy.js)
