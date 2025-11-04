# Phase 1 : Backend Core - Lancement

> **Date de lancement :** 2025-11-04
> **Agent responsable :** Agent Backend Developer
> **Architecte :** Agent Architecte
> **Statut :** 🚀 PRÊT À DÉMARRER

---

## 🎯 Objectifs de la Phase 1

Créer l'infrastructure backend complète et fonctionnelle du gestionnaire de tâches/habitudes.

### Livrables attendus

✅ **Infrastructure de base**
- Intégration Home Assistant fonctionnelle
- Structure de fichiers complète
- Constantes et modèles de données

✅ **Stockage**
- Système de stockage JSON opérationnel
- Gestion des entités Home Assistant
- Persistance des données

✅ **Managers métier**
- ChildManager (CRUD enfants)
- TaskManager (CRUD tâches + génération instances)
- HabitManager (CRUD habitudes)

✅ **Services calculateurs**
- PointsCalculator (calculs points/pièces/XP)
- StreakCalculator (calculs streaks)
- LevelCalculator (système de niveaux)

✅ **Services Home Assistant**
- Tous les services exposés et fonctionnels
- Entités sensor créées pour chaque enfant
- Événements HA émis correctement

---

## 📋 Checklist détaillée

### Étape 1 : Setup initial (30 min)

- [ ] Créer la structure de dossiers `custom_components/habits_manager/`
- [ ] Créer tous les sous-dossiers : `core/`, `storage/`, `managers/`, `services/`
- [ ] Créer tous les fichiers `__init__.py`
- [ ] Créer `manifest.json` avec métadonnées HA
- [ ] Créer `const.py` avec toutes les constantes

**Test** : Vérifier que la structure est conforme à l'architecture

---

### Étape 2 : Modèles de données (1h)

- [ ] Implémenter `core/models.py` avec TOUTES les dataclasses :
  - `Child` + `Avatar` + `AvatarCustomization`
  - `Task` + `TaskSchedule` + `TaskRewards` + `TaskPenalties`
  - `TaskInstance`
  - `Habit` + `HabitRewards` + `StreakBonus`
  - `HabitStreak` + `StreakHistoryEntry`
  - Tous les Enums (TaskType, ScheduleType, etc.)

- [ ] Implémenter `core/exceptions.py` :
  ```python
  class HabitsManagerError(Exception):
      """Base exception"""

  class ChildNotFoundError(HabitsManagerError):
      """Child not found"""

  class TaskNotFoundError(HabitsManagerError):
      """Task not found"""

  class InsufficientPointsError(HabitsManagerError):
      """Not enough points"""

  class ValidationError(HabitsManagerError):
      """Validation failed"""
  ```

- [ ] Implémenter `core/validators.py` avec fonctions de validation :
  - `validate_child_data(data: dict) -> bool`
  - `validate_task_data(data: dict) -> bool`
  - `validate_habit_data(data: dict) -> bool`

**Test** : Instancier chaque dataclass, vérifier la méthode `to_dict()`

**Documents de référence** : `DATAMODELS.md` section Python

---

### Étape 3 : Stockage (1h30)

#### storage_manager.py

- [ ] Implémenter `StorageManager` :
  ```python
  class StorageManager:
      def __init__(self, hass, base_path: str):
          self.hass = hass
          self.base_path = base_path

      async def load_json(self, filename: str) -> dict:
          """Charge un fichier JSON"""

      async def save_json(self, filename: str, data: dict) -> None:
          """Sauvegarde un fichier JSON"""

      async def ensure_storage_dir(self) -> None:
          """Crée le dossier .storage/habits_manager/ si inexistant"""

      # Méthodes spécifiques
      async def load_children(self) -> List[Child]:
      async def save_child(self, child: Child) -> None:
      async def delete_child(self, child_id: str) -> None:

      async def load_tasks(self) -> List[Task]:
      async def save_task(self, task: Task) -> None:
      async def delete_task(self, task_id: str) -> None:

      async def load_habits(self) -> List[Habit]:
      async def save_habit(self, habit: Habit) -> None:
      async def delete_habit(self, habit_id: str) -> None
  ```

