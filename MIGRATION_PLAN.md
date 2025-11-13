# Plan de Migration : kids-tasks-ha-card → habits-manager

## 1. Vue d'ensemble

### Objectif
Adapter les cartes Home Assistant de `kids-tasks-ha-card` pour utiliser le backend `habits_manager` au lieu de `kids-tasks-ha`, tout en conservant l'apparence visuelle actuelle.

### Stratégie
1. **Cloner** le repository kids-tasks-ha-card dans le frontend du projet habits
2. **Adapter** les appels API et les modèles de données
3. **Intégrer** les nouvelles fonctionnalités (habitudes, validation améliorée, cosmétiques)
4. **Préserver** l'interface utilisateur existante

---

## 2. Analyse comparative des systèmes

### 2.1 Noms de domaine et entités

| Aspect | kids-tasks-ha | habits-manager |
|--------|---------------|----------------|
| **Domaine de service** | `kids_tasks` | `habits_manager` |
| **Entités enfants** | `sensor.kidtasks_{child_id}_points` | `sensor.habits_manager_{child_id}_points` |
| **Entités tâches** | `sensor.kidtasks_task_{task_id}` | `sensor.habits_manager_task_{task_id}` |
| **Entités récompenses** | `sensor.kidtasks_reward_{reward_id}` | `sensor.habits_manager_reward_{reward_id}` |

### 2.2 Services API

| Action | kids-tasks-ha | habits-manager |
|--------|---------------|----------------|
| Compléter tâche | `kids_tasks.complete_task` | `habits_manager.mark_task_completed` |
| Valider tâche | *(implicite)* | `habits_manager.validate_task` |
| Refuser tâche | *(absent)* | `habits_manager.refuse_task` |
| Réclamer récompense | `kids_tasks.claim_reward` | `habits_manager.claim_reward` |
| Approuver réclamation | *(absent)* | `habits_manager.approve_claim` |
| Créer enfant | `kids_tasks.create_child` | `habits_manager.create_child` |
| Mettre à jour enfant | `kids_tasks.update_child` | `habits_manager.update_child` |
| Supprimer enfant | `kids_tasks.remove_child` | `habits_manager.delete_child` |
| Ajuster points | `kids_tasks.adjust_points` | *(direct via update_child)* |
| Ajuster pièces | `kids_tasks.adjust_coins` | *(direct via update_child)* |
| Compléter habitude | *(absent)* | `habits_manager.complete_habit` |
| Acheter cosmétique | *(absent)* | `habits_manager.purchase_cosmetic` |
| Lister enfants | `kids_tasks.list_children` | `habits_manager.list_children` |
| Lister tâches | `kids_tasks.list_tasks` | `habits_manager.list_tasks` |
| Lister habitudes | *(absent)* | `habits_manager.list_habits` |
| Lister récompenses | `kids_tasks.list_rewards` | `habits_manager.list_rewards` |
| Lister cosmétiques | *(absent)* | `habits_manager.list_cosmetics` |

### 2.3 Modèles de données

#### Child (Enfant)

| Champ | kids-tasks-ha | habits-manager | Action |
|-------|---------------|----------------|--------|
| `id` | ✅ | ✅ | ✅ Compatible |
| `child_id` | ✅ | ✅ | ✅ Compatible |
| `name` | ✅ | ✅ | ✅ Compatible |
| `points` | ✅ | ✅ | ✅ Compatible |
| `coins` | ✅ | ✅ | ✅ Compatible |
| `level` | ✅ | ✅ | ✅ Compatible |
| `avatar` | ✅ (emoji/URL) | ✅ (photo_url + customization) | ⚠️ Adapter format |
| `avatar_type` | ✅ (emoji/url/person_entity) | ❌ | ⚠️ Conserver côté frontend |
| `avatar_data` | ✅ | → `avatar.photo_url` | ⚠️ Mapper |
| `person_entity_id` | ✅ | `person_entity` | ⚠️ Renommer |
| `cosmetics` | ✅ (basique) | ✅ (détaillé: clothes, accessory, pet, theme) | ✅ Enrichir |
| `badges` | ❌ | ✅ | ➕ Ajouter affichage |
| `owned_cosmetics` | ❌ | ✅ | ➕ Ajouter gestion |
| `experience` | ❌ | ✅ | ➕ Ajouter affichage |
| `experience_to_next_level` | ❌ | ✅ | ➕ Ajouter affichage |

#### Task (Tâche)

