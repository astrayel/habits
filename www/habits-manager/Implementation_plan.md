# Plan d'Implémentation Phase 2 - Refactoring Frontend

> **Statut Phase 1**: ✅ TERMINÉE (constants.js, service-adapter.js, data-adapter.js synchronisés)
> **Objectif Phase 2**: Découper les fichiers monolithiques pour améliorer la maintenabilité
> **Ordre d'exécution**: base-card.js d'abord (fondation), puis child-card.js (tabs)

---

## Vue d'Ensemble

| Fichier Source | Lignes | Fichiers Cibles | Stratégie |
|----------------|--------|-----------------|-----------|
| `base-card.js` | 2,257 | 9 modules | Extraction par responsabilité |
| `child-card.js` | 1,436 | 6 fichiers | Extraction par tab |

**Résultat attendu**: ~500 lignes max par fichier, responsabilités claires.

---

## PARTIE A: Refactoring de base-card.js

### Structure Actuelle (2,257 lignes)

```
base-card.js
├── Lifecycle & State (lignes 10-154)
├── Touch System (lignes 196-517)
├── Events & Clicks (lignes 156-425)
├── UI Components (lignes 519-708)
├── Modal System (lignes 710-1041)
├── CSS Styles (lignes 1043-1626)
├── Data Fetching (lignes 1641-1896)
├── Labels & Utils (lignes 1897-2029)
└── History (lignes 2030-2254)
```

### Nouveaux Fichiers à Créer

#### 1. `src/cards/base/base-card-styles.js` (~600 lignes)
**Responsabilité**: Génération CSS

| Méthode | Lignes Source |
|---------|---------------|
| `getCustomCSSVariables()` | 1044-1076 |
| `getCommonStyles()` | 1078-1626 |

**Dépendances**: Aucune (self-contained)

---

#### 2. `src/cards/base/base-card-modal.js` (~350 lignes)
**Responsabilité**: Système de modals

| Méthode | Lignes Source |
|---------|---------------|
| `showModal(content, title)` | 710-1041 |

**Dépendances**: Aucune (utilise document API)

---

#### 3. `src/cards/base/base-card-touch.js` (~320 lignes)
**Responsabilité**: Gestion tactile et swipe

| Méthode | Lignes Source |
|---------|---------------|
| `_detectMobileDevice()` | 197-201 |
| `initTouchInteractions()` | 203-207 |
| `_cleanupTouchInteractions()` | 209-227 |
| `_initLongPressSystem()` | 268-357 |
| `addSwipeListeners()` | 427-508 |
| `handleSwipeLeft()` | 511-513 |
| `handleSwipeRight()` | 515-517 |

**Dépendances**: WeakMap/Map pour état (self-contained)

---

#### 4. `src/cards/base/base-card-events.js` (~150 lignes)
**Responsabilité**: Gestion des clics et events

| Méthode | Lignes Source |
|---------|---------------|
| `handleClick(event)` | 156-194 |
| `_setupEventDelegation()` | 245-266 |
| `showDeleteConfirmation()` | 359-392 |
| `hideDeleteConfirmation()` | 394-414 |
| `_hideAllDeleteConfirmations()` | 416-425 |

**Dépendances**: `_touchStates` du core

---

#### 5. `src/cards/base/base-card-data.js` (~280 lignes)
**Responsabilité**: Récupération de données

| Méthode | Lignes Source |
|---------|---------------|
| `getChildren()` | 1642-1693 |
| `getTasks()` | 1695-1736 |
| `getRewards()` | 1738-1756 |
| `getTaskInstances()` | 1759-1789 |
| `getHabits()` | 1792-1813 |
| `getCosmetics()` | 1816-1837 |
| `getRewardClaims()` | 1840-1865 |
| `filterTasks()` | 1868-1891 |
| `isTaskInPeriod()` | 1893-1896 |

**Dépendances**: SERVICE_DOMAIN, DataAdapter, ServiceAdapter, logger

---

#### 6. `src/cards/base/base-card-render.js` (~220 lignes)
**Responsabilité**: Composants UI de base