- [ ] Gestion des fichiers JSON :
  - `children.json`
  - `tasks.json`
  - `habits.json`
  - `task_instances.json`
  - `habit_streaks.json`

- [ ] Gestion des erreurs (fichier manquant, JSON invalide)

#### entity_manager.py

- [ ] Implémenter `EntityManager` :
  ```python
  class EntityManager:
      def __init__(self, hass):
          self.hass = hass

      async def create_child_entities(self, child: Child) -> None:
          """Crée toutes les entités pour un enfant"""
          # sensor.habits_child_XXX_points
          # sensor.habits_child_XXX_coins
          # sensor.habits_child_XXX_level
          # sensor.habits_child_XXX_xp
          # sensor.habits_child_XXX_tasks_pending
          # sensor.habits_child_XXX_tasks_waiting
          # sensor.habits_child_XXX_longest_streak
          # binary_sensor.habits_child_XXX_has_pending_validation

      async def update_child_entities(self, child: Child) -> None:
          """Met à jour les entités d'un enfant"""

      async def delete_child_entities(self, child_id: str) -> None:
          """Supprime les entités d'un enfant"""
  ```

**Test** : Créer un enfant de test, vérifier que les entités apparaissent dans HA

**Documents de référence** : `architecture.md` section 4.5 (Entités HA)

---

### Étape 4 : Services calculateurs (2h)

#### points_calculator.py

- [ ] Implémenter `PointsCalculator` :
  ```python
  class PointsCalculator:
      @staticmethod
      def calculate_task_rewards(task: Task) -> dict:
          """Calcule les récompenses d'une tâche"""
          return {
              "points": task.rewards.points,
              "coins": task.rewards.coins,
              "experience": task.rewards.experience
          }

      @staticmethod
      def calculate_habit_rewards(habit: Habit, streak: int) -> dict:
          """Calcule les récompenses d'une habitude avec bonus streak"""
          base_points = habit.rewards.points
          base_coins = habit.rewards.coins
          base_xp = habit.rewards.experience

          if habit.rewards.streak_bonus.enabled:
              if habit.rewards.streak_bonus.type == StreakBonusType.PROGRESSIVE:
                  multiplier = 1 + (streak * habit.rewards.streak_bonus.multiplier)
                  return {
                      "points": int(base_points * multiplier),
                      "coins": int(base_coins * multiplier),
                      "experience": int(base_xp * multiplier)
                  }

          return {"points": base_points, "coins": base_coins, "experience": base_xp}

      @staticmethod
      def apply_rewards(child: Child, rewards: dict) -> Child:
          """Applique les récompenses à un enfant"""
          child.points += rewards["points"]
          child.coins += rewards["coins"]
          child.experience += rewards["experience"]
          return child

      @staticmethod
      def apply_penalties(child: Child, penalties: dict) -> Child:
          """Applique les pénalités (ne descend pas en dessous de 0)"""
          child.points = max(0, child.points + penalties["points"])
          child.coins = max(0, child.coins + penalties["coins"])
          return child
  ```

#### streak_calculator.py

- [ ] Implémenter `StreakCalculator` :
  ```python
  class StreakCalculator:
      @staticmethod
      def update_streak(habit_streak: HabitStreak, date: datetime.date) -> HabitStreak:
          """Met à jour le streak après complétion d'habitude"""
          if habit_streak.last_completed is None:
              habit_streak.current_streak = 1
              habit_streak.last_completed = date
          else:
              days_diff = (date - habit_streak.last_completed).days
              if days_diff == 1:  # Jour consécutif
                  habit_streak.current_streak += 1
              elif days_diff > 1:  # Streak cassé
                  habit_streak.current_streak = 1
              # Si days_diff == 0 : complété le même jour, ne rien faire

              habit_streak.last_completed = date

          # Mettre à jour le record
          if habit_streak.current_streak > habit_streak.longest_streak:
              habit_streak.longest_streak = habit_streak.current_streak

          habit_streak.total_completions += 1
          return habit_streak

      @staticmethod
      def check_streak_broken(habit_streak: HabitStreak, habit: Habit, today: datetime.date) -> bool:
          """Vérifie si un streak est cassé (habitude non faite hier)"""
          if habit_streak.last_completed is None:
              return False

          days_diff = (today - habit_streak.last_completed).days

          if habit.frequency == HabitFrequency.DAILY:
              return days_diff > 1
          elif habit.frequency == HabitFrequency.WEEKLY:
              return days_diff > 7
          elif habit.frequency == HabitFrequency.MONTHLY:
              return days_diff > 30

          return False

      @staticmethod
      def reset_streak(habit_streak: HabitStreak) -> HabitStreak:
          """Reset le streak à 0"""
          habit_streak.current_streak = 0
          return habit_streak
  ```

