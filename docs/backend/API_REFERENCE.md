# API Reference - Habits Manager Services

Ce document liste tous les services exposés par l'intégration Habits Manager.

## Table des matières

- [Services Enfants](#services-enfants)
  - `habits_manager.create_child`
  - `habits_manager.update_child`
  - `habits_manager.delete_child`
  - `habits_manager.add_points`
  - `habits_manager.remove_points`
  - `habits_manager.set_points`
  - `habits_manager.add_coins`
  - `habits_manager.remove_coins`
  - `habits_manager.set_coins`
  - `habits_manager.get_child_history`
- [Services Tâches](#services-tâches)
  - `habits_manager.create_task`
  - `habits_manager.update_task`
  - `habits_manager.delete_task`
  - `habits_manager.mark_task_completed`
- [Services Habitudes](#services-habitudes)
  - `habits_manager.create_habit`
  - `habits_manager.complete_habit`
- [Services Récompenses](#services-récompenses)
  - `habits_manager.create_reward`
  - `habits_manager.claim_reward`
  - `habits_manager.approve_claim`
- [Services Cosmétiques](#services-cosmétiques)
  - `habits_manager.create_cosmetic`
  - `habits_manager.purchase_cosmetic`
- [Services de Lecture](#services-de-lecture)
  - `habits_manager.list_children`
  - `habits_manager.list_tasks`
  - `habits_manager.list_habits`
  - `habits_manager.list_rewards`
  - `habits_manager.list_cosmetics`
- [Services de Validation](#services-de-validation)
  - `habits_manager.validate_task`
  - `habits_manager.refuse_task`

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

### `habits_manager.add_points`

Ajoute des points manuellement à un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `points` | int | ✅ | Nombre de points à ajouter |
| `reason` | string | ❌ | Raison de l'ajout |

**Exemple:**
```yaml
service: habits_manager.add_points
data:
  child_id: "child_abc123"
  points: 50
  reason: "Bonus pour bon comportement"
```

**Effet:**
- Ajoute les points au total de l'enfant
- Crée une entrée dans l'historique des points
- Met à jour les sensors

---

### `habits_manager.remove_points`

Retire des points manuellement à un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `points` | int | ✅ | Nombre de points à retirer |
| `reason` | string | ❌ | Raison du retrait |

**Exemple:**
```yaml
service: habits_manager.remove_points
data:
  child_id: "child_abc123"
  points: 20
  reason: "Pénalité pour comportement inapproprié"
```

**Effet:**
- Retire les points du total de l'enfant (minimum 0)
- Crée une entrée dans l'historique des points
- Met à jour les sensors

---

### `habits_manager.set_points`

Définit le nombre total de points d'un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `points` | int | ✅ | Nombre de points à définir |
| `reason` | string | ❌ | Raison du changement |

**Exemple:**
```yaml
service: habits_manager.set_points
data:
  child_id: "child_abc123"
  points: 100
  reason: "Réinitialisation mensuelle"
```

**Effet:**
- Définit le total de points de l'enfant
- Crée une entrée dans l'historique des points
- Met à jour les sensors

---

### `habits_manager.add_coins`

Ajoute des pièces manuellement à un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `coins` | int | ✅ | Nombre de pièces à ajouter |
| `reason` | string | ❌ | Raison de l'ajout |

**Exemple:**
```yaml
service: habits_manager.add_coins
data:
  child_id: "child_abc123"
  coins: 10
  reason: "Bonus exceptionnel"
```

**Effet:**
- Ajoute les pièces au total de l'enfant
- Crée une entrée dans l'historique
- Met à jour les sensors

---

### `habits_manager.remove_coins`

Retire des pièces manuellement à un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `coins` | int | ✅ | Nombre de pièces à retirer |
| `reason` | string | ❌ | Raison du retrait |

**Exemple:**
```yaml
service: habits_manager.remove_coins
data:
  child_id: "child_abc123"
  coins: 5
  reason: "Correction d'erreur"
```

**Effet:**
- Retire les pièces du total de l'enfant (minimum 0)
- Crée une entrée dans l'historique
- Met à jour les sensors

---

### `habits_manager.set_coins`

Définit le nombre total de pièces d'un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `coins` | int | ✅ | Nombre de pièces à définir |
| `reason` | string | ❌ | Raison du changement |

**Exemple:**
```yaml
service: habits_manager.set_coins
data:
  child_id: "child_abc123"
  coins: 50
  reason: "Réinitialisation"
```

**Effet:**
- Définit le total de pièces de l'enfant
- Crée une entrée dans l'historique
- Met à jour les sensors

---

### `habits_manager.get_child_history`

Récupère l'historique des points d'un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `limit` | int | ❌ | Nombre max d'entrées (défaut: 20, max: 50) |
| `action_type_filter` | string | ❌ | Filtrer par type d'action |

**Types d'action disponibles:**
- `task_validated` - Tâche validée
- `habit_completed` - Habitude complétée
- `reward_claimed` - Récompense réclamée
- `penalty_applied` - Pénalité appliquée
- `manual_adjustment` - Ajustement manuel

**Exemple:**
```yaml
service: habits_manager.get_child_history
data:
  child_id: "child_abc123"
  limit: 30
  action_type_filter: "task_validated"
response_variable: history
```

**Retour:**
```yaml
history:
  - id: "history_xyz123"
    timestamp: "2025-11-27T10:30:00"
    action_type: "task_validated"
    points_delta: 10
    coins_delta: 5
    experience_delta: 15
    description: "Tâche validée : Ranger sa chambre"
    related_entity_type: "task"
    related_entity_id: "task_def456"
    related_entity_name: "Ranger sa chambre"
```

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