| Champ | kids-tasks-ha | habits-manager | Action |
|-------|---------------|----------------|--------|
| `id` | ✅ | ✅ | ✅ Compatible |
| `name` | ✅ | `title` | ⚠️ Renommer |
| `description` | ✅ | ✅ | ✅ Compatible |
| `status` | ✅ (todo/completed/validated/cancelled) | ❌ (dans TaskInstance) | ⚠️ Récupérer depuis TaskInstance |
| `points` | ✅ | `rewards.points` | ⚠️ Mapper |
| `coins` | ✅ | `rewards.coins` | ⚠️ Mapper |
| `penalty_points` | ✅ | `penalties.points` | ⚠️ Mapper |
| `category` | ✅ | ✅ | ✅ Compatible |
| `frequency` | ✅ (daily/weekly/monthly/bonus/none) | `schedule.type` + `type` (mandatory/bonus) | ⚠️ Adapter |
| `assigned_children` | ✅ | `assigned_to` | ⚠️ Renommer |
| `active` | ✅ | ✅ | ✅ Compatible |
| `icon` | ✅ | ✅ | ✅ Compatible |
| `color` | ❌ | ✅ | ➕ Ajouter |
| `difficulty` | ❌ | ✅ | ➕ Ajouter |
| `estimated_duration` | ❌ | ✅ | ➕ Ajouter |
| `completed_at` | ✅ | ❌ (dans TaskInstance) | ⚠️ Récupérer depuis TaskInstance |
| `validated_at` | ✅ | ❌ (dans TaskInstance) | ⚠️ Récupérer depuis TaskInstance |

#### TaskInstance (Nouvelle entité dans habits-manager)

```typescript
{
  id: string;
  task_id: string;
  child_id: string;
  date: string;
  status: "pending" | "completed_waiting" | "validated" | "refused" | "failed";
  completed_at: string | null;
  validated_at: string | null;
  validator_id: string | null;
  validation_note: string;
  is_penalty_applied: boolean;
}
```

**Impact**: Le frontend devra récupérer les TaskInstance pour chaque enfant et les associer aux Task.

#### Reward (Récompense)

| Champ | kids-tasks-ha | habits-manager | Action |
|-------|---------------|----------------|--------|
| `id` | ✅ | ✅ | ✅ Compatible |
| `name` | ✅ | `title` | ⚠️ Renommer |
| `description` | ✅ | ✅ | ✅ Compatible |
| `cost` | ✅ (points) | `cost_points` | ⚠️ Renommer |
| `coin_cost` | ✅ | `cost_coins` | ⚠️ Renommer |
| `category` | ✅ | `type` | ⚠️ Renommer |
| `rarity` | ✅ | ❌ (dans cosmetics) | ⚠️ Conserver pour récompenses |
| `remaining_quantity` | ✅ | `stock` | ⚠️ Renommer |
| `min_level` | ✅ | ❌ | ⚠️ Conserver côté frontend |
| `icon` | ✅ | ✅ | ✅ Compatible |
| `color` | ❌ | ✅ | ➕ Ajouter |
| `cosmetic_data` | ✅ | ❌ (séparé en CosmeticItem) | ⚠️ Utiliser CosmeticItem |
| `reward_type` | ✅ | ❌ | ⚠️ Conserver côté frontend |
| `available` | ✅ | `active` | ⚠️ Renommer |
| `cooldown_days` | ❌ | ✅ | ➕ Ajouter |
| `requires_parent_approval` | ❌ | ✅ | ➕ Ajouter workflow |

#### Habit (Nouveau concept)

```typescript
{
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  frequency: "daily" | "weekly" | "monthly";
  rewards: {
    points: number;
    coins: number;
    experience: number;
    streak_bonus: {
      enabled: boolean;
      type: "progressive" | "fixed";
      multiplier: number;
    }
  };
  active: boolean;
  assigned_to: string[];
}
```

**Impact**: Ajouter un nouvel onglet "Habitudes" dans la child-card.

#### CosmeticItem (Nouveau concept)

```typescript
{
  id: string;
  name: string;
  description: string;
  category: "clothes" | "accessory" | "pet" | "theme" | "badge" | "animation";
  subcategory: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  cost_coins: number;
  preview_image: string;
  unlock_requirements: {
    level?: number;
    badge?: string;
  } | null;
  active: boolean;
}
```

**Impact**: Transformer la section "Récompenses" en deux sections : "Récompenses réelles" et "Boutique de cosmétiques".

---

## 3. Plan d'adaptation détaillé

### Phase 1 : Configuration et structure de base

#### Tâche 1.1 : Cloner le frontend kids-tasks-ha-card
- Copier le contenu de `/tmp/kids-tasks-ha-card/src/` vers `/home/user/habits/www/habits-manager/src/cards/legacy/`
- Copier `types/index.d.ts` vers `/home/user/habits/www/habits-manager/src/types/legacy-types.d.ts`
- Copier `package.json` et `rollup.config.js`