#### level_calculator.py

- [ ] Implémenter `LevelCalculator` :
  ```python
  class LevelCalculator:
      BASE_XP = 100
      MULTIPLIER = 1.2

      @staticmethod
      def calculate_xp_for_level(level: int) -> int:
          """Calcule l'XP nécessaire pour atteindre un niveau"""
          return int(LevelCalculator.BASE_XP * (LevelCalculator.MULTIPLIER ** (level - 1)))

      @staticmethod
      def add_experience(child: Child, xp: int) -> tuple[Child, bool]:
          """Ajoute de l'XP et gère les level-ups

          Returns:
              (child, leveled_up)
          """
          child.experience += xp
          leveled_up = False

          while child.experience >= child.experience_to_next_level:
              child.experience -= child.experience_to_next_level
              child.level += 1
              leveled_up = True
              child.experience_to_next_level = LevelCalculator.calculate_xp_for_level(child.level + 1)

          return child, leveled_up
  ```

**Test** : Tester chaque calculateur avec des données fictives

---

### Étape 5 : Managers métier (3h)

#### child_manager.py

- [ ] Implémenter `ChildManager` :
  ```python
  class ChildManager:
      def __init__(self, storage: StorageManager, entity_mgr: EntityManager):
          self.storage = storage
          self.entity_mgr = entity_mgr

      async def create_child(self, name: str, person_entity: str) -> Child:
          """Crée un nouvel enfant"""
          # Générer ID unique
          # Créer Child avec valeurs par défaut
          # Récupérer photo depuis person_entity
          # Sauvegarder
          # Créer entités HA

      async def get_child(self, child_id: str) -> Child:
          """Récupère un enfant par ID"""

      async def get_all_children(self) -> List[Child]:
          """Récupère tous les enfants"""

      async def update_child(self, child: Child) -> Child:
          """Met à jour un enfant"""

      async def delete_child(self, child_id: str) -> None:
          """Supprime un enfant"""

      async def update_points(self, child_id: str, points: int, coins: int, xp: int) -> Child:
          """Met à jour points/pièces/XP"""

      async def add_badge(self, child_id: str, badge_id: str) -> Child:
          """Ajoute un badge à un enfant"""

      async def purchase_cosmetic(self, child_id: str, cosmetic_id: str, cost: int) -> Child:
          """Achète un cosmétique"""

      async def get_child_stats(self, child_id: str) -> dict:
          """Récupère les statistiques d'un enfant"""
  ```

#### task_manager.py

- [ ] Implémenter `TaskManager` :
  ```python
  class TaskManager:
      def __init__(self, storage: StorageManager):
          self.storage = storage

      async def create_task(self, task_data: dict) -> Task:
          """Crée une nouvelle tâche"""

      async def get_task(self, task_id: str) -> Task:
          """Récupère une tâche"""

      async def get_all_tasks(self) -> List[Task]:
          """Récupère toutes les tâches"""

      async def update_task(self, task: Task) -> Task:
          """Met à jour une tâche"""

      async def delete_task(self, task_id: str) -> None:
          """Supprime une tâche"""

      async def generate_task_instances(self, date: datetime.date) -> List[TaskInstance]:
          """Génère les instances de tâches pour une date donnée"""
          # Pour chaque tâche active
          # Vérifier si elle doit être générée ce jour (selon schedule)
          # Pour chaque enfant assigné, créer une TaskInstance

      async def get_instances_for_child(self, child_id: str, date: datetime.date) -> List[TaskInstance]:
          """Récupère les instances de tâches d'un enfant pour une date"""

      async def mark_completed(self, instance_id: str) -> TaskInstance:
          """Marque une instance comme complétée (en attente de validation)"""

      async def check_failed_tasks(self) -> List[TaskInstance]:
          """Vérifie les tâches échouées (heure limite dépassée)"""
  ```

