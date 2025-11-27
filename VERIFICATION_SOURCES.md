# 🔍 Guide de vérification des sources Habits Manager

## Problème identifié

**Aucun enfant créé** → Aucun sensor généré → Pas de logs d'activité

## Solution

### Étape 1 : Créer un enfant de test

Dans Home Assistant, allez dans **Outils de développement > Services** et utilisez :

```yaml
service: habits_manager.create_child
data:
  name: "TestChild"
  person_entity: "person.test"  # Ou une entité person existante
```

Cela devrait générer des logs comme :
```
[habits_manager] Service call: Child created - TestChild with 12 sensors
[habits_manager] Created 8 sensor entities for 1 children
```

### Étape 2 : Vérifier que les sensors sont créés

#### Option A : Via l'interface

1. **Paramètres** > **Appareils et services** > **Entités**
2. Rechercher `habits_manager`
3. Vous devriez voir **8 sensors** :

| Sensor | Description | ID |
|--------|-------------|-----|
| Points | Points de l'enfant | `sensor.habits_manager_{id}_points` |
| Coins | Pièces de l'enfant | `sensor.habits_manager_{id}_coins` |
| Level | Niveau | `sensor.habits_manager_{id}_level` |
| Experience | XP | `sensor.habits_manager_{id}_experience` |
| Tasks Pending | Tâches en attente | `sensor.habits_manager_{id}_tasks_pending` |
| Tasks Waiting | Tâches à valider | `sensor.habits_manager_{id}_tasks_waiting` |
| Longest Streak | Plus long streak | `sensor.habits_manager_{id}_longest_streak` |
| Has Pending Validation | A des validations en attente (binary) | `binary_sensor.habits_manager_{id}_has_pending_validation` |

#### Option B : Via les Outils de développement

1. **Outils de développement** > **États**
2. Filtrer par `habits_manager`
3. Vérifier l'état de chaque sensor

### Étape 3 : Activer les logs détaillés

Ajoutez ceci dans votre `configuration.yaml` :

```yaml
logger:
  default: info
  logs:
    custom_components.habits_manager: debug
```

Puis **redémarrez Home Assistant**.

### Étape 4 : Générer de l'activité pour voir les logs

#### Créer une tâche

```yaml
service: habits_manager.create_task
data:
  title: "Tâche de test"
  description: "Une tâche pour tester les logs"
  task_type: "mandatory"
  frequency: "daily"
  assigned_to:
    - "test_child_id"  # Remplacer par l'ID réel de votre enfant
  rewards:
    points: 10
    coins: 5
    experience: 15
  icon: "mdi:check"
  color: "#4CAF50"
```

Logs attendus :
```
[habits_manager] Service call: Task created - Tâche de test
[habits_manager] Generated 1 task instances for today
```

#### Marquer une tâche comme complétée

```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "task_instance_id"  # ID de l'instance générée
  child_id: "test_child_id"
```

Logs attendus :
```
[habits_manager] Service call: Task completed - instance {id} (pending=0, waiting=1)
```

#### Valider une tâche

```yaml
service: habits_manager.validate_task
data:
  instance_id: "task_instance_id"
  validator_id: "admin"
  note: "Bien fait !"
```

Logs attendus :
```
[habits_manager] Service call: Task validated - {instance_id} by admin
```

## Où consulter les logs

### Dans l'interface Home Assistant

1. **Paramètres** > **Système** > **Journaux**
2. Filtrer par `habits_manager`

### Fichier de logs

Le fichier est situé dans votre répertoire Home Assistant :
```
/config/home-assistant.log
```

Pour le consulter en temps réel :
```bash
tail -f /config/home-assistant.log | grep habits_manager
```

## Script de vérification automatique

Utilisez le script fourni pour vérifier l'état actuel :

```bash
python3 verify_sources.py
```

Ce script vérifie :
- ✅ Répertoire de stockage
- ✅ Enfants créés
- ✅ Sensors attendus par enfant
- ✅ Tâches et instances
- ✅ Habitudes et streaks

## Logs importants à surveiller

### Au démarrage de Home Assistant

```
[habits_manager] Setting up Habits Manager integration
[habits_manager] Loaded X children
[habits_manager] Registered 18 services for habits_manager
[habits_manager] Created Y sensor entities for X children
[habits_manager] Habits Manager integration setup complete
```

### Lors de la création d'un enfant

```
[habits_manager] Service call: Child created - {name} with 12 sensors
[habits_manager] Dynamically created 8 sensors for child {id}
```

### Lors de l'activité

```
[habits_manager] Service call: Task created - {title}
[habits_manager] Generated {n} task instances for today
[habits_manager] Service call: Task completed - instance {id}
[habits_manager] Service call: Task validated - {id} by {validator}
[habits_manager] Service call: Habit completed - {id} by child {id}, streak={n}
```

## Niveaux de logs disponibles

### INFO (par défaut)
Affiche les opérations principales (création, validation, etc.)

### DEBUG (recommandé pour diagnostic)
Affiche tous les détails des opérations

```yaml
logger:
  logs:
    custom_components.habits_manager: debug
```

### DEBUG détaillé par module (optionnel)

```yaml
logger:
  logs:
    custom_components.habits_manager: debug
    custom_components.habits_manager.storage: debug
    custom_components.habits_manager.managers: debug
    custom_components.habits_manager.sensor: debug
    custom_components.habits_manager.services: debug
```

## Résolution de problèmes

### Pas de logs du tout

1. ✅ Vérifier que l'intégration est bien chargée
2. ✅ Vérifier la configuration logger
3. ✅ Redémarrer Home Assistant après modification
4. ✅ Créer au moins un enfant

### Sensors non visibles

1. ✅ Créer un enfant avec `create_child`
2. ✅ Rafraîchir la page des entités
3. ✅ Vérifier dans **Outils de dev > États**

### Sensors ne se mettent pas à jour

1. ✅ Vérifier que les événements sont bien émis (logs)
2. ✅ Vérifier le fichier de stockage `.storage/habits_manager/children.json`
3. ✅ Redémarrer Home Assistant

## Commandes utiles

### Vérifier l'état des sensors

Depuis Home Assistant CLI ou SSH :

```bash
# Lister tous les sensors habits_manager
ha state list | grep habits_manager

# Voir l'état d'un sensor spécifique
ha state get sensor.habits_manager_test_child_points
```

### Vérifier les fichiers de stockage

```bash
# Lister les fichiers
ls -la .storage/habits_manager/

# Voir le contenu (JSON formaté)
cat .storage/habits_manager/children.json | jq .
cat .storage/habits_manager/tasks.json | jq .
```

## Commande rapide de diagnostic

```bash
# Vérifier tout en une commande
python3 verify_sources.py && \
  echo "--- Logs récents ---" && \
  tail -50 /config/home-assistant.log | grep habits_manager
```

---

**Note** : Si vous ne voyez toujours aucun log après avoir créé un enfant, vérifiez que :
1. L'intégration est bien dans `custom_components/habits_manager/`
2. Le fichier `manifest.json` est présent
3. Home Assistant a été redémarré après installation
4. Aucune erreur n'apparaît dans les logs au démarrage
