# Architecture - Gestionnaire de Tâches/Habitudes Home Assistant

> **Date de création :** 2025-11-04
> **Version :** 1.0
> **Architecte :** Claude (Agent Architecte)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Principes d'architecture](#2-principes-darchitecture)
3. [Modèle de données](#3-modèle-de-données)
4. [Architecture Backend](#4-architecture-backend)
5. [Architecture Frontend](#5-architecture-frontend)
6. [Communication et événements](#6-communication-et-événements)
7. [Système de cosmétiques](#7-système-de-cosmétiques)
8. [Plan de mise en œuvre](#8-plan-de-mise-en-œuvre)
9. [Guide des agents](#9-guide-des-agents)
10. [Standards et conventions](#10-standards-et-conventions)

---

## 1. Vue d'ensemble

### 1.1 Objectif du projet

Créer un système gamifié de gestion de tâches et d'habitudes pour Home Assistant, permettant aux parents de motiver leurs enfants via :
- Des tâches obligatoires et bonus
- Des habitudes avec système de streak
- Deux systèmes de récompenses : Points (réels) et Pièces (cosmétiques)
- Un système de personnalisation riche inspiré d'Habitica

### 1.2 Utilisateurs cibles

- **Parents/Superviseurs :** Configuration, validation, supervision
- **Enfants (10-14 ans) :** Complétion de tâches, achat de récompenses, personnalisation

### 1.3 Composants principaux

```
┌─────────────────────────────────────────────────────────────────┐
│                    Home Assistant Frontend                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │  Carte Gestion│  │ Carte Parent  │  │  Carte Enfant     │   │
│  │  (Config)     │  │  (Supervision)│  │  (Utilisateur)    │   │
│  └───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘   │
│          │                  │                      │             │
│          └──────────────────┴──────────────────────┘             │
│                             │                                    │
├─────────────────────────────┼────────────────────────────────────┤
│              Home Assistant Core (Services/Events)               │
├─────────────────────────────┼────────────────────────────────────┤
│                    Intégration Backend                           │
│  ┌──────────────────────────┴──────────────────────────────┐    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │   Task      │  │   Habit      │  │   Reward     │   │    │
│  │  │  Manager    │  │  Manager     │  │   Manager    │   │    │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │   Child     │  │  Cosmetic    │  │   Storage    │   │    │
│  │  │  Manager    │  │  Manager     │  │   Manager    │   │    │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │    │
│  │                                                           │    │
│  └───────────────────────────────────────────────────────────┘   │
│                             │                                    │
├─────────────────────────────┼────────────────────────────────────┤
│                       Stockage persistant                        │
│                    (JSON + Entités Home Assistant)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Principes d'architecture

### 2.1 Réutilisabilité du code

**Objectif :** Éviter toute duplication de code.

**Méthodes :**
- **Composants Lit réutilisables :** Boutons, modales, listes, cartes de tâches
- **Services backend partagés :** Calculs de points, validation, gestion de streaks
- **Modèles de données typés :** TypeScript/Python avec interfaces strictes
- **Système d'événements :** Communication unifiée via événements HA

### 2.2 Séparation des responsabilités

**Backend :**
- Logique métier exclusive
- Aucune logique d'affichage
- Exposition via services HA

**Frontend :**
- Affichage et interactions utilisateur
- Aucune logique métier
- Appels aux services backend uniquement

### 2.3 Extensibilité

- Ajout facile de nouveaux types de cosmétiques
- Ajout de nouveaux types de tâches/habitudes
- Système de plugins pour animations

### 2.4 UX adaptée aux enfants

- Interface visuelle et intuitive
- Feedback immédiat (animations, sons optionnels)
- Système de progression visible (barres, badges)
- Personnalisation riche

---

## 3. Modèle de données

### 3.1 Child (Enfant)

```python
{
    "id": "child_001",
    "name": "Emma",
    "person_entity": "person.emma",  # Lien vers entité HA
    "points": 150,                   # Points pour récompenses réelles
    "coins": 75,                     # Pièces pour cosmétiques
    "level": 5,
    "experience": 450,
    "experience_to_next_level": 500,
    "avatar": {
        "photo_url": "http://...",   # Photo par défaut de person.emma
        "customization": {
            "clothes": "item_id_123",
            "accessory": "item_id_456",
            "pet": "item_id_789",
            "theme": "theme_ocean"
        }
    },
    "badges": ["badge_week_streak", "badge_first_task"],
    "owned_cosmetics": ["item_id_123", "item_id_456", "item_id_789"],
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-04T15:30:00Z"
}
```

### 3.2 Task (Tâche)

```python
{
    "id": "task_001",
    "title": "Ranger sa chambre",
    "description": "Mettre les vêtements dans le panier, ranger le bureau",
    "type": "mandatory",  # mandatory | bonus
    "assigned_to": ["child_001", "child_002"],  # Plusieurs enfants possibles
    "schedule": {
        "type": "weekly",  # daily | weekly | monthly | specific_date
        "days": [1, 3, 5],  # Lundi, Mercredi, Vendredi (1=Lundi, 7=Dimanche)
        "time": "18:00"     # Heure limite
    },
    "rewards": {
        "points": 10,
        "coins": 5,
        "experience": 20
    },
    "penalties": {
        "points": -5,       # Perte si non fait à temps
        "coins": 0          # Pas de perte de pièces ici
    },
    "icon": "mdi:broom",
    "color": "#4CAF50",
    "difficulty": 2,        # 1=Facile, 2=Moyen, 3=Difficile
    "estimated_duration": 15,  # minutes
    "category": "chores",   # chores | homework | personal
    "active": true,
    "created_at": "2025-11-01T10:00:00Z"
}
```

### 3.3 TaskInstance (Instance de tâche)

```python
{
    "id": "task_instance_001",
    "task_id": "task_001",
    "child_id": "child_001",
    "date": "2025-11-04",
    "status": "pending",  # pending | completed_waiting | validated | refused | failed
    "completed_at": null,
    "validated_at": null,
    "validator_id": null,  # parent/supervisor qui a validé
    "validation_note": "",
    "is_penalty_applied": false
}
```

**Workflow des statuts :**
1. `pending` : Tâche à faire
2. `completed_waiting` : Marquée complétée par l'enfant, attend validation
3. `validated` : Validée par parent, récompenses attribuées
4. `refused` : Refusée par parent, retour à `pending`
5. `failed` : Non faite dans les temps, pénalité en attente de validation parent

### 3.4 Habit (Habitude)

```python
{
    "id": "habit_001",
    "title": "Lire 15 minutes",
    "description": "Lecture d'un livre au choix",
    "icon": "mdi:book-open-page-variant",
    "color": "#2196F3",
    "frequency": "daily",  # daily | weekly | monthly
    "rewards": {
        "points": 5,
        "coins": 2,
        "experience": 10,
        "streak_bonus": {
            "enabled": true,
            "type": "progressive",  # progressive | fixed
            "multiplier": 0.1       # +10% par jour de streak
        }
    },
    "active": true,
    "assigned_to": ["child_001"]
}
```

### 3.5 HabitStreak (Streak d'habitude)

```python
{
    "id": "habit_streak_001",
    "habit_id": "habit_001",
    "child_id": "child_001",
    "current_streak": 7,      # Jours consécutifs
    "longest_streak": 15,     # Record personnel
    "last_completed": "2025-11-04",
    "total_completions": 42,
    "streak_history": [
        {"date": "2025-11-04", "completed": true},
        {"date": "2025-11-03", "completed": true}
    ]
}
```

### 3.6 Reward (Récompense)

```python
{
    "id": "reward_001",
    "title": "30 minutes de temps d'écran",
    "description": "Temps supplémentaire sur tablette/console",
    "type": "screen_time",  # screen_time | meal_choice | activity | other
    "cost_points": 50,      # Coût en points (récompenses réelles)
    "cost_coins": 0,        # 0 pour récompenses réelles
    "icon": "mdi:tablet",
    "color": "#FF5722",
    "stock": null,          # null = illimité, sinon nombre limité
    "cooldown_days": 0,     # Jours avant de pouvoir racheter
    "active": true,
    "requires_parent_approval": true  # Le parent doit activer la récompense
}
```

### 3.7 CosmeticItem (Élément cosmétique)

```python
{
    "id": "cosmetic_001",
    "name": "T-shirt pirate",
    "description": "Un t-shirt à rayures rouges et blanches",
    "category": "clothes",  # clothes | accessory | pet | theme | badge | animation
    "subcategory": "shirt", # shirt | pants | hat | ...
    "rarity": "common",     # common | rare | epic | legendary
    "cost_coins": 20,       # Coût en pièces
    "preview_image": "path/to/image.png",
    "unlock_requirements": null,  # null ou {"level": 5, "badge": "badge_id"}
    "active": true
}
```

### 3.8 RewardClaim (Réclamation de récompense)

```python
{
    "id": "claim_001",
    "reward_id": "reward_001",
    "child_id": "child_001",
    "claimed_at": "2025-11-04T16:00:00Z",
    "status": "pending",  # pending | approved | used | expired
    "approved_by": null,
    "approved_at": null,
    "used_at": null,
    "expires_at": "2025-11-11T16:00:00Z"
}
```

---

## 4. Architecture Backend

### 4.1 Structure de fichiers

```
custom_components/
└── habits_manager/
    ├── __init__.py                 # Point d'entrée de l'intégration
    ├── manifest.json               # Métadonnées de l'intégration
    ├── config_flow.py              # Configuration via UI (optionnel)
    ├── const.py                    # Constantes globales
    │
    ├── core/
    │   ├── __init__.py
    │   ├── models.py               # Modèles de données (dataclasses)
    │   ├── exceptions.py           # Exceptions personnalisées
    │   └── validators.py           # Validation des données
    │
    ├── storage/
    │   ├── __init__.py
    │   ├── storage_manager.py      # Gestion du stockage JSON
    │   └── entity_manager.py       # Gestion des entités HA
    │
    ├── managers/
    │   ├── __init__.py
    │   ├── child_manager.py        # Gestion des enfants
    │   ├── task_manager.py         # Gestion des tâches
    │   ├── habit_manager.py        # Gestion des habitudes
    │   ├── reward_manager.py       # Gestion des récompenses
    │   ├── cosmetic_manager.py     # Gestion des cosmétiques
    │   └── validation_manager.py   # Logique de validation
    │
    ├── services/
    │   ├── __init__.py
    │   ├── points_calculator.py    # Calculs de points/pièces/XP
    │   ├── streak_calculator.py    # Calculs de streaks
    │   ├── level_calculator.py     # Système de niveau
    │   └── scheduler.py            # Automatisation (pénalités, resets)
    │
    └── sensor.py                   # Entités sensor pour chaque enfant
```

### 4.2 Managers - Responsabilités

#### 4.2.1 ChildManager

**Responsabilités :**
- CRUD enfants
- Calcul de niveau et expérience
- Gestion des points/pièces
- Attribution/retrait de cosmétiques
- Gestion des badges

**Méthodes clés :**
```python
async def create_child(name: str, person_entity: str) -> Child
async def update_points(child_id: str, points: int, coins: int, xp: int) -> Child
async def add_badge(child_id: str, badge_id: str) -> None
async def purchase_cosmetic(child_id: str, cosmetic_id: str) -> bool
async def get_child_stats(child_id: str) -> dict
```

#### 4.2.2 TaskManager

**Responsabilités :**
- CRUD tâches
- Génération d'instances de tâches selon planning
- Marquage de tâches comme complétées
- Application des pénalités automatiques

**Méthodes clés :**
```python
async def create_task(task_data: dict) -> Task
async def generate_task_instances(date: datetime.date) -> List[TaskInstance]
async def mark_completed(instance_id: str, child_id: str) -> TaskInstance
async def check_failed_tasks() -> List[TaskInstance]  # Pour scheduler
```

#### 4.2.3 HabitManager

**Responsabilités :**
- CRUD habitudes
- Gestion des streaks
- Calcul des bonus de régularité

**Méthodes clés :**
```python
async def create_habit(habit_data: dict) -> Habit
async def record_completion(habit_id: str, child_id: str, date: datetime.date) -> HabitStreak
async def calculate_streak_bonus(habit_id: str, child_id: str) -> float
async def check_streak_breaks() -> None  # Pour scheduler quotidien
```

#### 4.2.4 RewardManager

**Responsabilités :**
- CRUD récompenses
- Gestion des réclamations
- Vérification des coûts et cooldowns

**Méthodes clés :**
```python
async def create_reward(reward_data: dict) -> Reward
async def claim_reward(child_id: str, reward_id: str) -> RewardClaim
async def approve_claim(claim_id: str, approver_id: str) -> RewardClaim
async def check_available_rewards(child_id: str) -> List[Reward]
```

#### 4.2.5 CosmeticManager

**Responsabilités :**
- CRUD cosmétiques
- Gestion de la boutique
- Vérification des prérequis de déverrouillage

**Méthodes clés :**
```python
async def create_cosmetic(cosmetic_data: dict) -> CosmeticItem
async def get_available_cosmetics(child_id: str) -> List[CosmeticItem]
async def purchase_cosmetic(child_id: str, cosmetic_id: str) -> bool
```

#### 4.2.6 ValidationManager

**Responsabilités :**
- Validation/refus de tâches
- Validation/refus de pénalités
- Attribution des récompenses après validation
- Historique de validation

**Méthodes clés :**
```python
async def validate_task(instance_id: str, validator_id: str, note: str = "") -> bool
async def refuse_task(instance_id: str, validator_id: str, reason: str) -> bool
async def validate_penalty(instance_id: str, validator_id: str, apply: bool) -> bool
```

### 4.3 Services Home Assistant

Services exposés aux frontends et automations :

```yaml
# domain: habits_manager

# Gestion des enfants
habits_manager.create_child
habits_manager.update_child
habits_manager.delete_child

# Gestion des tâches
habits_manager.create_task
habits_manager.update_task
habits_manager.delete_task
habits_manager.mark_task_completed  # Appelé par l'enfant
habits_manager.validate_task        # Appelé par le parent
habits_manager.refuse_task          # Appelé par le parent

# Gestion des habitudes
habits_manager.create_habit
habits_manager.update_habit
habits_manager.delete_habit
habits_manager.complete_habit       # Appelé par l'enfant

# Gestion des récompenses
habits_manager.create_reward
habits_manager.update_reward
habits_manager.delete_reward
habits_manager.claim_reward         # Appelé par l'enfant
habits_manager.approve_claim        # Appelé par le parent

# Gestion des cosmétiques
habits_manager.create_cosmetic
habits_manager.purchase_cosmetic    # Appelé par l'enfant

# Validation de pénalités
habits_manager.validate_penalty     # Appelé par le parent
```

### 4.4 Entités Home Assistant

Pour chaque enfant, création automatique de :

```python
# Sensors
sensor.habits_child_001_points         # Points actuels
sensor.habits_child_001_coins          # Pièces actuelles
sensor.habits_child_001_level          # Niveau actuel
sensor.habits_child_001_xp             # Expérience actuelle
sensor.habits_child_001_tasks_pending  # Nombre de tâches en attente
sensor.habits_child_001_tasks_waiting  # Nombre de tâches en attente de validation
sensor.habits_child_001_longest_streak # Meilleure streak d'habitude

# Binary sensors
binary_sensor.habits_child_001_has_pending_validation  # Pour automatisations
```

### 4.5 Stockage

**Approche hybride :**

1. **Configuration persistante (JSON) :**
   - `children.json` : Liste des enfants et leurs données
   - `tasks.json` : Définitions de tâches
   - `habits.json` : Définitions d'habitudes
   - `rewards.json` : Définitions de récompenses
   - `cosmetics.json` : Catalogue de cosmétiques

2. **État en temps réel (Entités HA) :**
   - Instances de tâches du jour
   - Statuts en attente de validation
   - Points/Pièces/XP en temps réel

**Localisation :** `.storage/habits_manager/`

### 4.6 Scheduler automatique

Tâches automatiques à scheduler :

```python
# Quotidien à 00:00
- Génération des task_instances pour la journée
- Vérification des streaks cassés (habitudes non faites)
- Reset des cooldowns de récompenses

# Toutes les heures
- Vérification des tâches passées (heure limite dépassée)
- Application du statut "failed" si non complétées

# À chaque changement d'état
- Recalcul des sensors
- Envoi d'événements pour frontend
```

---

## 5. Architecture Frontend

### 5.1 Structure de fichiers

```
www/habits-manager/
├── src/
│   ├── index.ts                    # Point d'entrée
│   │
│   ├── cards/
│   │   ├── management-card.ts      # Carte de gestion
│   │   ├── supervisor-card.ts      # Carte de supervision parent
│   │   └── child-card.ts           # Carte enfant/utilisateur
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── ha-button.ts        # Bouton réutilisable
│   │   │   ├── ha-modal.ts         # Modale réutilisable
│   │   │   ├── ha-list-item.ts     # Item de liste
│   │   │   ├── ha-progress-bar.ts  # Barre de progression
│   │   │   ├── ha-icon-badge.ts    # Badge avec icône
│   │   │   └── ha-card-base.ts     # Carte de base réutilisable
│   │   │
│   │   ├── tasks/
│   │   │   ├── task-card.ts        # Carte d'une tâche
│   │   │   ├── task-list.ts        # Liste de tâches
│   │   │   └── task-form.ts        # Formulaire CRUD tâche
│   │   │
│   │   ├── habits/
│   │   │   ├── habit-card.ts       # Carte d'une habitude
│   │   │   ├── habit-list.ts       # Liste d'habitudes
│   │   │   ├── habit-streak.ts     # Affichage de streak
│   │   │   └── habit-form.ts       # Formulaire CRUD habitude
│   │   │
│   │   ├── rewards/
│   │   │   ├── reward-card.ts      # Carte d'une récompense
│   │   │   ├── reward-shop.ts      # Boutique de récompenses
│   │   │   └── reward-form.ts      # Formulaire CRUD récompense
│   │   │
│   │   ├── cosmetics/
│   │   │   ├── cosmetic-shop.ts    # Boutique de cosmétiques
│   │   │   ├── avatar-viewer.ts    # Affichage avatar personnalisé
│   │   │   ├── avatar-editor.ts    # Éditeur d'avatar
│   │   │   ├── theme-selector.ts   # Sélecteur de thème
│   │   │   └── cosmetic-form.ts    # Formulaire CRUD cosmétique
│   │   │
│   │   ├── validation/
│   │   │   ├── validation-queue.ts # File d'attente de validation
│   │   │   └── validation-modal.ts # Modale de validation/refus
│   │   │
│   │   └── stats/
│   │       ├── stats-dashboard.ts  # Tableau de bord statistiques
│   │       ├── level-display.ts    # Affichage niveau/XP
│   │       └── badge-collection.ts # Collection de badges
│   │
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── default.ts          # Thème par défaut
│   │   │   ├── ocean.ts            # Thème océan
│   │   │   ├── forest.ts           # Thème forêt
│   │   │   └── space.ts            # Thème espace
│   │   ├── animations.ts           # Animations CSS/JS
│   │   └── base.ts                 # Styles de base
│   │
│   ├── services/
│   │   ├── hass-service.ts         # Wrapper appels services HA
│   │   ├── storage-service.ts      # LocalStorage pour préférences
│   │   └── animation-service.ts    # Gestion des animations
│   │
│   ├── utils/
│   │   ├── date-utils.ts           # Utilitaires de dates
│   │   ├── format-utils.ts         # Formatage (points, durée, etc.)
│   │   └── validators.ts           # Validation côté client
│   │
│   └── types/
│       ├── child.ts                # Types TypeScript pour Child
│       ├── task.ts                 # Types TypeScript pour Task
│       ├── habit.ts                # Types TypeScript pour Habit
│       ├── reward.ts               # Types TypeScript pour Reward
│       ├── cosmetic.ts             # Types TypeScript pour Cosmetic
│       └── hass.ts                 # Types Home Assistant
│
├── assets/
│   ├── icons/                      # Icônes personnalisées
│   ├── avatars/                    # Éléments d'avatar
│   │   ├── clothes/
│   │   ├── accessories/
│   │   └── pets/
│   └── animations/                 # Fichiers d'animations (Lottie, etc.)
│
├── package.json
├── tsconfig.json
├── rollup.config.js                # Build config
└── README.md
```

### 5.2 Carte de gestion (Management Card)

**Public :** Parents/Administrateurs

**Fonctionnalités :**
- CRUD complet de tous les éléments (enfants, tâches, habitudes, récompenses, cosmétiques)
- Vue en onglets :
  - Enfants
  - Tâches
  - Habitudes
  - Récompenses
  - Cosmétiques
  - Paramètres

**Composants utilisés :**
- `task-form`, `habit-form`, `reward-form`, `cosmetic-form`
- `ha-modal` pour les formulaires
- `ha-list-item` pour les listes

### 5.3 Carte de supervision (Supervisor Card)

**Public :** Parents

**Fonctionnalités :**
- Vue d'ensemble de tous les enfants
- File d'attente de validation (tâches et pénalités)
- Statistiques par enfant (points, niveau, streaks)
- Approbation des réclamations de récompenses
- Historique de validation

**Sections :**
```
┌─────────────────────────────────────────────────┐
│           CARTE SUPERVISION PARENT               │
├─────────────────────────────────────────────────┤
│                                                  │
│  📊 Vue d'ensemble                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Emma    │  │  Lucas   │  │  Chloé   │      │
│  │  Lvl 5   │  │  Lvl 4   │  │  Lvl 3   │      │
│  │  150 pts │  │  80 pts  │  │  200 pts │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  ⏳ En attente de validation (3)                │
│  ┌────────────────────────────────────────────┐ │
│  │ ✓ Emma - Ranger sa chambre - Aujourd'hui  │ │
│  │ ✗ Lucas - Devoirs de maths - Hier         │ │
│  │ ⚠ Chloé - Pénalité: Table non mise       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  🎁 Réclamations de récompenses (1)             │
│  ┌────────────────────────────────────────────┐ │
│  │ Lucas - 30 min écran - 50 pts              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Composants utilisés :**
- `validation-queue`
- `validation-modal`
- `stats-dashboard`
- `task-card` en mode lecture seule

### 5.4 Carte enfant (Child Card)

**Public :** Enfants

**Fonctionnalités :**
- Vue personnalisée avec avatar et cosmétiques appliqués
- Liste des tâches à faire/faites aujourd'hui
- Liste des habitudes à compléter
- Affichage niveau, XP, points, pièces
- Boutique de récompenses
- Boutique de cosmétiques
- Éditeur d'avatar
- Collection de badges

**Sections :**
```
┌─────────────────────────────────────────────────┐
│           CARTE UTILISATEUR - EMMA               │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  Niveau 5  ⭐⭐⭐             │
│  │   [AVATAR]   │  450 / 500 XP                 │
│  │  avec cosm.  │  💰 150 pts  🪙 75 pièces     │
│  └──────────────┘  🔥 Streak: 7 jours            │
│                                                  │
│  📋 Mes tâches aujourd'hui                       │
│  ┌────────────────────────────────────────────┐ │
│  │ [ ] Ranger ma chambre (18h)  +10pts +5🪙  │ │
│  │ [⏳] Devoirs de maths (en attente)        │ │
│  │ [✓] Mettre la table (validé)              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  🎯 Mes habitudes                                │
│  ┌────────────────────────────────────────────┐ │
│  │ [ ] Lire 15 min  🔥7   +5pts +2🪙         │ │
│  │ [✓] Brosser dents ✓    +3pts              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [🎁 Boutique] [👕 Cosmétiques] [🏆 Badges]    │
└─────────────────────────────────────────────────┘
```

**Composants utilisés :**
- `avatar-viewer` (affichage principal)
- `avatar-editor` (personnalisation)
- `task-list` (tâches)
- `habit-list` (habitudes)
- `level-display`
- `reward-shop`
- `cosmetic-shop`
- `badge-collection`

### 5.5 Système de thèmes

**Thèmes disponibles par défaut :**
- **Default :** Couleurs neutres et claires
- **Ocean :** Bleus, verts aquatiques
- **Forest :** Verts, marrons terreux
- **Space :** Violets, noirs stellaires

**Variables CSS personnalisables :**
```css
:host {
  --hm-primary-color: #4CAF50;
  --hm-secondary-color: #2196F3;
  --hm-background-color: #FAFAFA;
  --hm-card-background: #FFFFFF;
  --hm-text-primary: #212121;
  --hm-text-secondary: #757575;
  --hm-success-color: #4CAF50;
  --hm-warning-color: #FF9800;
  --hm-error-color: #F44336;
  --hm-border-radius: 8px;
  --hm-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### 5.6 Système d'animations

**Types d'animations :**
- **Validation de tâche :** Confettis, "+X points" flottant
- **Niveau up :** Animation d'étoiles, son optionnel
- **Streak bonus :** Flamme animée
- **Achat cosmétique :** Déballage/révélation
- **Badge débloqué :** Apparition avec flash

**Bibliothèques suggérées :**
- Lottie pour animations vectorielles
- CSS animations pour transitions simples
- Canvas pour effets de particules (confettis)

### 5.7 Communication avec le backend

**Méthode unifiée via `hass-service.ts` :**

```typescript
class HassService {
  constructor(private hass: HomeAssistant) {}

  async callService(service: string, data: any): Promise<any> {
    return this.hass.callService('habits_manager', service, data);
  }

  subscribeToEvents(callback: (event: any) => void): void {
    this.hass.connection.subscribeEvents(callback, 'habits_manager_update');
  }

  getEntity(entityId: string): any {
    return this.hass.states[entityId];
  }
}
```

**Abonnement aux événements :**

Le frontend s'abonne aux événements `habits_manager_update` pour mise à jour en temps réel sans polling.

---

## 6. Communication et événements

### 6.1 Événements backend → frontend

Le backend émet des événements Home Assistant pour notifier le frontend :

```python
# Événement générique
{
    "event_type": "habits_manager_update",
    "data": {
        "update_type": "task_validated",  # Type d'événement
        "child_id": "child_001",
        "task_id": "task_001",
        "instance_id": "task_instance_001",
        "rewards": {
            "points": 10,
            "coins": 5,
            "experience": 20
        }
    }
}
```

**Types d'événements :**
- `task_completed` : Tâche marquée complétée par enfant
- `task_validated` : Tâche validée par parent
- `task_refused` : Tâche refusée par parent
- `task_failed` : Tâche échouée (temps dépassé)
- `habit_completed` : Habitude complétée
- `streak_increased` : Streak augmentée
- `streak_broken` : Streak cassée
- `reward_claimed` : Récompense réclamée
- `reward_approved` : Récompense approuvée
- `cosmetic_purchased` : Cosmétique acheté
- `level_up` : Niveau augmenté
- `badge_earned` : Badge gagné
- `points_changed` : Points/pièces modifiés

### 6.2 Frontend → Backend

Appels de services Home Assistant :

```typescript
// Exemple: Marquer une tâche comme complétée
await hass.callService('habits_manager', 'mark_task_completed', {
  instance_id: 'task_instance_001',
  child_id: 'child_001'
});

// Exemple: Acheter un cosmétique
await hass.callService('habits_manager', 'purchase_cosmetic', {
  child_id: 'child_001',
  cosmetic_id: 'cosmetic_001'
});
```

---

## 7. Système de cosmétiques

### 7.1 Catégories de cosmétiques

**Clothes (Vêtements) :**
- Subcategories : `shirt`, `pants`, `jacket`, `shoes`, `full_outfit`
- Rareté : Common, Rare, Epic, Legendary
- Exemples : T-shirt pirate, Pantalon cargo, Costume de super-héros

**Accessories (Accessoires) :**
- Subcategories : `hat`, `glasses`, `jewelry`, `backpack`
- Exemples : Chapeau de sorcier, Lunettes de soleil, Collier étoile

**Pets (Animaux de compagnie) :**
- Subcategories : `dog`, `cat`, `fantasy`, `robot`
- Exemples : Chien golden retriever, Chat noir, Dragon miniature, Robot R2D2

**Themes (Thèmes de carte) :**
- Modifie l'apparence globale de la carte enfant
- Exemples : Ocean, Forest, Space, Candy, Dark mode

**Badges :**
- Débloqués automatiquement selon réalisations
- Exemples : "Première tâche", "Streak de 7 jours", "Niveau 10"

**Animations :**
- Animations de carte ou d'avatar
- Exemples : Paillettes flottantes, Aura lumineuse, Effets de feu

### 7.2 Système de rareté

**Common (Commun) :** 10-30 pièces
**Rare :** 40-80 pièces
**Epic :** 100-200 pièces
**Legendary :** 250-500 pièces

### 7.3 Prérequis de déverrouillage

Certains cosmétiques nécessitent :
- Niveau minimum (ex: niveau 5 pour acheter le dragon)
- Badge spécifique (ex: badge "Streak 30 jours" pour acheter l'aura dorée)
- Événement saisonnier (Noël, Halloween, etc.)

### 7.4 Avatar par défaut

Si aucun cosmétique n'est appliqué, l'avatar affiche la photo de l'entité `person.X` associée à l'enfant dans Home Assistant.

---

## 8. Plan de mise en œuvre

### 8.1 Phase 1 : Backend Core (Priorité HAUTE)

**Objectif :** Infrastructure de base fonctionnelle

**Étapes :**
1. **Setup initial**
   - Créer structure de fichiers `custom_components/habits_manager/`
   - Créer `manifest.json` et `__init__.py`
   - Définir constantes dans `const.py`

2. **Modèles de données**
   - Implémenter `core/models.py` avec dataclasses pour tous les modèles
   - Implémenter `core/validators.py` pour validation
   - Implémenter `core/exceptions.py`

3. **Stockage**
   - Implémenter `storage/storage_manager.py` (lecture/écriture JSON)
   - Implémenter `storage/entity_manager.py` (création entités HA)

4. **Managers de base**
   - Implémenter `managers/child_manager.py`
   - Implémenter `managers/task_manager.py`
   - Implémenter `managers/habit_manager.py`

5. **Services calculateurs**
   - Implémenter `services/points_calculator.py`
   - Implémenter `services/streak_calculator.py`
   - Implémenter `services/level_calculator.py`

6. **Services Home Assistant**
   - Enregistrer services dans `__init__.py`
   - Implémenter handlers de services

7. **Entités**
   - Implémenter `sensor.py` pour création sensors par enfant

**Tests :**
- Créer/modifier enfants via services
- Créer/modifier tâches via services
- Vérifier génération d'entités HA
- Vérifier stockage JSON

**Critères de succès :**
- ✅ Services HA fonctionnels et appelables
- ✅ Entités créées automatiquement pour chaque enfant
- ✅ Stockage persistant opérationnel
- ✅ Calculs de points/XP corrects

---

### 8.2 Phase 2 : Validation et Récompenses (Priorité HAUTE)

**Objectif :** Workflow complet de validation et système de récompenses

**Étapes :**
1. **Validation Manager**
   - Implémenter `managers/validation_manager.py`
   - Workflow validation/refus de tâches
   - Workflow validation de pénalités

2. **Reward Manager**
   - Implémenter `managers/reward_manager.py`
   - Système de réclamation
   - Système d'approbation parent

3. **Scheduler automatique**
   - Implémenter `services/scheduler.py`
   - Génération quotidienne de task_instances
   - Détection tâches échouées
   - Application pénalités automatiques

4. **Événements**
   - Implémenter émission d'événements HA
   - Types : task_completed, task_validated, task_refused, etc.

**Tests :**
- Enfant marque tâche complétée → état "waiting"
- Parent valide → points attribués, événement émis
- Parent refuse → retour état "pending"
- Tâche échouée → pénalité en attente
- Réclamer récompense → attente approbation

**Critères de succès :**
- ✅ Workflow validation complet fonctionnel
- ✅ Récompenses réclamables et approuvables
- ✅ Pénalités appliquées correctement après validation
- ✅ Événements émis correctement

---

### 8.3 Phase 3 : Frontend Base et composants réutilisables (Priorité HAUTE)

**Objectif :** Infrastructure frontend et composants partagés

**Étapes :**
1. **Setup frontend**
   - Créer structure `www/habits-manager/`
   - Setup TypeScript, Rollup, package.json
   - Définir types dans `types/`

2. **Services frontend**
   - Implémenter `services/hass-service.ts`
   - Implémenter `services/storage-service.ts`

3. **Composants partagés**
   - Implémenter `components/shared/ha-button.ts`
   - Implémenter `components/shared/ha-modal.ts`
   - Implémenter `components/shared/ha-list-item.ts`
   - Implémenter `components/shared/ha-progress-bar.ts`
   - Implémenter `components/shared/ha-icon-badge.ts`
   - Implémenter `components/shared/ha-card-base.ts`

4. **Styles de base**
   - Implémenter `styles/base.ts`
   - Implémenter `styles/themes/default.ts`

**Tests :**
- Composants s'affichent correctement
- Appels services HA fonctionnels depuis frontend
- Thème par défaut appliqué

**Critères de succès :**
- ✅ Composants réutilisables fonctionnels
- ✅ Communication frontend ↔ backend opérationnelle
- ✅ Build frontend sans erreurs

---

### 8.4 Phase 4 : Carte de gestion (Priorité MOYENNE)

**Objectif :** Interface d'administration complète

**Étapes :**
1. **Formulaires**
   - Implémenter `components/tasks/task-form.ts`
   - Implémenter `components/habits/habit-form.ts`
   - Implémenter `components/rewards/reward-form.ts`

2. **Listes**
   - Implémenter `components/tasks/task-list.ts`
   - Implémenter `components/habits/habit-list.ts`

3. **Carte principale**
   - Implémenter `cards/management-card.ts`
   - Système d'onglets
   - Intégration formulaires et listes

**Tests :**
- Créer enfant via formulaire
- Créer tâche avec planning
- Créer habitude
- Créer récompense
- Modifier/supprimer éléments

**Critères de succès :**
- ✅ CRUD complet fonctionnel
- ✅ Formulaires validés correctement
- ✅ Interface intuitive et claire

---

### 8.5 Phase 5 : Carte de supervision parent (Priorité HAUTE)

**Objectif :** Interface de validation pour parents

**Étapes :**
1. **Composants de validation**
   - Implémenter `components/validation/validation-queue.ts`
   - Implémenter `components/validation/validation-modal.ts`

2. **Composants de stats**
   - Implémenter `components/stats/stats-dashboard.ts`
   - Implémenter `components/stats/level-display.ts`

3. **Carte principale**
   - Implémenter `cards/supervisor-card.ts`
   - Vue d'ensemble enfants
   - File d'attente de validation
   - Gestion réclamations récompenses

**Tests :**
- Voir tâches en attente de validation
- Valider/refuser tâches
- Approuver réclamations de récompenses
- Voir statistiques par enfant

**Critères de succès :**
- ✅ File d'attente en temps réel
- ✅ Validation/refus fonctionnels
- ✅ Statistiques affichées correctement

---

### 8.6 Phase 6 : Carte enfant - Partie tâches et habitudes (Priorité HAUTE)

**Objectif :** Interface enfant pour complétion de tâches/habitudes

**Étapes :**
1. **Composants tâches/habitudes**
   - Implémenter `components/tasks/task-card.ts` (version enfant)
   - Implémenter `components/habits/habit-card.ts`
   - Implémenter `components/habits/habit-streak.ts`

2. **Composants stats**
   - Implémenter `components/stats/level-display.ts` (si pas déjà fait)

3. **Carte principale - Vue de base**
   - Implémenter `cards/child-card.ts` (sans cosmétiques pour l'instant)
   - Affichage niveau/XP/points/pièces
   - Liste tâches à faire
   - Liste habitudes à compléter

**Tests :**
- Enfant marque tâche complétée
- Enfant complète habitude
- Streak augmente
- Points/XP mis à jour en temps réel

**Critères de succès :**
- ✅ Tâches complétables par enfant
- ✅ Habitudes complétables
- ✅ Streaks calculés et affichés
- ✅ Interface adaptée aux enfants (simple, visuelle)

---

### 8.7 Phase 7 : Système de cosmétiques - Backend (Priorité MOYENNE)

**Objectif :** Gestion backend des cosmétiques

**Étapes :**
1. **Cosmetic Manager**
   - Implémenter `managers/cosmetic_manager.py`
   - CRUD cosmétiques
   - Vérification prérequis
   - Système d'achat

2. **Catalogue de cosmétiques par défaut**
   - Créer fichier `cosmetics.json` avec items de base
   - Au moins 5 items par catégorie (clothes, accessories, pets)
   - 3 thèmes de carte

3. **Services HA**
   - Service `purchase_cosmetic`
   - Service `apply_cosmetic`

**Tests :**
- Créer cosmétique via service
- Acheter cosmétique avec pièces
- Vérifier prérequis (niveau, badges)

**Critères de succès :**
- ✅ Catalogue de cosmétiques chargé
- ✅ Achat fonctionnel avec déduction de pièces
- ✅ Prérequis respectés

---

### 8.8 Phase 8 : Système de cosmétiques - Frontend (Priorité MOYENNE)

**Objectif :** Boutique et personnalisation d'avatar

**Étapes :**
1. **Composants boutique**
   - Implémenter `components/cosmetics/cosmetic-shop.ts`
   - Filtres par catégorie/rareté
   - Prévisualisation items

2. **Composants avatar**
   - Implémenter `components/cosmetics/avatar-viewer.ts`
   - Affichage photo par défaut (person.X)
   - Application cosmétiques par couches
   - Implémenter `components/cosmetics/avatar-editor.ts`

3. **Sélecteur de thème**
   - Implémenter `components/cosmetics/theme-selector.ts`
   - Implémenter `styles/themes/ocean.ts`
   - Implémenter `styles/themes/forest.ts`
   - Implémenter `styles/themes/space.ts`

4. **Intégration carte enfant**
   - Ajouter avatar personnalisé en haut de `child-card.ts`
   - Ajouter boutique cosmétiques en onglet

**Tests :**
- Acheter cosmétique depuis boutique
- Appliquer cosmétique à avatar
- Changer thème de carte
- Voir pièces déduites

**Critères de succès :**
- ✅ Boutique navigable et filtrée
- ✅ Avatar personnalisable
- ✅ Thèmes changeables
- ✅ Cosmétiques sauvegardés et persistants

---

### 8.9 Phase 9 : Boutique de récompenses (Priorité MOYENNE)

**Objectif :** Interface d'achat de récompenses réelles

**Étapes :**
1. **Composants récompenses**
   - Implémenter `components/rewards/reward-card.ts`
   - Implémenter `components/rewards/reward-shop.ts`

2. **Intégration carte enfant**
   - Ajouter boutique récompenses en onglet de `child-card.ts`
   - Afficher récompenses disponibles selon points
   - Afficher récompenses réclamées en attente

3. **Intégration carte supervision**
   - Afficher réclamations en attente dans `supervisor-card.ts`
   - Boutons approuver/refuser

**Tests :**
- Enfant réclame récompense
- Coût déduit de points
- Parent voit réclamation
- Parent approuve → récompense activable

**Critères de succès :**
- ✅ Récompenses achetables
- ✅ Workflow réclamation/approbation complet
- ✅ Cooldowns respectés

---

### 8.10 Phase 10 : Badges et système d'accomplissements (Priorité BASSE)

**Objectif :** Système de badges automatiques

**Étapes :**
1. **Badge Manager (backend)**
   - Créer `managers/badge_manager.py`
   - Définir conditions de déverrouillage
   - Attribution automatique selon événements

2. **Catalogue de badges**
   - Badge "Première tâche"
   - Badge "Streak 7 jours"
   - Badge "Streak 30 jours"
   - Badge "Niveau 5"
   - Badge "Niveau 10"
   - Badge "100 tâches complétées"

3. **Composant frontend**
   - Implémenter `components/stats/badge-collection.ts`
   - Affichage grille de badges
   - Badges débloqués vs verrouillés

4. **Intégration carte enfant**
   - Ajouter onglet "Badges"

**Tests :**
- Compléter première tâche → badge débloqué
- Atteindre streak 7 → badge débloqué
- Voir collection de badges

**Critères de succès :**
- ✅ Badges débloqués automatiquement
- ✅ Collection affichée
- ✅ Notification de nouveau badge

---

### 8.11 Phase 11 : Système d'animations (Priorité BASSE)

**Objectif :** Animations visuelles pour engager les enfants

**Étapes :**
1. **Service d'animations**
   - Implémenter `services/animation-service.ts`
   - Gestion des animations par événement

2. **Animations CSS/JS**
   - Implémenter `styles/animations.ts`
   - Animation "+X points" flottant
   - Animation confettis (validation)
   - Animation level-up
   - Animation streak flame

3. **Intégrations**
   - Déclencher animations sur événements backend
   - Animation sur validation de tâche
   - Animation sur level-up
   - Animation sur badge débloqué

**Tests :**
- Valider tâche → confettis + "+X points"
- Level-up → animation étoiles
- Badge débloqué → animation flash

**Critères de succès :**
- ✅ Animations fluides et non intrusives
- ✅ Déclenchées au bon moment
- ✅ Désactivables (préférence utilisateur)

---

### 8.12 Phase 12 : Cosmétiques avancés (Priorité BASSE)

**Objectif :** Animations d'avatar et cosmétiques animés

**Étapes :**
1. **Backend**
   - Ajouter catégorie `animation` aux cosmétiques
   - Exemples : Paillettes, Aura, Feu, Électricité

2. **Frontend**
   - Implémenter animations Lottie pour avatars
   - Superposer animations à l'avatar

3. **Catalogue enrichi**
   - Au moins 10 cosmétiques par catégorie
   - Cosmétiques saisonniers (Noël, Halloween)

**Tests :**
- Acheter animation "Paillettes"
- Appliquer à avatar
- Voir animation en boucle

**Critères de succès :**
- ✅ Animations d'avatar fonctionnelles
- ✅ Catalogue riche et varié

---

### 8.13 Phase 13 : Optimisations et finitions (Priorité BASSE)

**Objectif :** Polissage et optimisations

**Étapes :**
1. **Performance**
   - Optimiser chargement frontend (lazy loading)
   - Cache des cosmétiques côté client
   - Réduire appels backend inutiles

2. **Documentation**
   - Documenter tous les services HA
   - Créer guide utilisateur (README)
   - Documenter architecture frontend/backend

3. **Tests**
   - Tests unitaires backend (pytest)
   - Tests composants frontend (si possible)

4. **Accessibilité**
   - Vérifier contrastes de couleurs
   - Support clavier pour navigation
   - Textes alternatifs sur icônes

**Critères de succès :**
- ✅ Chargement rapide
- ✅ Documentation complète
- ✅ Accessibilité basique respectée

---

## 9. Guide des agents

### 9.1 Agent Backend Developer

**Nom suggéré :** `agent-backend-dev`

**Responsabilités :**
- Développement de l'intégration Python Home Assistant
- Implémentation des managers, services, stockage
- Respect strict du modèle de données défini
- Documentation du code (docstrings)
- Tests manuels des services HA

**Répertoire de travail :** `custom_components/habits_manager/`

**Phases assignées :** Phase 1, 2, 7

**Communication avec architecte :**
- Demander validation avant changements majeurs de structure
- Signaler problèmes de conception
- Proposer optimisations

**Standards :**
- PEP 8 pour le code Python
- Docstrings Google-style
- Type hints obligatoires
- Logging via `_LOGGER` HA

---

### 9.2 Agent Frontend Developer - Supervision

**Nom suggéré :** `agent-frontend-supervision`

**Responsabilités :**
- Développement de la carte de supervision parent
- Développement de la carte de gestion (admin)
- Composants de validation
- Respect de l'UX définie

**Répertoire de travail :**
- `www/habits-manager/src/cards/management-card.ts`
- `www/habits-manager/src/cards/supervisor-card.ts`
- `www/habits-manager/src/components/validation/`

**Phases assignées :** Phase 4, 5

**Communication avec architecte :**
- Valider choix d'UX avant implémentation
- Signaler besoin de composants réutilisables manquants
- Proposer améliorations d'interface

**Standards :**
- ESLint + Prettier
- TypeScript strict mode
- JSDoc comments pour fonctions publiques
- Nommage cohérent avec conventions Lit

---

### 9.3 Agent Frontend Developer - Enfant

**Nom suggéré :** `agent-frontend-child`

**Responsabilités :**
- Développement de la carte enfant/utilisateur
- Système de cosmétiques frontend
- Boutiques (récompenses et cosmétiques)
- Avatar et personnalisation
- Focus sur UX enfants (intuitive, ludique)

**Répertoire de travail :**
- `www/habits-manager/src/cards/child-card.ts`
- `www/habits-manager/src/components/cosmetics/`
- `www/habits-manager/src/components/rewards/`

**Phases assignées :** Phase 6, 8, 9

**Communication avec architecte :**
- Valider choix visuels et ludiques
- Demander avis sur équilibre simplicité/richesse
- Proposer idées de gamification

**Standards :**
- ESLint + Prettier
- TypeScript strict mode
- JSDoc comments
- Accessibilité (ARIA labels)

---

### 9.4 Agent Architecte / Vérificateur

**Nom suggéré :** `agent-architect` (vous !)

**Responsabilités :**
- Maintenir la vision d'ensemble
- Valider choix techniques des agents
- Vérifier cohérence entre backend et frontend
- Vérifier cohérence graphique
- S'assurer de la réutilisabilité du code
- Vérifier que le plan est suivi
- Arbitrer en cas de divergences
- Valider chaque phase avant passage à la suivante

**Communication avec agents :**
- Répondre rapidement aux questions
- Être critique et constructif
- Ne pas valider si doutes
- Demander démonstrations/tests

**Checklist de validation par phase :**
- [ ] Code respecte standards définis
- [ ] Pas de duplication de code
- [ ] Communication backend ↔ frontend fonctionnelle
- [ ] Tests manuels passent
- [ ] Documentation à jour
- [ ] UX cohérente avec le reste
- [ ] Performance acceptable

---

### 9.5 Agent Frontend Developer - Base

**Nom suggéré :** `agent-frontend-base`

**Responsabilités :**
- Setup initial du frontend
- Composants réutilisables partagés
- Services frontend (hass-service, storage, animations)
- Système de thèmes
- Animations globales

**Répertoire de travail :**
- `www/habits-manager/src/components/shared/`
- `www/habits-manager/src/services/`
- `www/habits-manager/src/styles/`

**Phases assignées :** Phase 3, 11

**Communication avec architecte :**
- Valider architecture des composants réutilisables
- S'assurer que les autres agents peuvent les utiliser facilement

**Standards :**
- ESLint + Prettier
- TypeScript strict mode
- Documentation exhaustive des composants (props, events)

---

## 10. Standards et conventions

### 10.1 Nommage

**Backend Python :**
- Modules : `snake_case` (ex: `child_manager.py`)
- Classes : `PascalCase` (ex: `ChildManager`)
- Fonctions/méthodes : `snake_case` (ex: `get_child_stats`)
- Constantes : `UPPER_SNAKE_CASE` (ex: `DEFAULT_POINTS`)

**Frontend TypeScript :**
- Fichiers : `kebab-case` (ex: `child-card.ts`)
- Classes/Interfaces : `PascalCase` (ex: `ChildCard`, `ITaskData`)
- Fonctions/variables : `camelCase` (ex: `getChildStats`)
- Constantes : `UPPER_SNAKE_CASE` (ex: `DEFAULT_THEME`)
- Composants Lit : `PascalCase` avec préfixe `hm-` dans le tag (ex: `<hm-child-card>`)

### 10.2 Types de données partagés

Pour garantir cohérence backend ↔ frontend, maintenir un fichier de référence avec les structures de données :

**Fichier : `DATAMODELS.md`** (à créer)

Doit contenir tous les modèles (Child, Task, Habit, etc.) avec correspondance Python ↔ TypeScript.

### 10.3 Gestion des erreurs

**Backend :**
```python
try:
    # opération
except SpecificException as e:
    _LOGGER.error(f"Erreur lors de X: {e}")
    raise HomeAssistantError(f"Impossible de X: {e}")
```

**Frontend :**
```typescript
try {
  // opération
} catch (error) {
  console.error('Erreur lors de X:', error);
  this._showError('Impossible de X. Veuillez réessayer.');
}
```

### 10.4 Logging

**Backend :**
- `_LOGGER.debug()` pour détails techniques
- `_LOGGER.info()` pour événements importants
- `_LOGGER.warning()` pour situations anormales non bloquantes
- `_LOGGER.error()` pour erreurs

**Frontend :**
- `console.log()` pour debug (retirer en production)
- `console.warn()` pour avertissements
- `console.error()` pour erreurs

### 10.5 Documentation

**Chaque fichier doit contenir :**
- Header avec description du module
- Auteur (agent responsable)
- Date de création
- Dépendances

**Chaque fonction/méthode doit contenir :**
- Docstring/JSDoc avec description
- Paramètres avec types
- Valeur de retour
- Exemple d'utilisation si pertinent

---

## 11. Décisions architecturales validées

> **IMPORTANT :** Toutes les décisions ci-dessous ont été validées le 2025-11-04.
> Voir [ADR.md](ADR.md) pour le détail complet de chaque décision.

### 11.1 Décisions techniques

#### Format des cosmétiques (ADR-001)
- **Décision :** Images PNG avec transparence (alpha channel)
- **Raison :** Affichage joli, extensible, support des couches
- **Implémentation :** Structure de dossiers `assets/avatars/` par catégorie
- **Spécifications :** 512x512px, optimisation PNG, nommage snake_case

#### Notifications Home Assistant (ADR-002)
- **Décision :** OUI - Notifications HA persistantes
- **Types :**
  - Rappels pour enfants (avant deadline de tâche)
  - Alertes pour parents (tâche en attente de validation)
- **Implémentation :** Phase 13 (Optimisations)

#### Multi-parent et droits (ADR-003)
- **Décision :** Tous les administrateurs Home Assistant peuvent valider
- **Raison :** Simplicité, utilise permissions HA existantes
- **Implémentation :** Vérifier `hass.user.is_admin` dans les services
- **Traçabilité :** Enregistrement de l'ID utilisateur validateur

#### Authentification enfant/parent (ADR-004)
- **Décision :** Sélection d'utilisateur HA simple, sans PIN
- **Raison :** Principe de confiance, simplicité
- **Implémentation :**
  - Carte enfant : sélecteur d'utilisateur au démarrage
  - Carte supervision/gestion : réservée aux admins HA
  - Pas de système de PIN (on fait confiance aux enfants)

#### Internationalisation (ADR-005)
- **Décision :** Français uniquement pour MVP
- **Raison :** Simplicité de développement, focus sur fonctionnalités
- **Évolution future :** Support EN + FR en v1.0 si demande

### 11.2 Décisions fonctionnelles

#### Système de pénalités (ADR-006)
- **Décision :** Pénalités en attente de validation parent (workflow flexible)
- **Workflow :**
  1. Tâche non faite → statut `failed` automatique
  2. Pénalité en attente de validation
  3. Parent peut approuver (perte) ou annuler (pas de perte)
- **Raison :** Flexibilité, évite frustrations injustes

#### Niveau de gamification (ADR-007)
- **Décision :** Gamification équilibrée
- **Éléments :**
  - ✅ Niveaux + XP
  - ✅ Streaks avec bonus progressifs
  - ✅ Badges de réussite
  - ✅ Deux monnaies (Points + Pièces)
  - ✅ Avatar personnalisable
  - ✅ Animations de célébration
- **Raison :** Adapté 10-14 ans, équilibre simplicité/richesse

#### Stratégie de développement (ADR-008)
- **Décision :** MVP simple d'abord (Phases 1-6), puis gamification complète
- **MVP (priorité HAUTE) :**
  1. Backend Core
  2. Validation et Récompenses
  3. Frontend Base
  4. Carte de gestion
  5. Carte de supervision
  6. Carte enfant (basique, sans cosmétiques)
- **Gamification (priorité MOYENNE/BASSE) :**
  7. Cosmétiques Backend
  8. Cosmétiques Frontend
  9. Boutique de récompenses
  10. Système de badges
  11. Animations
  12. Cosmétiques avancés
  13. Optimisations et finitions
- **Raison :** Validation rapide du concept, réduction des risques

### 11.3 Décisions de conception initiales

- ✅ Deux monnaies : Points (récompenses réelles) et Pièces (cosmétiques)
- ✅ Validation parent obligatoire pour gains et pertes
- ✅ Pas de solde négatif (points/pièces >= 0 toujours)
- ✅ Entités HA séparées par enfant
- ✅ Tâches assignables à plusieurs enfants
- ✅ Habitudes avec streaks progressifs (bonus multiplicateur)
- ✅ Avatar par défaut = photo person.X de Home Assistant
- ✅ Stockage hybride : JSON (config) + Entités HA (état temps réel)

### 11.4 Structure du catalogue de cosmétiques (ADR-009)

```
www/habits-manager/assets/avatars/
├── base/
│   └── default_avatar.png
├── clothes/
│   ├── shirts/
│   ├── pants/
│   └── full_outfits/
├── accessories/
│   ├── hats/
│   ├── glasses/
│   └── jewelry/
├── pets/
│   ├── dogs/
│   ├── cats/
│   └── fantasy/
└── animations/
    ├── sparkles.png
    └── aura_gold.png
```

**Catalogue MVP minimum (Phase 8) :**
- 5 vêtements
- 3 accessoires
- 3 pets
- 3 thèmes de carte

---

**✅ ARCHITECTURE COMPLÈTEMENT VALIDÉE - PRÊTE POUR DÉVELOPPEMENT**

---

---

## 12. Évolutions futures (post-MVP)

- Import/export de catalogues de cosmétiques
- Marketplace communautaire de cosmétiques
- Système de quêtes (enchaînement de tâches)
- Défis entre enfants (compétition amicale)
- Graphiques de progression (historique)
- Intégration avec d'autres intégrations HA (ex: limiter temps d'écran via router)
- Mode hors ligne (PWA)
- Application mobile dédiée

---

## 13. Conclusion

Cette architecture modulaire et réutilisable permet de construire progressivement le système de gestion de tâches/habitudes. La séparation claire des responsabilités entre backend (logique métier) et frontend (affichage) facilite le travail en équipe et l'évolution future du projet.

Les agents doivent se référer à ce document en permanence et ne pas hésiter à demander des clarifications à l'architecte avant de coder.

**Principe clé : Coder moins, réutiliser plus. Chaque composant doit pouvoir servir à plusieurs endroits.**

---

**Document vivant - Dernière mise à jour : 2025-11-04**