#### habit_manager.py

- [ ] Implémenter `HabitManager` :
  ```python
  class HabitManager:
      def __init__(self, storage: StorageManager, streak_calc: StreakCalculator):
          self.storage = storage
          self.streak_calc = streak_calc

      async def create_habit(self, habit_data: dict) -> Habit:
          """Crée une nouvelle habitude"""

      async def get_habit(self, habit_id: str) -> Habit:
          """Récupère une habitude"""

      async def get_all_habits(self) -> List[Habit]:
          """Récupère toutes les habitudes"""

      async def update_habit(self, habit: Habit) -> Habit:
          """Met à jour une habitude"""

      async def delete_habit(self, habit_id: str) -> None:
          """Supprime une habitude"""

      async def record_completion(self, habit_id: str, child_id: str, date: datetime.date) -> HabitStreak:
          """Enregistre la complétion d'une habitude"""

      async def get_streak(self, habit_id: str, child_id: str) -> HabitStreak:
          """Récupère le streak d'une habitude pour un enfant"""

      async def calculate_streak_bonus(self, habit_id: str, child_id: str) -> dict:
          """Calcule les récompenses avec bonus de streak"""

      async def check_streak_breaks(self) -> List[tuple[HabitStreak, Habit]]:
          """Vérifie les streaks cassés (à appeler quotidiennement)"""
  ```

**Test** : Tester chaque manager avec des opérations CRUD

---

### Étape 6 : Services Home Assistant (2h)

#### __init__.py

- [ ] Implémenter l'initialisation de l'intégration :
  ```python
  from homeassistant.core import HomeAssistant
  from homeassistant.config_entries import ConfigEntry

  from .const import DOMAIN
  from .storage.storage_manager import StorageManager
  from .storage.entity_manager import EntityManager
  from .managers.child_manager import ChildManager
  from .managers.task_manager import TaskManager
  from .managers.habit_manager import HabitManager
  from .services.points_calculator import PointsCalculator
  from .services.streak_calculator import StreakCalculator
  from .services.level_calculator import LevelCalculator

  _LOGGER = logging.getLogger(__name__)

  async def async_setup(hass: HomeAssistant, config: dict) -> bool:
      """Setup de l'intégration"""

      # Initialiser le stockage
      storage = StorageManager(hass, ".storage/habits_manager")
      await storage.ensure_storage_dir()

      # Initialiser les managers
      entity_mgr = EntityManager(hass)
      child_mgr = ChildManager(storage, entity_mgr)
      task_mgr = TaskManager(storage)
      habit_mgr = HabitManager(storage, StreakCalculator())

      # Stocker dans hass.data
      hass.data[DOMAIN] = {
          "storage": storage,
          "child_manager": child_mgr,
          "task_manager": task_mgr,
          "habit_manager": habit_mgr,
          "points_calculator": PointsCalculator(),
          "level_calculator": LevelCalculator(),
      }

      # Enregistrer les services
      await register_services(hass)

      # Charger les enfants et créer les entités
      children = await child_mgr.get_all_children()
      for child in children:
          await entity_mgr.create_child_entities(child)

      _LOGGER.info("Habits Manager initialized")
      return True

  async def register_services(hass: HomeAssistant):
      """Enregistre tous les services HA"""

      async def handle_create_child(call):
          """Gère le service create_child"""
          child_mgr = hass.data[DOMAIN]["child_manager"]
          name = call.data["name"]
          person_entity = call.data["person_entity"]
          child = await child_mgr.create_child(name, person_entity)
          hass.bus.fire(f"{DOMAIN}_update", {
              "update_type": "child_created",
              "child_id": child.id
          })

      # Enregistrer TOUS les services définis dans architecture.md section 4.3
      hass.services.async_register(DOMAIN, "create_child", handle_create_child)
      hass.services.async_register(DOMAIN, "update_child", handle_update_child)
      hass.services.async_register(DOMAIN, "delete_child", handle_delete_child)
      hass.services.async_register(DOMAIN, "create_task", handle_create_task)
      hass.services.async_register(DOMAIN, "update_task", handle_update_task)
      hass.services.async_register(DOMAIN, "delete_task", handle_delete_task)
      hass.services.async_register(DOMAIN, "mark_task_completed", handle_mark_task_completed)
      hass.services.async_register(DOMAIN, "create_habit", handle_create_habit)
      hass.services.async_register(DOMAIN, "update_habit", handle_update_habit)
      hass.services.async_register(DOMAIN, "delete_habit", handle_delete_habit)
      hass.services.async_register(DOMAIN, "complete_habit", handle_complete_habit)

      _LOGGER.info("Services registered")
  ```