#### Tâche 1.2 : Adapter la configuration de build
- Modifier `rollup.config.js` pour générer dans `/home/user/habits/custom_components/habits_manager/www/`
- Mettre à jour `package.json` avec le nouveau nom de package

#### Tâche 1.3 : Renommer les fichiers de cartes
- `src/card.js` → `habits-dashboard-card.js`
- `src/child-card.js` → `habits-child-card.js`
- `src/manager-card.js` → `habits-manager-card.js`

### Phase 2 : Adaptation des constantes et utilitaires

#### Tâche 2.1 : Créer un fichier de constantes
**Fichier**: `src/constants.js`

```javascript
// Domaines de service
export const SERVICE_DOMAIN_OLD = 'kids_tasks';
export const SERVICE_DOMAIN_NEW = 'habits_manager';

// Préfixes d'entités
export const ENTITY_PREFIX_OLD = 'kidtasks';
export const ENTITY_PREFIX_NEW = 'habits_manager';

// Mapping des services
export const SERVICE_MAPPING = {
  'complete_task': 'mark_task_completed',
  'claim_reward': 'claim_reward',
  'update_child': 'update_child',
  'remove_child': 'delete_child',
  'adjust_points': null,  // Géré via update_child
  'adjust_coins': null,   // Géré via update_child
  'create_child': 'create_child',
  'list_children': 'list_children',
  'list_tasks': 'list_tasks',
  'list_rewards': 'list_rewards',
};

// Nouveaux services
export const NEW_SERVICES = {
  'validate_task': 'validate_task',
  'refuse_task': 'refuse_task',
  'approve_claim': 'approve_claim',
  'complete_habit': 'complete_habit',
  'purchase_cosmetic': 'purchase_cosmetic',
  'list_habits': 'list_habits',
  'list_cosmetics': 'list_cosmetics',
};

// Mapping des statuts de tâches
export const TASK_STATUS_MAPPING = {
  'todo': 'pending',
  'completed': 'completed_waiting',
  'validated': 'validated',
  'cancelled': 'refused',
};
```

#### Tâche 2.2 : Créer un adaptateur de services
**Fichier**: `src/services/service-adapter.js`

```javascript
import { SERVICE_DOMAIN_NEW, SERVICE_MAPPING, NEW_SERVICES } from '../constants.js';

export class ServiceAdapter {
  constructor(hass) {
    this._hass = hass;
  }

  async callService(service, data) {
    const mappedService = SERVICE_MAPPING[service] || NEW_SERVICES[service];
    if (!mappedService) {
      console.warn(`Service ${service} not mapped`);
      return;
    }

    // Adapter les données selon le service
    const adaptedData = this._adaptServiceData(service, data);

    return await this._hass.callService(
      SERVICE_DOMAIN_NEW,
      mappedService,
      adaptedData
    );
  }

  _adaptServiceData(service, data) {
    switch (service) {
      case 'complete_task':
        return {
          instance_id: data.task_id,  // Doit être l'ID de l'instance
          child_id: data.child_id,
        };

      case 'adjust_points':
      case 'adjust_coins':
        // Gérer via update_child en calculant le delta
        return {
          child_id: data.child_id,
          // Les points/coins devront être gérés différemment
        };

      case 'remove_child':
        return {
          child_id: data.child_id,
          // force_remove_entities n'existe plus
        };

      default:
        return data;
    }
  }
}
```

#### Tâche 2.3 : Créer un adaptateur de données
**Fichier**: `src/services/data-adapter.js`