| Méthode | Lignes Source |
|---------|---------------|
| `emptySection()` | 520-530 |
| `renderIcon()` | 532-536 |
| `getCategoryIcon()` | 538-543 |
| `renderGauges()` | 546-594 |
| `getAvatar()` | 597-614 |
| `renderChild()` | 662-708 |
| `renderChildSummary()` | 1912-1934 |
| `renderTaskFilters()` | 1936-1959 |

**Dépendances**: KidsTasksUtils, getChildStats

---

#### 7. `src/cards/base/base-card-labels.js` (~140 lignes)
**Responsabilité**: Labels et formatage

| Méthode | Lignes Source |
|---------|---------------|
| `getFilterLabel()` | 1898-1910 |
| `getFrequencyLabel()` | 1961-1970 |
| `getCategoryLabel()` | 1972-1982 |
| `formatAssignedChildren()` | 1998-2003 |
| `getAssignedChildrenNames()` | 2005-2020 |
| `getDynamicIcons()` | 2022-2024 |
| `getRewardIcons()` | 2026-2028 |

**Dépendances**: getChildren (de base-card-data)

---

#### 8. `src/cards/base/base-card-history.js` (~230 lignes)
**Responsabilité**: Gestion de l'historique

| Méthode | Lignes Source |
|---------|---------------|
| `getChildHistory()` | 2032-2081 |
| `getActionIcon()` | 2083-2095 |
| `getActionTypeLabel()` | 2097-2109 |
| `renderHistoryAsTask()` | 2111-2144 |
| `renderChildHistoryForTab()` | 2146-2167 |
| `renderChildHistoryContent()` | 2169-2244 |
| `showChildHistory()` | 2247-2254 |

**Dépendances**: SERVICE_DOMAIN, getChildren, showModal, logger

---

#### 9. `src/cards/base/base-card-core.js` (~200 lignes)
**Responsabilité**: Lifecycle et orchestration du rendu

| Méthode | Lignes Source |
|---------|---------------|
| `constructor()` | 11-39 |
| `hass` (setter) | 41-55 |
| `disconnectedCallback()` | 230-242 |
| `smartRender()` | 58-73 |
| `_performRender()` | 75-111 |
| `_needsRender()` | 114-123 |
| `_getCurrentRenderState()` | 126-133 |
| `_updateRenderState()` | 136-138 |
| `_handleRenderError()` | 141-154 |

**Dépendances**: performance-monitor, logger

---

### Ordre d'Extraction Recommandé

```
1. base-card-styles.js    (aucune dépendance)
2. base-card-modal.js     (aucune dépendance)
3. base-card-touch.js     (aucune dépendance)
4. base-card-events.js    (dépend de touch pour état)
5. base-card-data.js      (dépendances externes)
6. base-card-labels.js    (dépend de data)
7. base-card-render.js    (dépend de data)
8. base-card-history.js   (dépend de data + modal)
9. base-card-core.js      (importe tous les autres)
```

---

## PARTIE B: Refactoring de child-card.js

### Structure Actuelle (1,436 lignes)

```
child-card.js
├── Lifecycle & Refresh (lignes 8-167)
├── Config & Render (lignes 169-255)
├── Styles (lignes 257-701)
├── Header & Progress (lignes 703-739)
├── Tab System (lignes 741-782)
├── Tasks Tab (lignes 784-852, 947-987)
├── Rewards Tab (lignes 854-888, 989-998)
├── History Tab (lignes 890-917)
├── Habits Tab (lignes 1001-1115)
├── Cosmetics Tab (lignes 1118-1247)
└── Data Access (lignes 1250-1433)
```

### Nouveaux Fichiers à Créer

#### 1. `src/cards/tabs/base-tab.js` (~80 lignes)
**Responsabilité**: Classe de base abstraite pour tous les tabs

```javascript
export class BaseTab {
  constructor(childCard) {
    this.card = childCard;
  }

  get hass() { return this.card._hass; }
  get config() { return this.card.config; }
  get child() { return this.card.getChild(); }

  // Méthodes utilitaires héritées
  emptySection(icon, text, subtext) { }
  getCategoryIcon(category) { }
  async callService(service, data) { }
}
```

---

#### 2. `src/cards/tabs/tasks-tab.js` (~250 lignes)
**Responsabilité**: Affichage et gestion des tâches