- [ ] Implémenter TOUS les handlers de services
- [ ] Chaque handler doit :
  - Valider les données d'entrée
  - Appeler le manager approprié
  - Émettre un événement HA
  - Gérer les erreurs

#### sensor.py

- [ ] Implémenter les entités sensor :
  ```python
  from homeassistant.components.sensor import SensorEntity
  from homeassistant.core import HomeAssistant

  class HabitsChildPointsSensor(SensorEntity):
      """Sensor pour les points d'un enfant"""

      def __init__(self, child: Child):
          self._child = child
          self._attr_name = f"Habits {child.name} Points"
          self._attr_unique_id = f"habits_child_{child.id}_points"

      @property
      def state(self):
          return self._child.points

      @property
      def icon(self):
          return "mdi:star"

  # Créer une classe pour chaque type de sensor :
  # - Points
  # - Coins
  # - Level
  # - XP
  # - Tasks pending
  # - Tasks waiting
  # - Longest streak
  ```

**Test** : Appeler chaque service via Developer Tools → Services dans HA

**Documents de référence** : `architecture.md` section 4.3 (Services HA)

---

### Étape 7 : Tests et validation (1h)

- [ ] **Test 1 : Créer un enfant**
  ```yaml
  service: habits_manager.create_child
  data:
    name: "Emma Test"
    person_entity: "person.emma"
  ```
  - Vérifier que `children.json` est créé
  - Vérifier que les entités sensor apparaissent dans HA

- [ ] **Test 2 : Créer une tâche**
  ```yaml
  service: habits_manager.create_task
  data:
    title: "Ranger sa chambre"
    description: "Test"
    type: "mandatory"
    assigned_to: ["child_id"]
    schedule:
      type: "daily"
      time: "18:00"
    rewards:
      points: 10
      coins: 5
      experience: 20
    penalties:
      points: -5
      coins: 0
    icon: "mdi:broom"
    color: "#4CAF50"
    difficulty: 2
    estimated_duration: 15
    category: "chores"
  ```
  - Vérifier que `tasks.json` est créé
  - Vérifier que la tâche est bien sauvegardée

- [ ] **Test 3 : Créer une habitude**
  ```yaml
  service: habits_manager.create_habit
  data:
    title: "Lire 15 minutes"
    description: "Test"
    icon: "mdi:book"
    color: "#2196F3"
    frequency: "daily"
    rewards:
      points: 5
      coins: 2
      experience: 10
      streak_bonus:
        enabled: true
        type: "progressive"
        multiplier: 0.1
    assigned_to: ["child_id"]
  ```

- [ ] **Test 4 : Compléter une habitude**
  ```yaml
  service: habits_manager.complete_habit
  data:
    habit_id: "habit_001"
    child_id: "child_001"
  ```
  - Vérifier que le streak augmente
  - Vérifier que les points/pièces/XP sont attribués
  - Vérifier que les entités sensor sont mises à jour

