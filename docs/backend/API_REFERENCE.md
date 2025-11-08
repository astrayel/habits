# API Reference - Habits Manager Services

Ce document liste tous les services exposés par l'intégration Habits Manager.

## Table des matières

- [Services Enfants](#services-enfants)
- [Services Tâches](#services-tâches)
- [Services Habitudes](#services-habitudes)
- [Services Récompenses](#services-récompenses)
- [Services Cosmétiques](#services-cosmétiques)
- [Services de Lecture](#services-de-lecture)
- [Services de Validation](#services-de-validation)

---

## Services Enfants

### `habits_manager.create_child`

Crée un nouveau profil d'enfant dans le système.

**Paramètres:**
| Paramètre | Type | Requis | Description | Exemple |
|-----------|------|--------|-------------|---------|
| `name` | string | ✅ | Nom de l'enfant | `"Sophie"` |
| `person_entity` | string | ✅ | Entité person.* de HA | `"person.sophie"` |

**Retour:**
```yaml
child:
  id: "child_abc123"
  name: "Sophie"
  person_entity: "person.sophie"
  points: 0
  coins: 0
  level: 1
  experience: 0
```

**Exemple:**
```yaml
service: habits_manager.create_child
data:
  name: "Sophie"
  person_entity: "person.sophie"
```

**Effet:** Crée ~10 sensors pour l'enfant (voir [SENSORS.md](./SENSORS.md))

---

### `habits_manager.update_child`

Met à jour les informations d'un enfant existant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `name` | string | ❌ | Nouveau nom |
| `points` | int | ❌ | Nouveaux points |
| `coins` | int | ❌ | Nouvelles pièces |

**Exemple:**
```yaml
service: habits_manager.update_child
data:
  child_id: "child_abc123"
  name: "Sophie Martin"
```

---

### `habits_manager.delete_child`

Supprime définitivement un enfant et toutes ses données.

⚠️ **Attention:** Cette action est irréversible!

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |

**Effet:** 
- Supprime tous les sensors de l'enfant
- Supprime toutes ses tâches, habitudes, récompenses
- Émet un événement `habits_manager_entity_delete`

---

## Services Tâches

### `habits_manager.create_task`

Crée une nouvelle tâche assignée à un ou plusieurs enfants.

**Paramètres:**
| Paramètre | Type | Requis | Description | Valeurs |
|-----------|------|--------|-------------|---------|
| `title` | string | ✅ | Titre de la tâche | |
| `description` | string | ❌ | Description détaillée | |
| `assigned_to` | list[string] | ✅ | Liste d'IDs d'enfants | `["child_abc"]` |
| `task_type` | string | ✅ | Type de tâche | `"mandatory"` ou `"bonus"` |
| `difficulty` | int | ✅ | Difficulté (1-3) | 1, 2, ou 3 |
| `icon` | string | ❌ | Emoji de la tâche | `"🧹"` |
| `color` | string | ❌ | Couleur hex | `"#4CAF50"` |
| `category` | string | ❌ | Catégorie | `"chores"`, `"homework"`, etc. |
| `estimated_duration` | int | ❌ | Durée estimée (min) | `15` |

**Récompenses/Pénalités (optionnel):**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `rewards_points` | int | Points gagnés |
| `rewards_coins` | int | Pièces gagnées |
| `rewards_experience` | int | XP gagnée |
| `penalties_points` | int | Points perdus |
| `penalties_coins` | int | Pièces perdues |

**Planification (optionnel):**
| Paramètre | Type | Description | Valeurs |
|-----------|------|-------------|---------|
| `schedule_type` | string | Type de planification | `"daily"`, `"weekly"`, `"once"` |
| `schedule_days` | list[int] | Jours de la semaine | `[1,2,3,4,5]` (lun-ven) |
| `schedule_time` | string | Heure | `"08:00:00"` |
| `schedule_specific_date` | string | Date spécifique | `"2025-11-10"` |

**Exemple:**
```yaml
service: habits_manager.create_task
data:
  title: "Ranger sa chambre"
  description: "Ranger les jouets et faire son lit"
  assigned_to: ["child_abc123"]
  task_type: "mandatory"
  difficulty: 2
  icon: "🧹"
  color: "#4CAF50"
  category: "chores"
  estimated_duration: 30
  rewards_points: 10
  rewards_coins: 5
  rewards_experience: 15
  schedule_type: "weekly"
  schedule_days: [6, 7]  # Samedi et dimanche
```

**Retour:**
```yaml
task:
  id: "task_def456"
  title: "Ranger sa chambre"
  # ... autres champs
```

---

### `habits_manager.update_task`

Met à jour une tâche existante.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `task_id` | string | ✅ | ID de la tâche |
| `title` | string | ❌ | Nouveau titre |
| `description` | string | ❌ | Nouvelle description |
| `is_active` | bool | ❌ | Activer/désactiver |
| *(autres champs comme create_task)* | | ❌ | |

---

### `habits_manager.delete_task`

Supprime définitivement une tâche.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `task_id` | string | ✅ | ID de la tâche |

---

### `habits_manager.mark_task_completed`

Marque une instance de tâche comme complétée par un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |
| `child_id` | string | ✅ | ID de l'enfant |

**État après:** Instance passe à `COMPLETED_WAITING` (en attente de validation parent)

**Exemple:**
```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "instance_xyz789"
  child_id: "child_abc123"
```

---

## Services Habitudes

### `habits_manager.create_habit`

Crée une nouvelle habitude avec système de streaks.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `title` | string | ✅ | Titre de l'habitude |
| `description` | string | ❌ | Description |
| `assigned_to` | list[string] | ✅ | IDs des enfants |
| `icon` | string | ❌ | Emoji |
| `color` | string | ❌ | Couleur hex |
| `category` | string | ❌ | Catégorie |
| `target_streak` | int | ❌ | Streak objectif |

**Récompenses:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `rewards_points` | int | Points par complétion |
| `rewards_coins` | int | Pièces par complétion |
| `rewards_experience` | int | XP par complétion |
| `streak_bonus_points` | int | Bonus tous les X jours |
| `streak_bonus_interval` | int | Intervalle du bonus |

**Exemple:**
```yaml
service: habits_manager.create_habit
data:
  title: "Pratiquer Duolingo"
  description: "Au moins 5 minutes par jour"
  assigned_to: ["child_abc123"]
  icon: "🦉"
  color: "#58CC02"
  category: "learning"
  target_streak: 30
  rewards_points: 5
  rewards_coins: 2
  rewards_experience: 8
  streak_bonus_points: 50
  streak_bonus_interval: 7
```

---

### `habits_manager.complete_habit`

Enregistre la complétion d'une habitude pour un jour donné.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |
| `child_id` | string | ✅ | ID de l'enfant |
| `completion_date` | string | ❌ | Date (défaut: aujourd'hui) |

**Effet:** 
- Incrémente le streak
- Applique les récompenses
- Applique le bonus si streak_bonus_interval atteint

---

## Services Récompenses

### `habits_manager.create_reward`

Crée une nouvelle récompense réelle.

**Paramètres:**
| Paramètre | Type | Requis | Description | Valeurs |
|-----------|------|--------|-------------|---------|
| `title` | string | ✅ | Titre de la récompense | |
| `description` | string | ❌ | Description | |
| `reward_type` | string | ✅ | Type de récompense | `"screen_time"`, `"outing"`, `"toy"`, `"food"`, `"privilege"` |
| `cost_points` | int | ✅ | Coût en points | |
| `icon` | string | ❌ | Emoji | |
| `color` | string | ❌ | Couleur hex | |
| `requires_approval` | bool | ✅ | Validation parent requise | |
| `available_for` | list[string] | ✅ | IDs des enfants | |

**Exemple:**
```yaml
service: habits_manager.create_reward
data:
  title: "30 min de temps d'écran"
  description: "Temps d'écran supplémentaire pour jeux vidéo"
  reward_type: "screen_time"
  cost_points: 100
  icon: "🎮"
  color: "#FF5722"
  requires_approval: true
  available_for: ["child_abc123", "child_def456"]
```

---

### `habits_manager.claim_reward`

Réclame une récompense avec les points de l'enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `reward_id` | string | ✅ | ID de la récompense |
| `child_id` | string | ✅ | ID de l'enfant |

**Effet:**
- Déduit les points
- Crée une réclamation (claim)
- Si `requires_approval: true` → statut `PENDING`
- Si `requires_approval: false` → statut `APPROVED`

---

### `habits_manager.approve_claim`

Approuve une réclamation de récompense en attente.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `claim_id` | string | ✅ | ID de la réclamation |

**Effet:** Passe le statut de `PENDING` à `APPROVED`

---

## Services Cosmétiques

### `habits_manager.create_cosmetic`

Crée un nouveau cosmétique pour la boutique.

**Paramètres:**
| Paramètre | Type | Requis | Description | Valeurs |
|-----------|------|--------|-------------|---------|
| `name` | string | ✅ | Nom du cosmétique | |
| `category` | string | ✅ | Catégorie | `"clothes"`, `"accessory"`, `"pet"`, `"theme"` |
| `icon` | string | ✅ | Emoji/icône | |
| `color` | string | ❌ | Couleur hex | |
| `rarity` | string | ✅ | Rareté | `"common"`, `"rare"`, `"epic"`, `"legendary"` |
| `cost_coins` | int | ✅ | Coût en pièces | |
| `level_required` | int | ❌ | Niveau min | |

**Exemple:**
```yaml
service: habits_manager.create_cosmetic
data:
  name: "Cape de super-héros"
  category: "clothes"
  icon: "🦸"
  color: "#E74C3C"
  rarity: "rare"
  cost_coins: 150
  level_required: 5
```

---

### `habits_manager.purchase_cosmetic`

Achète un cosmétique avec les pièces de l'enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cosmetic_id` | string | ✅ | ID du cosmétique |
| `child_id` | string | ✅ | ID de l'enfant |

**Effet:**
- Déduit les pièces
- Ajoute le cosmétique à `owned_cosmetics`
- Met à jour le sensor

---

## Services de Lecture

Ces services retournent des données via `response_variable`.

### `habits_manager.list_children`

Retourne la liste de tous les enfants.

**Paramètres:** Aucun

**Exemple:**
```yaml
service: habits_manager.list_children
response_variable: children
```

**Retour:**
```yaml
children:
  - id: "child_abc123"
    name: "Sophie"
    points: 150
    coins: 50
    level: 3
    # ...
  - id: "child_def456"
    name: "Lucas"
    # ...
```

---

### `habits_manager.list_tasks`

Retourne la liste des tâches (avec filtres optionnels).

**Paramètres:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `assigned_to` | string | Filtrer par child_id |
| `task_type` | string | Filtrer par type |
| `is_active` | bool | Filtrer par statut |

**Exemple:**
```yaml
service: habits_manager.list_tasks
data:
  assigned_to: "child_abc123"
  is_active: true
response_variable: tasks
```

---

### `habits_manager.list_habits`

Retourne la liste des habitudes (avec filtres).

**Paramètres:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `assigned_to` | string | Filtrer par child_id |
| `is_active` | bool | Filtrer par statut |

---

### `habits_manager.list_rewards`

Retourne la liste des récompenses (avec filtres).

**Paramètres:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `available_for` | string | Filtrer par child_id |
| `reward_type` | string | Filtrer par type |

---

### `habits_manager.list_cosmetics`

Retourne la liste des cosmétiques (avec filtres).

**Paramètres:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `category` | string | Filtrer par catégorie |
| `rarity` | string | Filtrer par rareté |
| `max_level` | int | Niveau max de l'enfant |

---

## Services de Validation

### `habits_manager.validate_task`

Valide une tâche complétée par un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |

**Effet:**
- Passe l'instance à `VALIDATED`
- Applique les récompenses (points, coins, XP)
- Met à jour le level si nécessaire
- Émet un événement `habits_manager_entity_update`

---

### `habits_manager.refuse_task`

Refuse une tâche complétée.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |
| `reason` | string | ❌ | Raison du refus |

**Effet:**
- Passe l'instance à `REFUSED`
- Applique les pénalités si configurées
- Émet un événement

---

## Notes

### Gestion des erreurs

Tous les services peuvent retourner les erreurs suivantes:
- `ChildNotFoundError` - Enfant introuvable
- `TaskNotFoundError` - Tâche introuvable  
- `InsufficientPointsError` - Pas assez de points
- `InsufficientCoinsError` - Pas assez de pièces
- `ValidationError` - Données invalides

### Événements émis

Voir [EVENTS.md](./EVENTS.md) pour la liste complète des événements.

### Sensors mis à jour

Voir [SENSORS.md](./SENSORS.md) pour savoir quels sensors sont affectés par chaque service.
