# 🧪 Script de test de l'intégration Habits Manager

## Test complet pas-à-pas

Copiez-collez ces services dans **Outils de développement > Services** de Home Assistant.

### 1. Créer un enfant de test

```yaml
service: habits_manager.create_child
data:
  name: "Alice"
  person_entity: "person.alice"
```

**Logs attendus :**
```
[habits_manager] Service call: Child created - Alice with 12 sensors
[habits_manager] Dynamically created 8 sensors for child <id>
```

**Vérification :** Allez dans **Paramètres > Entités** et cherchez `habits_manager`. Vous devriez voir 8 sensors.

---

### 2. Créer une tâche quotidienne

```yaml
service: habits_manager.create_task
data:
  title: "Ranger sa chambre"
  description: "Mettre les jouets dans le coffre et faire son lit"
  task_type: "mandatory"
  frequency: "daily"
  assigned_to:
    - "<child_id>"  # Remplacer par l'ID réel de l'enfant créé
  rewards:
    points: 10
    coins: 5
    experience: 15
  icon: "mdi:home-clean"
  color: "#4CAF50"
```

**Logs attendus :**
```
[habits_manager] Service call: Task created - Ranger sa chambre
[habits_manager] Generated 1 task instances for today
```

**Vérification :**
- Le sensor `sensor.habits_manager_<child_id>_tasks_pending` devrait afficher **1**
- Vérifiez le fichier `.storage/habits_manager/tasks.json` et `task_instances.json`

---

### 3. Créer une habitude

```yaml
service: habits_manager.create_habit
data:
  title: "Brosser les dents"
  description: "Matin et soir"
  frequency: "daily"
  assigned_to:
    - "<child_id>"
  rewards:
    points: 5
    coins: 2
    experience: 10
  streak_bonus:
    points: 2
    coins: 1
    experience: 5
  icon: "mdi:tooth"
  color: "#03A9F4"
```

**Logs attendus :**
```
[habits_manager] Service call: Habit created - Brosser les dents
```

---

### 4. Marquer une tâche comme complétée

**Étape 1 :** Récupérer l'ID de l'instance de tâche

Allez dans **Outils de développement > États** et cherchez :
- `sensor.habits_manager_<child_id>_tasks_pending`

Ou vérifiez le fichier `.storage/habits_manager/task_instances.json`

**Étape 2 :** Marquer comme complétée

```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "<task_instance_id>"  # ID de l'instance
  child_id: "<child_id>"
```

**Logs attendus :**
```
[habits_manager] Service call: Task completed - instance <id> (pending=0, waiting=1)
```

**Vérification :**
- `sensor.habits_manager_<child_id>_tasks_pending` → devrait passer à **0**
- `sensor.habits_manager_<child_id>_tasks_waiting` → devrait passer à **1**
- `binary_sensor.habits_manager_<child_id>_has_pending_validation` → devrait passer à **ON**

---

### 5. Valider la tâche (parent)

```yaml
service: habits_manager.validate_task
data:
  instance_id: "<task_instance_id>"
  validator_id: "parent_alice"
  note: "Très bien rangé !"
```

**Logs attendus :**
```
[habits_manager] Service call: Task validated - <instance_id> by parent_alice
```

**Vérification :**
- `sensor.habits_manager_<child_id>_tasks_waiting` → devrait repasser à **0**
- `sensor.habits_manager_<child_id>_points` → devrait augmenter de **10**
- `sensor.habits_manager_<child_id>_coins` → devrait augmenter de **5**
- `sensor.habits_manager_<child_id>_experience` → devrait augmenter de **15**

---

### 6. Compléter une habitude

```yaml
service: habits_manager.complete_habit
data:
  habit_id: "<habit_id>"  # ID de l'habitude créée
  child_id: "<child_id>"
```

**Logs attendus :**
```
[habits_manager] Service call: Habit completed - <habit_id> by child <child_id>, streak=1, longest=1
```

**Vérification :**
- `sensor.habits_manager_<child_id>_longest_streak` → devrait passer à **1**
- Points/coins/XP augmentent

---

### 7. Créer une récompense