- [ ] **Test 5 : Vérifier les entités**
  - Developer Tools → States
  - Vérifier que toutes les entités sensor existent
  - Vérifier que leurs valeurs sont correctes

- [ ] **Test 6 : Vérifier les événements**
  - Developer Tools → Events
  - Écouter `habits_manager_update`
  - Effectuer des actions et vérifier que les événements sont émis

---

## 📊 Critères de validation

Avant de soumettre à QA, vérifier que :

- [ ] ✅ Tous les fichiers créés selon l'architecture
- [ ] ✅ Code respecte PEP 8 (utiliser `flake8` si possible)
- [ ] ✅ Type hints partout
- [ ] ✅ Docstrings Google-style pour toutes les classes/méthodes
- [ ] ✅ Gestion des erreurs avec try/except
- [ ] ✅ Logging via `_LOGGER` (debug, info, error)
- [ ] ✅ Tous les services HA enregistrés et testés
- [ ] ✅ Entités sensor créées pour chaque enfant
- [ ] ✅ Événements HA émis correctement
- [ ] ✅ Stockage JSON fonctionne (lecture/écriture)
- [ ] ✅ Les 6 tests manuels passent
- [ ] ✅ Aucun crash ou erreur dans les logs HA

---

## 🔍 Points de vigilance

### Erreurs courantes à éviter

1. **Oublier les imports** : Toujours importer depuis `typing`, `datetime`, `enum`
2. **Oublier `async/await`** : Toutes les I/O doivent être async
3. **Ne pas gérer les erreurs** : Toujours utiliser try/except pour I/O
4. **Ne pas logger** : Logger toutes les opérations importantes
5. **Ne pas valider les données** : Utiliser `validators.py` avant de créer des objets
6. **Oublier de mettre à jour `updated_at`** : Mettre à jour ce champ à chaque modification
7. **Ne pas émettre d'événements HA** : Émettre un événement après chaque action importante

### Demander à l'architecte si

- ❓ Tu ne comprends pas un modèle de données
- ❓ Tu hésites sur la structure d'un manager
- ❓ Tu ne sais pas comment implémenter une fonctionnalité
- ❓ Tu détectes une incohérence dans l'architecture
- ❓ Tu veux proposer une amélioration

**Ne JAMAIS deviner !** Mieux vaut demander et être sûr.

---

## 📚 Documents de référence

**À lire AVANT de commencer :**
- `architecture.md` - Section 4 (Architecture Backend)
- `DATAMODELS.md` - Tous les modèles Python
- `const.py` - À créer avec les constantes de DATAMODELS.md

**À consulter pendant le développement :**
- `AGENTS.md` - Ton prompt et tes responsabilités
- `ADR.md` - Décisions architecturales validées
- Home Assistant Dev Docs : https://developers.home-assistant.io/

---

## ⏱️ Estimation de temps

| Étape | Temps estimé |
|-------|--------------|
| Setup initial | 30 min |
| Modèles de données | 1h |
| Stockage | 1h30 |
| Services calculateurs | 2h |
| Managers métier | 3h |
| Services HA | 2h |
| Tests et validation | 1h |
| **TOTAL** | **~11h** |

---

## 🚀 Prêt à démarrer ?

Checklist avant de commencer :
- [ ] J'ai lu `architecture.md` section 4
- [ ] J'ai lu `DATAMODELS.md` en entier
- [ ] J'ai lu mon prompt dans `AGENTS.md`
- [ ] J'ai compris les 7 étapes ci-dessus
- [ ] J'ai Home Assistant de test disponible
- [ ] Je sais comment contacter l'architecte si besoin

**Si toutes les cases sont cochées : GO ! 🎯**

---

## 📞 Communication

**Pendant la Phase 1 :**
- Signaler à l'architecte quand chaque étape est complétée
- Demander validation si doute
- Signaler tout problème immédiatement

**À la fin de la Phase 1 :**
- Soumettre à agent-qa-reviewer
- Fournir les résultats des 6 tests manuels
- Attendre validation avant de passer à Phase 2

---

**Bon développement ! 💪**

---

**Document vivant - Dernière mise à jour : 2025-11-04**