| Méthode | Lignes Source |
|---------|---------------|
| `render()` | 784-808 |
| `renderFilters()` | 810-825 |
| `renderTaskItem()` | 827-852 |
| `completeTask()` | 947-987 |

**Styles à extraire**: Styles de tâches (ligne ~402)

**Dépendances**:
- `filterTasks()` (hérité de base-card)
- `getCategoryIcon()` (hérité)
- `getChildTasks()` (de child-card)

---

#### 3. `src/cards/tabs/habits-tab.js` (~200 lignes)
**Responsabilité**: Affichage et complétion des habitudes

| Méthode | Lignes Source |
|---------|---------------|
| `render()` | 1001-1012 |
| `loadContent()` | 1014-1056 |
| `renderHabitCard()` | 1058-1093 |
| `canCompleteToday()` | 1095-1100 |
| `completeHabit()` | 1102-1115 |

**Styles à extraire**: lignes 405-516

**Dépendances**:
- Service: `list_habits`
- Service: `mark_habit_completed`

---

#### 4. `src/cards/tabs/rewards-tab.js` (~150 lignes)
**Responsabilité**: Affichage et réclamation des récompenses

| Méthode | Lignes Source |
|---------|---------------|
| `render()` | 854-868 |
| `renderRewardItem()` | 871-888 |
| `claimReward()` | 989-998 |
| `getChildRewards()` | 1384-1390 |

**Dépendances**:
- `getRewards()` (hérité de base-card)
- `getChild()` (de child-card)

---

#### 5. `src/cards/tabs/cosmetics-tab.js` (~200 lignes)
**Responsabilité**: Boutique et achat de cosmétiques

| Méthode | Lignes Source |
|---------|---------------|
| `render()` | 1118-1129 |
| `loadContent()` | 1131-1188 |
| `renderCosmeticCard()` | 1190-1232 |
| `purchaseCosmetic()` | 1234-1247 |

**Styles à extraire**: lignes 517-698

**Dépendances**:
- Service: `list_cosmetics`
- Service: `purchase_cosmetic`

---

#### 6. `src/cards/tabs/history-tab.js` (~50 lignes)
**Responsabilité**: Affichage de l'historique

| Méthode | Lignes Source |
|---------|---------------|
| `render()` | 890-901 |
| `loadContent()` | 903-917 |

**Dépendances**:
- `renderChildHistoryForTab()` (hérité de base-card-history)

---

### child-card.js Refactoré (~500 lignes)

**Ce qui reste dans child-card.js**:
- Lifecycle (lignes 8-167)
- Configuration (lignes 169-187)
- shouldUpdate (lignes 189-216)
- render() orchestration (lignes 218-255)
- Styles généraux (lignes 257-401)
- Header & Progress (lignes 703-739)
- Tab switching (lignes 741-782)
- handleAction routing (lignes 919-944)
- Data access partagé (lignes 1250-1307, 1309-1362, 1392-1415)
- Static methods (lignes 1418-1433)

---

## PARTIE C: Plan d'Exécution

### Étape 1: Créer la structure de dossiers
```
src/cards/
├── base/
│   ├── index.js           (exports)
│   ├── base-card-core.js
│   ├── base-card-styles.js
│   ├── base-card-modal.js
│   ├── base-card-touch.js
│   ├── base-card-events.js
│   ├── base-card-data.js
│   ├── base-card-render.js
│   ├── base-card-labels.js
│   └── base-card-history.js
├── tabs/
│   ├── index.js           (exports)
│   ├── base-tab.js
│   ├── tasks-tab.js
│   ├── habits-tab.js
│   ├── rewards-tab.js
│   ├── cosmetics-tab.js
│   └── history-tab.js
├── base-card.js           (refactoré - importe les modules)
└── child-card.js          (refactoré - utilise les tabs)
```