```yaml
service: habits_manager.create_reward
data:
  title: "30 minutes de jeu vidéo"
  description: "30 minutes supplémentaires de temps d'écran"
  reward_type: "screen_time"
  cost_points: 50
  cost_coins: 0
  icon: "mdi:gamepad-variant"
  color: "#FF5722"
```

**Logs attendus :**
```
[habits_manager] Service call: Reward created - 30 minutes de jeu vidéo
```

---

### 8. Réclamer une récompense

```yaml
service: habits_manager.claim_reward
data:
  reward_id: "<reward_id>"
  child_id: "<child_id>"
```

**Logs attendus :**
```
[habits_manager] Service call: Reward claimed - <reward_id> by <child_id>
```

**Vérification :**
- Points/coins sont déduits
- Une réclamation est créée dans `.storage/habits_manager/reward_claims.json`

---

### 9. Approuver la réclamation

```yaml
service: habits_manager.approve_claim
data:
  claim_id: "<claim_id>"  # Trouvé dans reward_claims.json
  approver_id: "parent_alice"
```

**Logs attendus :**
```
[habits_manager] Service call: Claim approved - <claim_id> by parent_alice
```

---

## Résumé du flux complet

```
1. Créer enfant → 8 sensors créés
2. Créer tâche → tasks_pending +1
3. Marquer complétée → tasks_waiting +1, tasks_pending -1
4. Valider → tasks_waiting -1, points/coins/xp +N
5. Créer habitude → habitude disponible
6. Compléter habitude → streak +1, points/coins/xp +N
7. Créer récompense → récompense disponible
8. Réclamer → points/coins -N, réclamation créée
9. Approuver → réclamation approuvée
```

## Fichiers à surveiller

### Stockage
```bash
ls -la .storage/habits_manager/
```

Fichiers attendus :
- `children.json` - Liste des enfants
- `tasks.json` - Définitions des tâches
- `task_instances.json` - Instances quotidiennes
- `habits.json` - Définitions des habitudes
- `habit_streaks.json` - Streaks des habitudes
- `rewards.json` - Récompenses disponibles
- `reward_claims.json` - Réclamations de récompenses
- `cosmetics.json` - Cosmétiques (vide si pas créés)

### Logs

```bash
# Logs en temps réel
tail -f /config/home-assistant.log | grep habits_manager

# Derniers 100 logs
tail -100 /config/home-assistant.log | grep habits_manager

# Filtrer par type
tail -100 /config/home-assistant.log | grep "Service call"
```

## Sensors à surveiller

Pour chaque enfant créé, vérifiez ces sensors dans **Outils de dev > États** :

| Sensor | Valeur initiale | Après tests |
|--------|-----------------|-------------|
| `sensor.habits_manager_<id>_points` | 0 | Augmente après validation |
| `sensor.habits_manager_<id>_coins` | 0 | Augmente après validation |
| `sensor.habits_manager_<id>_level` | 1 | Augmente avec l'XP |
| `sensor.habits_manager_<id>_experience` | 0 | Augmente après validation |
| `sensor.habits_manager_<id>_tasks_pending` | 0 | 1 après création de tâche |
| `sensor.habits_manager_<id>_tasks_waiting` | 0 | 1 après mark_completed |
| `sensor.habits_manager_<id>_longest_streak` | 0 | 1 après habitude |
| `binary_sensor.habits_manager_<id>_has_pending_validation` | OFF | ON après mark_completed |

## Commande de diagnostic complète

```bash
# Vérifier tout
python3 verify_sources.py

# Vérifier les sensors dans HA (si CLI disponible)
ha state list | grep habits_manager

# Vérifier les fichiers de stockage
cat .storage/habits_manager/children.json | jq .
cat .storage/habits_manager/tasks.json | jq .
cat .storage/habits_manager/task_instances.json | jq .

# Vérifier les logs récents
tail -50 /config/home-assistant.log | grep habits_manager
```

---

**🎯 Objectif :** À la fin de ces tests, vous devriez avoir :
- ✅ 1 enfant créé avec 8 sensors fonctionnels
- ✅ 1 tâche créée et validée
- ✅ 1 habitude complétée
- ✅ 1 récompense réclamée et approuvée
- ✅ Des logs détaillés de toutes les opérations
- ✅ Des fichiers de stockage remplis

Si tout fonctionne, vous êtes **sur les bonnes sources** ! 🎉
