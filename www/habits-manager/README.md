# Habits Manager Frontend

Frontend pour le gestionnaire de tâches et habitudes gamifié pour Home Assistant.

## Structure

```
src/
├── cards/              # Cartes Lovelace principales
│   ├── habits-manager-card.ts       # Carte de gestion
│   ├── habits-supervision-card.ts   # Carte de supervision
│   └── habits-child-card.ts         # Carte enfant
├── components/         # Composants Lit réutilisables
├── services/           # Services (API, state management)
│   └── api-client.ts   # Client API Home Assistant
├── styles/             # Styles et thèmes
│   ├── base-styles.ts  # Styles de base
│   └── theme.ts        # Utilitaires de thème
├── types/              # Définitions TypeScript
│   ├── models.ts       # Types des modèles backend
│   ├── constants.ts    # Constantes
│   ├── home-assistant.ts # Types Home Assistant
│   └── index.ts        # Exports
└── utils/              # Utilitaires
    └── formatters.ts   # Fonctions de formatage
```

## Installation

```bash
npm install
```

## Développement

```bash
# Build et watch (recompilation automatique)
npm run watch

# Build de production
npm run build

# Linter
npm run lint

# Formatter
npm run format
```

## Build

Le build génère 3 fichiers dans `dist/`:
- `habits-manager-card.js` - Carte de gestion (parents/admins)
- `habits-supervision-card.js` - Carte de supervision (parents)
- `habits-child-card.js` - Carte enfant

Les fichiers sont automatiquement copiés dans `custom_components/habits_manager/www/` après le build.

## Utilisation dans Home Assistant

### 1. Carte de gestion (Management)

```yaml
type: custom:habits-manager-card
title: "Gestionnaire de Tâches"
```

### 2. Carte de supervision

```yaml
type: custom:habits-supervision-card
title: "Supervision"
```

### 3. Carte enfant

```yaml
type: custom:habits-child-card
child_id: "child_001"
title: "Mes Tâches"
```

## Technologies

- **Lit 3.x** - Web Components modernes
- **TypeScript** - Type safety
- **Rollup** - Bundler optimisé
- **ESLint + Prettier** - Code quality

## Développement

### Ajouter une nouvelle carte

1. Créer un fichier dans `src/cards/`
2. Étendre `LitElement`
3. Implémenter `setConfig()` et `getCardSize()`
4. Ajouter dans `rollup.config.js`

### Ajouter un composant

1. Créer un fichier dans `src/components/`
2. Utiliser les styles de `base-styles.ts`
3. Exporter pour réutilisation

### Types

Tous les types doivent matcher les modèles Python backend (voir `DATAMODELS.md`).

## Statut

**Phase 3 - Frontend Base** : ✅ Complété

- [x] Infrastructure (TypeScript, Rollup, Lit)
- [x] Types et constantes
- [x] API Client
- [x] Styles de base
- [x] Squelettes des 3 cartes
- [x] Configuration build

**Prochaines phases:**
- Phase 4: Implémentation carte de gestion
- Phase 5: Implémentation carte de supervision
- Phase 6: Implémentation carte enfant
