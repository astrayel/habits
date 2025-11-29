# API Reference - Habits Manager Services

Ce document liste tous les services exposés par l'intégration Habits Manager.

> **📝 Dernière mise à jour:** 2025-11-29
> **✨ Version complète:** Ce document inclut tous les services implémentés, y compris le support `photo_url` pour les preuves photo.

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
  - `habits_manager.add_experience`
  - `habits_manager.set_level`
  - `habits_manager.get_child_history`
- [Services Tâches](#services-tâches)
  - `habits_manager.create_task`
  - `habits_manager.update_task`
  - `habits_manager.delete_task`
  - `habits_manager.mark_task_completed`
- [Services Instances de Tâches](#services-instances-de-tâches)
  - `habits_manager.list_task_instances`
  - `habits_manager.get_task_instance`
  - `habits_manager.cancel_task_instance`
  - `habits_manager.reschedule_task_instance`
- [Services Habitudes](#services-habitudes)
  - `habits_manager.create_habit`
  - `habits_manager.update_habit`
  - `habits_manager.delete_habit`
  - `habits_manager.mark_habit_completed`
  - `habits_manager.reset_streak`
  - `habits_manager.get_habit_history`
- [Services Récompenses](#services-récompenses)
  - `habits_manager.create_reward`
  - `habits_manager.update_reward`
  - `habits_manager.delete_reward`
  - `habits_manager.claim_reward`
  - `habits_manager.approve_claim`
  - `habits_manager.refuse_claim`
  - `habits_manager.consume_claim`
  - `habits_manager.list_claims`
- [Services Cosmétiques](#services-cosmétiques)
  - `habits_manager.create_cosmetic`
  - `habits_manager.update_cosmetic`
  - `habits_manager.delete_cosmetic`
  - `habits_manager.purchase_cosmetic`
  - `habits_manager.equip_cosmetic`
  - `habits_manager.unequip_cosmetic`
  - `habits_manager.list_owned_cosmetics`
- [Services de Lecture](#services-de-lecture)
  - `habits_manager.list_children`
  - `habits_manager.list_tasks`
  - `habits_manager.list_habits`
  - `habits_manager.list_rewards`
  - `habits_manager.list_cosmetics`
- [Services Statistiques & Reporting](#services-statistiques--reporting)
  - `habits_manager.get_child_stats`
  - `habits_manager.get_weekly_report`
  - `habits_manager.compare_children`
- [Services Configuration Système](#services-configuration-système)
  - `habits_manager.create_category`
  - `habits_manager.list_categories`
  - `habits_manager.update_level_config`
  - `habits_manager.get_system_config`
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

### `habits_manager.add_experience`

Ajoute de l'expérience (XP) manuellement à un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `xp` | int | ✅ | Points d'expérience à ajouter |
| `reason` | string | ❌ | Raison de l'ajout |

**Exemple:**
```yaml
service: habits_manager.add_experience
data:
  child_id: "child_abc123"
  xp: 50
  reason: "Bonus pour comportement exemplaire"
```

**Effet:**
- Ajoute l'XP au total de l'enfant
- Déclenche automatiquement le level-up si le seuil est atteint
- Crée une entrée dans l'historique
- Met à jour les sensors

**Retour:**
```yaml
child_id: "child_abc123"
xp_added: 50
total_xp: 180
level: 3
xp_for_next_level: 220
```

---

### `habits_manager.set_level`

Définit directement le niveau d'un enfant (administratif).

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `level` | int | ✅ | Nouveau niveau à définir |
| `reason` | string | ❌ | Raison du changement |

**Exemple:**
```yaml
service: habits_manager.set_level
data:
  child_id: "child_abc123"
  level: 5
  reason: "Ajustement administratif"
```

**Effet:**
- Définit le niveau de l'enfant
- Réinitialise l'XP selon le niveau
- Crée une entrée dans l'historique
- Met à jour les sensors

⚠️ **Attention:** Utiliser avec précaution - bypasse le système de progression normal.

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
| `photo_url` | string | ❌ | URL de la preuve photo (optionnel) |

**État après:** Instance passe à `COMPLETED_WAITING` (en attente de validation parent)

**Exemple sans preuve photo:**
```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "instance_xyz789"
  child_id: "child_abc123"
```

**Exemple avec preuve photo:**
```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "instance_xyz789"
  child_id: "child_abc123"
  photo_url: "/local/proofs/chambre_rangee.jpg"
```

**Retour:**
```yaml
instance:
  id: "instance_xyz789"
  task_id: "task_def456"
  child_id: "child_abc123"
  status: "completed_waiting"
  completed_at: "2025-11-29T10:30:00"
  photo_url: "/local/proofs/chambre_rangee.jpg"  # Si fourni
pending_count: 2
waiting_count: 3
```

---

## Services Instances de Tâches

Les instances de tâches représentent les occurrences planifiées des tâches. Par exemple, une tâche "Ranger sa chambre" planifiée tous les samedis génère une instance par semaine.

### `habits_manager.list_task_instances`

Liste les instances de tâches avec filtres optionnels.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ❌ | Filtrer par enfant |
| `task_id` | string | ❌ | Filtrer par tâche |
| `status` | string | ❌ | Filtrer par statut |
| `date_from` | string | ❌ | Date de début (ISO 8601) |
| `date_to` | string | ❌ | Date de fin (ISO 8601) |

**Statuts possibles:** `PENDING`, `COMPLETED_WAITING`, `VALIDATED`, `REFUSED`, `CANCELLED`

**Exemple:**
```yaml
service: habits_manager.list_task_instances
data:
  child_id: "child_abc123"
  status: "PENDING"
  date_from: "2025-11-27"
response_variable: instances
```

**Retour:**
```yaml
instances:
  - id: "instance_xyz789"
    task_id: "task_def456"
    child_id: "child_abc123"
    scheduled_date: "2025-11-27"
    status: "PENDING"
    # ...
```

---

### `habits_manager.get_task_instance`

Récupère les détails d'une instance spécifique.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |

**Exemple:**
```yaml
service: habits_manager.get_task_instance
data:
  instance_id: "instance_xyz789"
response_variable: instance
```

**Retour:**
```yaml
instance:
  id: "instance_xyz789"
  task_id: "task_def456"
  child_id: "child_abc123"
  scheduled_date: "2025-11-27"
  status: "PENDING"
  completed_at: null
  validated_at: null
```

---

### `habits_manager.cancel_task_instance`

Annule une instance de tâche planifiée.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |
| `reason` | string | ❌ | Raison de l'annulation |

**Exemple:**
```yaml
service: habits_manager.cancel_task_instance
data:
  instance_id: "instance_xyz789"
  reason: "Enfant malade"
```

**Effet:**
- Passe le statut de l'instance à `CANCELLED`
- Émet un événement de mise à jour

---

### `habits_manager.reschedule_task_instance`

Reprogramme une instance de tâche à une autre date.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `instance_id` | string | ✅ | ID de l'instance |
| `new_date` | string | ✅ | Nouvelle date (ISO 8601) |

**Exemple:**
```yaml
service: habits_manager.reschedule_task_instance
data:
  instance_id: "instance_xyz789"
  new_date: "2025-12-05"
```

**Effet:**
- Modifie la date planifiée de l'instance
- Ne peut être appliqué qu'aux instances avec statut `PENDING`

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

### `habits_manager.mark_habit_completed`

Enregistre la complétion d'une habitude pour un jour donné.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |
| `child_id` | string | ✅ | ID de l'enfant |
| `completion_date` | string | ❌ | Date (défaut: aujourd'hui) |

**Exemple:**
```yaml
service: habits_manager.mark_habit_completed
data:
  habit_id: "habit_xyz123"
  child_id: "child_abc123"
  completion_date: "2025-11-27"
```

**Effet:**
- Incrémente le streak
- Applique les récompenses
- Applique le bonus si streak_bonus_interval atteint

---

### `habits_manager.update_habit`

Met à jour une habitude existante.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |
| `title` | string | ❌ | Nouveau titre |
| `target_streak` | int | ❌ | Nouveau streak objectif |
| `is_active` | bool | ❌ | Activer/désactiver |
| *(autres champs comme create_habit)* | | ❌ | |

---

### `habits_manager.delete_habit`

Supprime définitivement une habitude.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |

⚠️ **Attention:** Supprime aussi l'historique des streaks associés.

---

### `habits_manager.reset_streak`

Réinitialise le streak d'une habitude pour un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |
| `child_id` | string | ✅ | ID de l'enfant |
| `reason` | string | ❌ | Raison de la réinitialisation |

**Exemple:**
```yaml
service: habits_manager.reset_streak
data:
  habit_id: "habit_xyz123"
  child_id: "child_abc123"
  reason: "Vacances - redémarrage"
```

**Effet:**
- Remet le streak à 0
- Conserve l'historique passé

---

### `habits_manager.get_habit_history`

Récupère l'historique des complétions d'une habitude.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `habit_id` | string | ✅ | ID de l'habitude |
| `child_id` | string | ✅ | ID de l'enfant |
| `date_from` | string | ❌ | Date de début (ISO 8601) |
| `date_to` | string | ❌ | Date de fin (ISO 8601) |

**Exemple:**
```yaml
service: habits_manager.get_habit_history
data:
  habit_id: "habit_xyz123"
  child_id: "child_abc123"
  date_from: "2025-11-01"
response_variable: history
```

**Retour:**
```yaml
history:
  - date: "2025-11-27"
    completed: true
    streak: 5
  - date: "2025-11-26"
    completed: true
    streak: 4
  - date: "2025-11-25"
    completed: false
    streak: 0
```

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

### `habits_manager.update_reward`

Met à jour une récompense existante.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `reward_id` | string | ✅ | ID de la récompense |
| `title` | string | ❌ | Nouveau titre |
| `cost_points` | int | ❌ | Nouveau coût en points |
| `is_available` | bool | ❌ | Disponible ou non |
| *(autres champs comme create_reward)* | | ❌ | |

---

### `habits_manager.delete_reward`

Supprime définitivement une récompense.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `reward_id` | string | ✅ | ID de la récompense |

---

### `habits_manager.refuse_claim`

Refuse une réclamation de récompense.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `claim_id` | string | ✅ | ID de la réclamation |
| `reason` | string | ❌ | Raison du refus |

**Effet:**
- Passe le statut à `REFUSED`
- Rembourse les points à l'enfant
- Crée une entrée dans l'historique

---

### `habits_manager.consume_claim`

Marque une réclamation comme consommée/utilisée.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `claim_id` | string | ✅ | ID de la réclamation |

**Exemple:**
```yaml
service: habits_manager.consume_claim
data:
  claim_id: "claim_uvw321"
```

**Effet:**
- Passe le statut de `APPROVED` à `CONSUMED`
- Indique que la récompense a été effectivement donnée

---

### `habits_manager.list_claims`

Liste les réclamations de récompenses avec filtres.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ❌ | Filtrer par enfant |
| `status` | string | ❌ | Filtrer par statut |
| `date_from` | string | ❌ | Date de début (ISO 8601) |
| `date_to` | string | ❌ | Date de fin (ISO 8601) |

**Statuts possibles:** `PENDING`, `APPROVED`, `REFUSED`, `CONSUMED`

**Exemple:**
```yaml
service: habits_manager.list_claims
data:
  status: "PENDING"
response_variable: claims
```

**Retour:**
```yaml
claims:
  - id: "claim_uvw321"
    reward_id: "reward_rst456"
    child_id: "child_abc123"
    status: "PENDING"
    claimed_at: "2025-11-27T14:30:00"
    # ...
```

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

### `habits_manager.update_cosmetic`

Met à jour un cosmétique existant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cosmetic_id` | string | ✅ | ID du cosmétique |
| `name` | string | ❌ | Nouveau nom |
| `cost_coins` | int | ❌ | Nouveau coût |
| `level_required` | int | ❌ | Nouveau niveau requis |
| `is_available` | bool | ❌ | Disponible à l'achat |

---

### `habits_manager.delete_cosmetic`

Supprime un cosmétique de la boutique.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cosmetic_id` | string | ✅ | ID du cosmétique |

⚠️ **Attention:** Ne supprime pas des inventaires des enfants qui le possèdent déjà.

---

### `habits_manager.equip_cosmetic`

Équipe un cosmétique possédé par l'enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cosmetic_id` | string | ✅ | ID du cosmétique |
| `child_id` | string | ✅ | ID de l'enfant |
| `slot` | string | ❌ | Slot d'équipement (si applicable) |

**Exemple:**
```yaml
service: habits_manager.equip_cosmetic
data:
  cosmetic_id: "cosmetic_jkl789"
  child_id: "child_abc123"
```

**Effet:**
- Marque le cosmétique comme équipé dans le profil de l'enfant
- Met à jour le sensor

---

### `habits_manager.unequip_cosmetic`

Déséquipe un cosmétique.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cosmetic_id` | string | ✅ | ID du cosmétique |
| `child_id` | string | ✅ | ID de l'enfant |

---

### `habits_manager.list_owned_cosmetics`

Liste les cosmétiques possédés par un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `equipped_only` | bool | ❌ | Seulement les équipés |

**Exemple:**
```yaml
service: habits_manager.list_owned_cosmetics
data:
  child_id: "child_abc123"
  equipped_only: false
response_variable: cosmetics
```

**Retour:**
```yaml
cosmetics:
  - id: "cosmetic_jkl789"
    name: "Cape de super-héros"
    category: "clothes"
    rarity: "rare"
    equipped: true
  - id: "cosmetic_mno012"
    name: "Chapeau de magicien"
    category: "accessory"
    rarity: "epic"
    equipped: false
```

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

## Services Statistiques & Reporting

### `habits_manager.get_child_stats`

Récupère les statistiques globales d'un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `period` | string | ❌ | Période (`week`, `month`, `all_time`) |

**Exemple:**
```yaml
service: habits_manager.get_child_stats
data:
  child_id: "child_abc123"
  period: "week"
response_variable: stats
```

**Retour:**
```yaml
stats:
  child_id: "child_abc123"
  period: "week"
  current_status:
    points: 150
    coins: 50
    level: 3
    xp: 180
    xp_for_next_level: 220
  tasks:
    completed: 15
    validated: 12
    refused: 1
    pending: 2
  habits:
    active_streaks: 3
    longest_streak: 14
    completions: 21
  rewards:
    claimed: 5
    approved: 4
    consumed: 3
  points_summary:
    earned: 450
    spent: 300
    balance: 150
```

---

### `habits_manager.get_weekly_report`

Génère un rapport hebdomadaire détaillé pour un enfant.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_id` | string | ✅ | ID de l'enfant |
| `weeks_ago` | int | ❌ | 0 = cette semaine, 1 = semaine dernière |

**Exemple:**
```yaml
service: habits_manager.get_weekly_report
data:
  child_id: "child_abc123"
  weeks_ago: 0
response_variable: report
```

**Retour:**
```yaml
report:
  week_start: "2025-11-24"
  week_end: "2025-11-30"
  tasks_completed: 8
  habits_completed: 21
  points_earned: 120
  coins_earned: 45
  level_ups: 1
  best_day: "2025-11-27"
  achievements:
    - "First perfect week!"
    - "7-day streak on Duolingo!"
```

---

### `habits_manager.compare_children`

Compare les performances de plusieurs enfants.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `child_ids` | list[string] | ✅ | Liste des IDs d'enfants (min 2) |
| `period` | string | ❌ | Période de comparaison |

**Exemple:**
```yaml
service: habits_manager.compare_children
data:
  child_ids: ["child_abc123", "child_def456"]
  period: "week"
response_variable: comparison
```

**Retour:**
```yaml
comparison:
  - child_id: "child_abc123"
    name: "Sophie"
    rank: 1
    score: 450
    tasks_completed: 15
    habits_maintained: 3
  - child_id: "child_def456"
    name: "Lucas"
    rank: 2
    score: 320
    tasks_completed: 12
    habits_maintained: 2
```

---

## Services Configuration Système

### `habits_manager.create_category`

Crée une catégorie personnalisée pour les tâches, habitudes ou récompenses.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `name` | string | ✅ | Nom de la catégorie |
| `type` | string | ✅ | Type (`task`, `habit`, `reward`) |
| `icon` | string | ❌ | Emoji/icône |
| `color` | string | ❌ | Couleur hex |

**Exemple:**
```yaml
service: habits_manager.create_category
data:
  name: "Sport"
  type: "task"
  icon: "⚽"
  color: "#FF5733"
```

**Retour:**
```yaml
category:
  id: "category_pqr345"
  name: "Sport"
  type: "task"
  icon: "⚽"
  color: "#FF5733"
  created_at: "2025-11-27T15:00:00"
```

---

### `habits_manager.list_categories`

Liste toutes les catégories disponibles (built-in et personnalisées).

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `type` | string | ❌ | Filtrer par type |

**Exemple:**
```yaml
service: habits_manager.list_categories
data:
  type: "task"
response_variable: categories
```

**Retour:**
```yaml
categories:
  - id: "chores"
    name: "Tâches ménagères"
    type: "task"
    builtin: true
  - id: "category_pqr345"
    name: "Sport"
    type: "task"
    icon: "⚽"
    color: "#FF5733"
    builtin: false
count: 2
```

---

### `habits_manager.update_level_config`

Configure les seuils d'XP et messages de déblocage pour un niveau.

**Paramètres:**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `level` | int | ✅ | Niveau à configurer (≥2) |
| `xp_required` | int | ✅ | XP requise pour ce niveau |
| `unlock_message` | string | ❌ | Message de déblocage |

**Exemple:**
```yaml
service: habits_manager.update_level_config
data:
  level: 10
  xp_required: 500
  unlock_message: "Félicitations ! Vous êtes maintenant un Expert !"
```

**Retour:**
```yaml
config:
  max_level: 100
  xp_multiplier: 1.2
  level_thresholds:
    - level: 2
      xp_required: 100
    - level: 10
      xp_required: 500
      unlock_message: "Félicitations ! Vous êtes maintenant un Expert !"
  last_updated: "2025-11-27T15:05:00"
```

---

### `habits_manager.get_system_config`

Récupère la configuration système complète.

**Exemple:**
```yaml
service: habits_manager.get_system_config
response_variable: config
```

**Retour:**
```yaml
config:
  max_level: 100
  xp_multiplier: 1.2
  base_xp: 100
  level_thresholds:
    - level: 2
      xp_required: 100
    - level: 3
      xp_required: 250
  rarity_costs:
    common: [10, 30]
    rare: [40, 80]
    epic: [100, 200]
    legendary: [250, 500]
```

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