### Étape 2: Extraire base-card.js (9 fichiers)
1. Créer `base-card-styles.js` - copier lignes 1043-1626
2. Créer `base-card-modal.js` - copier lignes 710-1041
3. Créer `base-card-touch.js` - copier lignes 196-517
4. Créer `base-card-events.js` - copier lignes 156-194, 244-266, 359-425
5. Créer `base-card-data.js` - copier lignes 1641-1896
6. Créer `base-card-labels.js` - copier lignes 1897-2029
7. Créer `base-card-render.js` - copier lignes 519-708, 1912-1959
8. Créer `base-card-history.js` - copier lignes 2030-2254
9. Créer `base-card-core.js` - copier lignes 10-154, 230-242
10. Créer `base/index.js` - exporter tous les modules
11. Refactorer `base-card.js` - importer et composer

### Étape 3: Extraire child-card.js (6 fichiers)
1. Créer `tabs/base-tab.js` - classe abstraite
2. Créer `tabs/tasks-tab.js` - extraire lignes 784-852, 947-987
3. Créer `tabs/habits-tab.js` - extraire lignes 1001-1115
4. Créer `tabs/rewards-tab.js` - extraire lignes 854-888, 989-998
5. Créer `tabs/cosmetics-tab.js` - extraire lignes 1118-1247
6. Créer `tabs/history-tab.js` - extraire lignes 890-917
7. Créer `tabs/index.js` - exporter tous les tabs
8. Refactorer `child-card.js` - importer et utiliser les tabs

### Étape 4: Mettre à jour Rollup
- Vérifier que tous les nouveaux fichiers sont inclus dans le bundle
- Tester le build: `npm run build`

### Étape 5: Tests manuels
- Vérifier que la carte se charge sans erreur
- Tester chaque tab (tasks, habits, rewards, cosmetics, history)
- Tester les interactions (swipe, long-press, clicks)
- Tester les modals

---

## Dépendances Entre Modules

```
┌─────────────────────────────────────────────────────────────┐
│                      base-card.js                           │
│  (importe tous les modules base/ et expose la classe)       │
└─────────────────────────────────────────────────────────────┘
         │
         ├── base-card-core.js ─────┬── performance-monitor
         │                          └── logger
         ├── base-card-styles.js (indépendant)
         ├── base-card-modal.js (indépendant)
         ├── base-card-touch.js (indépendant)
         ├── base-card-events.js ──── base-card-touch (état)
         ├── base-card-data.js ────── constants, DataAdapter
         ├── base-card-labels.js ──── base-card-data
         ├── base-card-render.js ──── base-card-data, utils
         └── base-card-history.js ─── base-card-data, modal

┌─────────────────────────────────────────────────────────────┐
│                     child-card.js                           │
│  (importe base-card.js + tous les tabs/)                    │
└─────────────────────────────────────────────────────────────┘
         │
         ├── tabs/base-tab.js
         ├── tabs/tasks-tab.js ────── base-tab
         ├── tabs/habits-tab.js ───── base-tab
         ├── tabs/rewards-tab.js ──── base-tab
         ├── tabs/cosmetics-tab.js ── base-tab
         └── tabs/history-tab.js ──── base-tab, base-card-history
```

---

## Fichiers Résultants (15 nouveaux fichiers)

| Fichier | Lignes estimées | Responsabilité |
|---------|-----------------|----------------|
| `base/base-card-core.js` | ~200 | Lifecycle, rendu |
| `base/base-card-styles.js` | ~600 | CSS |
| `base/base-card-modal.js` | ~350 | Modals |
| `base/base-card-touch.js` | ~320 | Tactile |
| `base/base-card-events.js` | ~150 | Events |
| `base/base-card-data.js` | ~280 | Data fetching |
| `base/base-card-render.js` | ~220 | UI components |
| `base/base-card-labels.js` | ~140 | Labels |
| `base/base-card-history.js` | ~230 | Historique |
| `base/index.js` | ~20 | Exports |
| `tabs/base-tab.js` | ~80 | Classe abstraite |
| `tabs/tasks-tab.js` | ~250 | Tab tâches |
| `tabs/habits-tab.js` | ~200 | Tab habitudes |
| `tabs/rewards-tab.js` | ~150 | Tab récompenses |
| `tabs/cosmetics-tab.js` | ~200 | Tab cosmétiques |
| `tabs/history-tab.js` | ~50 | Tab historique |
| `tabs/index.js` | ~15 | Exports |

**Total**: ~3,455 lignes réparties en 17 fichiers (vs 3,693 lignes en 2 fichiers)