```javascript
export class DataAdapter {
  static adaptChild(habitsChild) {
    return {
      id: habitsChild.id,
      child_id: habitsChild.id,
      name: habitsChild.name,
      points: habitsChild.points,
      coins: habitsChild.coins,
      level: habitsChild.level,
      avatar: habitsChild.avatar?.photo_url || '👤',
      avatar_type: 'url',
      avatar_data: habitsChild.avatar?.photo_url,
      person_entity_id: habitsChild.person_entity,
      cosmetics: {
        avatar: { emoji: habitsChild.avatar?.customization?.theme || '👤' },
        outfits: [
          habitsChild.avatar?.customization?.clothes,
          habitsChild.avatar?.customization?.accessory,
          habitsChild.avatar?.customization?.pet,
        ].filter(Boolean),
      },
      // Nouveaux champs
      experience: habitsChild.experience,
      experience_to_next_level: habitsChild.experience_to_next_level,
      badges: habitsChild.badges || [],
      owned_cosmetics: habitsChild.owned_cosmetics || [],
    };
  }

  static adaptTask(habitsTask, instances = []) {
    const childInstances = instances.filter(i => i.task_id === habitsTask.id);

    return {
      id: habitsTask.id,
      name: habitsTask.title,
      description: habitsTask.description,
      status: this._mapTaskStatus(childInstances),
      points: habitsTask.rewards?.points || 0,
      coins: habitsTask.rewards?.coins || 0,
      penalty_points: habitsTask.penalties?.points || 0,
      category: habitsTask.category,
      frequency: this._mapFrequency(habitsTask),
      assigned_children: habitsTask.assigned_to || [],
      assigned_child_ids: habitsTask.assigned_to || [],
      active: habitsTask.active,
      icon: habitsTask.icon,
      color: habitsTask.color,
      difficulty: habitsTask.difficulty,
      estimated_duration: habitsTask.estimated_duration,
      completed_at: childInstances[0]?.completed_at,
      validated_at: childInstances[0]?.validated_at,
    };
  }

  static _mapTaskStatus(instances) {
    if (instances.length === 0) return 'todo';
    const latest = instances[instances.length - 1];

    const statusMap = {
      'pending': 'todo',
      'completed_waiting': 'completed',
      'validated': 'validated',
      'refused': 'todo',
      'failed': 'cancelled',
    };

    return statusMap[latest.status] || 'todo';
  }

  static _mapFrequency(habitsTask) {
    if (habitsTask.type === 'bonus') return 'bonus';

    const scheduleMap = {
      'daily': 'daily',
      'weekly': 'weekly',
      'monthly': 'monthly',
      'specific_date': 'none',
    };

    return scheduleMap[habitsTask.schedule?.type] || 'daily';
  }

  static adaptReward(habitsReward) {
    return {
      id: habitsReward.id,
      name: habitsReward.title,
      description: habitsReward.description,
      cost: habitsReward.cost_points,
      coin_cost: habitsReward.cost_coins || 0,
      cost_points: habitsReward.cost_points,
      category: habitsReward.type,
      rarity: null,  // Pas de rareté pour les récompenses réelles
      remaining_quantity: habitsReward.stock,
      min_level: null,  // Géré côté frontend
      icon: habitsReward.icon,
      color: habitsReward.color,
      reward_type: habitsReward.type,
      available: habitsReward.active,
      requires_parent_approval: habitsReward.requires_parent_approval,
      cooldown_days: habitsReward.cooldown_days,
    };
  }

  static adaptCosmetic(habitsCosmetic) {
    return {
      id: habitsCosmetic.id,
      name: habitsCosmetic.name,
      description: habitsCosmetic.description,
      cost: 0,  // Pas de points pour cosmétiques
      coin_cost: habitsCosmetic.cost_coins,
      category: habitsCosmetic.category,
      subcategory: habitsCosmetic.subcategory,
      rarity: habitsCosmetic.rarity,
      remaining_quantity: null,  // Illimité
      min_level: habitsCosmetic.unlock_requirements?.level,
      icon: habitsCosmetic.icon,
      color: habitsCosmetic.color,
      preview_image: habitsCosmetic.preview_image,
      cosmetic_data: {
        category: habitsCosmetic.category,
        subcategory: habitsCosmetic.subcategory,
      },
      reward_type: 'cosmetic',
      available: habitsCosmetic.active,
    };
  }

  static adaptHabit(habitsHabit, streaks = []) {
    const childStreak = streaks.find(s => s.habit_id === habitsHabit.id);

    return {
      id: habitsHabit.id,
      name: habitsHabit.title,
      description: habitsHabit.description,
      icon: habitsHabit.icon,
      color: habitsHabit.color,
      frequency: habitsHabit.frequency,
      points: habitsHabit.rewards?.points || 0,
      coins: habitsHabit.rewards?.coins || 0,
      experience: habitsHabit.rewards?.experience || 0,
      streak_bonus: habitsHabit.rewards?.streak_bonus,
      current_streak: childStreak?.current_streak || 0,
      longest_streak: childStreak?.longest_streak || 0,
      last_completed: childStreak?.last_completed,
      assigned_to: habitsHabit.assigned_to || [],
      active: habitsHabit.active,
    };
  }
}
```

### Phase 3 : Adaptation de base-card.js

#### Tâche 3.1 : Modifier les méthodes de récupération d'entités

**Dans `base-card.js` (ligne 1639)**, modifier `getChildren()`:

```javascript
getChildren() {
  if (!this._hass) return [];

  const children = [];
  Object.keys(this._hass.states).forEach(entityId => {
    // Changement de préfixe
    if (entityId.startsWith('sensor.habits_manager_') && entityId.endsWith('_points')) {
      const entity = this._hass.states[entityId];
      if (entity && entity.state !== 'unavailable') {
        const adaptedChild = DataAdapter.adaptChild(entity.attributes);
        children.push(adaptedChild);
      }
    }
  });

  return children.sort((a, b) => a.name.localeCompare(b.name));
}
```

**Dans `base-card.js` (ligne 1665)**, modifier `getTasks()`:

```javascript
async getTasks() {
  if (!this._hass) return [];

  // Utiliser le nouveau service list_tasks avec return_response
  try {
    const response = await this._hass.callService(
      'habits_manager',
      'list_tasks',
      {},
      { return_response: true }
    );

    const tasks = response.tasks || [];
    return tasks.map(task => DataAdapter.adaptTask(task));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}
```

**Ajouter une méthode pour récupérer les TaskInstances**:

```javascript
async getTaskInstances(childId, date = null) {
  if (!this._hass) return [];

  // Le backend devrait fournir un service pour lister les instances
  // Pour l'instant, on peut les récupérer depuis les attributs des sensors
  const taskEntities = Object.keys(this._hass.states)
    .filter(id => id.startsWith(`sensor.habits_manager_${childId}_task_instance_`))
    .map(id => this._hass.states[id]);

  return taskEntities.map(entity => entity.attributes);
}
```

#### Tâche 3.2 : Adapter les appels de service

**Remplacer tous les appels** `this._hass.callService('kids_tasks', ...)` par:

```javascript
await this._serviceAdapter.callService(service_name, data);
```

**Exemple dans `completeTask()`**:

```javascript
async completeTask(taskId, childId) {
  try {
    // Récupérer l'instance de la tâche pour aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const instances = await this.getTaskInstances(childId, today);
    const instance = instances.find(i => i.task_id === taskId && i.date === today);

    if (!instance) {
      console.error('Task instance not found');
      return;
    }

    await this._hass.callService('habits_manager', 'mark_task_completed', {
      instance_id: instance.id,
      child_id: childId,
    });
  } catch (error) {
    console.error('Error completing task:', error);
  }
}
```

### Phase 4 : Adaptation de child-card.js

#### Tâche 4.1 : Ajouter l'onglet "Habitudes"

**Dans `child-card.js`**, ajouter un nouvel onglet:

```javascript
renderTabs() {
  return `
    <div class="tabs">
      <button class="tab ${this._activeTab === 'tasks' ? 'active' : ''}"
              data-tab="tasks">
        📋 Tâches
      </button>
      <button class="tab ${this._activeTab === 'habits' ? 'active' : ''}"
              data-tab="habits">
        ⭐ Habitudes
      </button>
      <button class="tab ${this._activeTab === 'rewards' ? 'active' : ''}"
              data-tab="rewards">
        🎁 Récompenses
      </button>
      <button class="tab ${this._activeTab === 'cosmetics' ? 'active' : ''}"
              data-tab="cosmetics">
        🛍️ Boutique
      </button>
      <button class="tab ${this._activeTab === 'history' ? 'active' : ''}"
              data-tab="history">
        📊 Historique
      </button>
    </div>
  `;
}
```

#### Tâche 4.2 : Implémenter le rendu des habitudes

```javascript
async renderHabitsTab() {
  const childId = this.config.child_id;

  try {
    const response = await this._hass.callService(
      'habits_manager',
      'list_habits',
      { assigned_to: childId },
      { return_response: true }
    );

    const habits = response.habits || [];

    return `
      <div class="habits-section">
        <h3>Mes habitudes</h3>
        ${habits.map(habit => this.renderHabitCard(habit)).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching habits:', error);
    return '<div class="error">Erreur lors du chargement des habitudes</div>';
  }
}

renderHabitCard(habit) {
  const adaptedHabit = DataAdapter.adaptHabit(habit);

  return `
    <div class="habit-card">
      <div class="habit-header">
        <span class="habit-icon">${adaptedHabit.icon}</span>
        <span class="habit-name">${adaptedHabit.name}</span>
        <span class="habit-streak">🔥 ${adaptedHabit.current_streak}</span>
      </div>
      <div class="habit-description">${adaptedHabit.description}</div>
      <div class="habit-rewards">
        ${adaptedHabit.points > 0 ? `⭐ ${adaptedHabit.points}` : ''}
        ${adaptedHabit.coins > 0 ? `🪙 ${adaptedHabit.coins}` : ''}
      </div>
      <ha-button class="complete-habit-btn"
                 data-habit-id="${adaptedHabit.id}">
        ✅ Compléter
      </ha-button>
    </div>
  `;
}

async completeHabit(habitId) {
  try {
    await this._hass.callService('habits_manager', 'complete_habit', {
      habit_id: habitId,
      child_id: this.config.child_id,
    });

    // Rafraîchir l'affichage
    this.smartRender(true);
  } catch (error) {
    console.error('Error completing habit:', error);
  }
}
```

#### Tâche 4.3 : Séparer Récompenses et Cosmétiques

**Modifier `renderRewardsTab()`**:

```javascript
async renderRewardsTab() {
  const childId = this.config.child_id;

  try {
    const response = await this._hass.callService(
      'habits_manager',
      'list_rewards',
      {},
      { return_response: true }
    );

    const rewards = response.rewards || [];
    const realRewards = rewards.filter(r => r.type !== 'cosmetic');

    return `
      <div class="rewards-section">
        <h3>🎁 Récompenses réelles</h3>
        <p>Utilise tes points pour obtenir des récompenses réelles !</p>
        ${realRewards.map(reward => this.renderRewardCard(reward)).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return '<div class="error">Erreur lors du chargement des récompenses</div>';
  }
}

async renderCosmeticsTab() {
  const childId = this.config.child_id;

  try {
    const response = await this._hass.callService(
      'habits_manager',
      'list_cosmetics',
      { active_only: true },
      { return_response: true }
    );

    const cosmetics = response.cosmetics || [];

    // Grouper par catégorie
    const categories = {
      clothes: cosmetics.filter(c => c.category === 'clothes'),
      accessory: cosmetics.filter(c => c.category === 'accessory'),
      pet: cosmetics.filter(c => c.category === 'pet'),
      theme: cosmetics.filter(c => c.category === 'theme'),
      badge: cosmetics.filter(c => c.category === 'badge'),
      animation: cosmetics.filter(c => c.category === 'animation'),
    };

    return `
      <div class="cosmetics-section">
        <h3>🛍️ Boutique de cosmétiques</h3>
        <p>Utilise tes pièces pour personnaliser ton avatar !</p>

        ${Object.entries(categories).map(([category, items]) => `
          <div class="cosmetic-category">
            <h4>${this._getCategoryLabel(category)}</h4>
            <div class="cosmetic-grid">
              ${items.map(item => this.renderCosmeticCard(item)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching cosmetics:', error);
    return '<div class="error">Erreur lors du chargement de la boutique</div>';
  }
}

renderCosmeticCard(cosmetic) {
  const child = this.getChildData();
  const isOwned = child.owned_cosmetics?.includes(cosmetic.id);
  const canAfford = child.coins >= cosmetic.cost_coins;
  const meetsLevelReq = !cosmetic.unlock_requirements?.level ||
                        child.level >= cosmetic.unlock_requirements.level;

  return `
    <div class="cosmetic-card rarity-${cosmetic.rarity}">
      <div class="cosmetic-preview">
        ${cosmetic.preview_image ?
          `<img src="${cosmetic.preview_image}" alt="${cosmetic.name}">` :
          `<span class="cosmetic-icon">${cosmetic.icon}</span>`
        }
      </div>
      <div class="cosmetic-name">${cosmetic.name}</div>
      <div class="cosmetic-rarity">${this._getRarityLabel(cosmetic.rarity)}</div>
      <div class="cosmetic-cost">🪙 ${cosmetic.cost_coins}</div>

      ${isOwned ?
        '<span class="cosmetic-owned">✅ Possédé</span>' :
        meetsLevelReq ?
          (canAfford ?
            `<ha-button class="purchase-cosmetic-btn"
                        data-cosmetic-id="${cosmetic.id}">
              Acheter
            </ha-button>` :
            '<span class="cosmetic-locked">🔒 Pas assez de pièces</span>') :
          `<span class="cosmetic-locked">🔒 Niveau ${cosmetic.unlock_requirements.level} requis</span>`
      }
    </div>
  `;
}

async purchaseCosmetic(cosmeticId) {
  try {
    await this._hass.callService('habits_manager', 'purchase_cosmetic', {
      cosmetic_id: cosmeticId,
      child_id: this.config.child_id,
    });

    this.smartRender(true);
  } catch (error) {
    console.error('Error purchasing cosmetic:', error);
  }
}
```

### Phase 5 : Adaptation de manager-card.js

#### Tâche 5.1 : Ajouter la section Habitudes

**Dans `manager-card.js`**, ajouter un nouvel onglet:

```javascript
renderSections() {
  return `
    <div class="manager-sections">
      <button class="section ${this._activeSection === 'children' ? 'active' : ''}"
              data-section="children">
        👨‍👩‍👧‍👦 Enfants
      </button>
      <button class="section ${this._activeSection === 'tasks' ? 'active' : ''}"
              data-section="tasks">
        📋 Tâches
      </button>
      <button class="section ${this._activeSection === 'habits' ? 'active' : ''}"
              data-section="habits">
        ⭐ Habitudes
      </button>
      <button class="section ${this._activeSection === 'rewards' ? 'active' : ''}"
              data-section="rewards">
        🎁 Récompenses
      </button>
      <button class="section ${this._activeSection === 'cosmetics' ? 'active' : ''}"
              data-section="cosmetics">
        🛍️ Cosmétiques
      </button>
      <button class="section ${this._activeSection === 'validation' ? 'active' : ''}"
              data-section="validation">
        ✅ Validation
      </button>
    </div>
  `;
}
```

#### Tâche 5.2 : Implémenter la file de validation

**Nouveau rendu pour la section Validation**:

```javascript
async renderValidationSection() {
  const children = this.getChildren();

  // Récupérer toutes les tâches en attente de validation
  const pendingTasks = [];
  for (const child of children) {
    const instances = await this.getTaskInstances(child.id);
    const waiting = instances.filter(i => i.status === 'completed_waiting');
    pendingTasks.push(...waiting.map(i => ({ ...i, child })));
  }

  // Récupérer toutes les réclamations en attente
  const pendingClaims = []; // TODO: Implémenter récupération des claims

  return `
    <div class="validation-section">
      <h3>File d'attente de validation</h3>

      <div class="validation-queue">
        <h4>Tâches à valider (${pendingTasks.length})</h4>
        ${pendingTasks.map(item => this.renderTaskValidationCard(item)).join('')}

        <h4>Réclamations à approuver (${pendingClaims.length})</h4>
        ${pendingClaims.map(claim => this.renderClaimValidationCard(claim)).join('')}
      </div>
    </div>
  `;
}

renderTaskValidationCard(item) {
  return `
    <div class="validation-card">
      <div class="validation-header">
        <span class="child-name">${item.child.name}</span>
        <span class="task-name">${item.task_name}</span>
      </div>
      <div class="validation-info">
        <span>Complétée le: ${new Date(item.completed_at).toLocaleString()}</span>
      </div>
      <div class="validation-actions">
        <ha-button class="validate-btn"
                   data-instance-id="${item.id}">
          ✅ Valider
        </ha-button>
        <ha-button class="refuse-btn"
                   data-instance-id="${item.id}">
          ❌ Refuser
        </ha-button>
      </div>
    </div>
  `;
}

async validateTask(instanceId, applyPenalty = false) {
  try {
    await this._hass.callService('habits_manager',
      applyPenalty ? 'refuse_task' : 'validate_task',
      {
        instance_id: instanceId,
        apply_penalty: applyPenalty,
        note: '',  // Peut être ajouté via un formulaire
      }
    );

    this.smartRender(true);
  } catch (error) {
    console.error('Error validating task:', error);
  }
}
```

### Phase 6 : Adaptation des types TypeScript

#### Tâche 6.1 : Mettre à jour `types/index.d.ts`

**Ajouter les nouveaux types**:

```typescript
// types/habits-manager.d.ts

export interface HabitsChild extends Child {
  experience: number;
  experience_to_next_level: number;
  badges: string[];
  owned_cosmetics: string[];
}

export interface TaskInstance {
  id: string;
  task_id: string;
  child_id: string;
  date: string;
  status: 'pending' | 'completed_waiting' | 'validated' | 'refused' | 'failed';
  completed_at: string | null;
  validated_at: string | null;
  validator_id: string | null;
  validation_note: string;
  is_penalty_applied: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  points: number;
  coins: number;
  experience: number;
  streak_bonus: {
    enabled: boolean;
    type: 'progressive' | 'fixed';
    multiplier: number;
  };
  current_streak: number;
  longest_streak: number;
  last_completed: string | null;
  assigned_to: string[];
  active: boolean;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: 'clothes' | 'accessory' | 'pet' | 'theme' | 'badge' | 'animation';
  subcategory: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost_coins: number;
  preview_image: string;
  unlock_requirements: {
    level?: number;
    badge?: string;
  } | null;
  icon: string;
  color: string;
  active: boolean;
}

export interface RewardClaim {
  id: string;
  reward_id: string;
  child_id: string;
  claimed_at: string;
  approved_at: string | null;
  approver_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
}
```

### Phase 7 : Tests et validation

#### Tâche 7.1 : Créer un environnement de test
- Configurer un Home Assistant de développement
- Installer le backend habits_manager
- Créer des données de test (enfants, tâches, habitudes)

#### Tâche 7.2 : Tests unitaires des adaptateurs
- Tester `ServiceAdapter` avec tous les services
- Tester `DataAdapter` avec toutes les conversions de données

#### Tâche 7.3 : Tests d'intégration
- Tester chaque carte individuellement
- Tester les workflows complets (complétion → validation)
- Tester l'achat de cosmétiques

#### Tâche 7.4 : Tests de régression
- Vérifier que l'apparence visuelle est préservée
- Vérifier que toutes les fonctionnalités existantes fonctionnent

---

## 4. Checklist de migration

### Configuration
- [ ] Cloner kids-tasks-ha-card dans le projet habits
- [ ] Adapter rollup.config.js
- [ ] Mettre à jour package.json
- [ ] Renommer les fichiers de cartes

### Constantes et utilitaires
- [ ] Créer constants.js avec les mappings
- [ ] Implémenter ServiceAdapter
- [ ] Implémenter DataAdapter

### base-card.js
- [ ] Modifier getChildren() pour utiliser le nouveau préfixe
- [ ] Modifier getTasks() pour utiliser le nouveau service
- [ ] Ajouter getTaskInstances()
- [ ] Ajouter getHabits()
- [ ] Ajouter getCosmetics()
- [ ] Adapter tous les appels de service

### child-card.js
- [ ] Ajouter l'onglet Habitudes
- [ ] Implémenter renderHabitsTab()
- [ ] Implémenter completeHabit()
- [ ] Séparer Récompenses et Cosmétiques
- [ ] Implémenter renderCosmeticsTab()
- [ ] Implémenter purchaseCosmetic()
- [ ] Adapter le workflow de complétion de tâche

### manager-card.js
- [ ] Ajouter la section Habitudes
- [ ] Implémenter le CRUD d'habitudes
- [ ] Ajouter la section Cosmétiques
- [ ] Implémenter le CRUD de cosmétiques
- [ ] Ajouter la section Validation
- [ ] Implémenter validateTask()
- [ ] Implémenter refuseTask()
- [ ] Implémenter approveClaimapprove()

### Types TypeScript
- [ ] Mettre à jour types/index.d.ts
- [ ] Ajouter HabitsChild
- [ ] Ajouter TaskInstance
- [ ] Ajouter Habit
- [ ] Ajouter CosmeticItem
- [ ] Ajouter RewardClaim

### Styles CSS
- [ ] Adapter les styles pour les nouvelles sections
- [ ] Ajouter les styles pour les habitudes
- [ ] Ajouter les styles pour la boutique de cosmétiques
- [ ] Ajouter les styles pour la file de validation

### Tests
- [ ] Tester ServiceAdapter
- [ ] Tester DataAdapter
- [ ] Tester chaque carte
- [ ] Tests d'intégration
- [ ] Tests de régression

### Documentation
- [ ] Mettre à jour le README
- [ ] Documenter les nouveaux concepts (habitudes, validation, cosmétiques)
- [ ] Créer un guide de migration pour les utilisateurs

---

## 5. Risques et mitigations

### Risque 1 : Incompatibilité des modèles de données
**Mitigation**: Utiliser DataAdapter pour isoler les conversions. Si un champ manque, ajouter une valeur par défaut.

### Risque 2 : Workflow de validation complexe
**Mitigation**: Implémenter une file d'attente claire dans manager-card avec actions explicites.

### Risque 3 : Performance avec beaucoup de données
**Mitigation**: Utiliser le smart rendering et le debouncing existants. Charger les données à la demande.

### Risque 4 : Perte de fonctionnalités existantes
**Mitigation**: Tests de régression complets. Documenter toutes les différences.

### Risque 5 : Confusion entre points et pièces
**Mitigation**: UI claire avec icônes distinctes (⭐ pour points, 🪙 pour pièces). Tooltips explicatifs.

---

## 6. Prochaines étapes

1. **Validation du plan** avec l'utilisateur
2. **Lancement des agents** de développement en parallèle:
   - Agent 1: Configuration et structure de base
   - Agent 2: Adaptation de base-card.js
   - Agent 3: Adaptation de child-card.js
   - Agent 4: Adaptation de manager-card.js
   - Agent 5: Types TypeScript et styles CSS
3. **Intégration** des changements
4. **Tests** et validation
5. **Commit** et push sur la branche

---

## 7. Timeline estimée

| Phase | Durée estimée | Agents |
|-------|---------------|--------|
| Phase 1: Configuration | 1h | 1 agent |
| Phase 2: Constantes/Utils | 2h | 1 agent |
| Phase 3: base-card.js | 3h | 1 agent |
| Phase 4: child-card.js | 4h | 1 agent |
| Phase 5: manager-card.js | 4h | 1 agent |
| Phase 6: Types/Styles | 2h | 1 agent |
| Phase 7: Tests | 3h | 2 agents |
| **Total** | **~19h** | **5-6 agents en parallèle** |

En travaillant en parallèle, la migration peut être complétée en **4-6 heures** de temps réel.
