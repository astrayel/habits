# Guide de tests - Phase 1 Backend Core

> **Phase :** Phase 1 - Backend Core
> **Date :** 2025-11-04
> **Statut :** Prêt pour tests manuels

---

## 📋 Prérequis

### Installation dans Home Assistant

1. **Copier l'intégration** dans votre instance HA :
   ```bash
   cp -r custom_components/habits_manager /path/to/homeassistant/custom_components/
   ```

2. **Redémarrer Home Assistant**

3. **Vérifier les logs** :
   ```
   tail -f /config/home-assistant.log | grep habits_manager
   ```

   Vous devriez voir :
   ```
   Setting up Habits Manager integration
   Storage directory ensured at .storage/habits_manager
   Habits Manager integration setup complete
   Registered 11 services for habits_manager
   ```

---

## ✅ Checklist de tests

### Test 1 : Créer un enfant

**Service :** `habits_manager.create_child`

**Données :**
```yaml
service: habits_manager.create_child
data:
  name: "Emma Test"
  person_entity: "person.emma"
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Fichier `children.json` créé dans `.storage/habits_manager/`
- ✅ Événement `habits_manager_update` émis avec `update_type: child_created`
- ✅ Logs : "Child created: Emma Test (child_XXXXXXXX)"

**Vérifier le fichier :**
```bash
cat .storage/habits_manager/children.json
```

Devrait contenir :
```json
{
  "child_XXXXXXXX": {
    "id": "child_XXXXXXXX",
    "name": "Emma Test",
    "person_entity": "person.emma",
    "points": 0,
    "coins": 0,
    "level": 1,
    "experience": 0,
    "experience_to_next_level": 100,
    ...
  }
}
```

---

### Test 2 : Créer une tâche

**Service :** `habits_manager.create_task`

**Données :**
```yaml
service: habits_manager.create_task
data:
  title: "Ranger sa chambre"
  description: "Mettre les vêtements dans le panier, ranger le bureau"
  type: "mandatory"
  assigned_to: ["child_XXXXXXXX"]  # Remplacer par l'ID du Test 1
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

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Fichier `tasks.json` créé
- ✅ Événement émis avec `update_type: task_created`
- ✅ Logs : "Task created: Ranger sa chambre (task_XXXXXXXX)"

**Vérifier le fichier :**
```bash
cat .storage/habits_manager/tasks.json
```

---

### Test 3 : Créer une habitude

**Service :** `habits_manager.create_habit`

**Données :**
```yaml
service: habits_manager.create_habit
data:
  title: "Lire 15 minutes"
  description: "Lecture d'un livre au choix"
  icon: "mdi:book-open-page-variant"
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
  assigned_to: ["child_XXXXXXXX"]  # Remplacer par l'ID du Test 1
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Fichier `habits.json` créé
- ✅ Événement émis avec `update_type: habit_created`
- ✅ Logs : "Habit created: Lire 15 minutes (habit_XXXXXXXX)"

---

### Test 4 : Compléter une habitude

**Service :** `habits_manager.complete_habit`

**Données :**
```yaml
service: habits_manager.complete_habit
data:
  habit_id: "habit_XXXXXXXX"  # ID du Test 3
  child_id: "child_XXXXXXXX"  # ID du Test 1
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Fichier `habit_streaks.json` créé
- ✅ Événement émis avec :
  ```yaml
  update_type: habit_completed
  streak: 1
  streak_increased: true
  rewards:
    points: 5
    coins: 2
    experience: 10
  ```
- ✅ Points/pièces/XP ajoutés à l'enfant
- ✅ Logs : "Habit completed by child... Streak: 1"

**Vérifier les points de l'enfant :**
```bash
cat .storage/habits_manager/children.json | grep -A 5 "child_XXXXXXXX"
```

Devrait montrer :
```json
"points": 5,
"coins": 2,
"experience": 10,
```

---

### Test 5 : Compléter l'habitude à nouveau (test streak)

**Répéter le Test 4** (même service)

**Résultats attendus :**
- ✅ Streak = 2
- ✅ Bonus progressif appliqué :
  ```yaml
  rewards:
    points: 6   # 5 * (1 + 2 * 0.1) = 5 * 1.2 = 6
    coins: 2    # Arrondi
    experience: 12
  ```
- ✅ Total de l'enfant :
  - Points : 5 + 6 = 11
  - Pièces : 2 + 2 = 4
  - XP : 10 + 12 = 22

---

### Test 6 : Marquer une tâche comme complétée

**Prérequis :** Attendre que le système génère une instance de tâche (au prochain setup)

**Service :** `habits_manager.mark_task_completed`

**Données :**
```yaml
service: habits_manager.mark_task_completed
data:
  instance_id: "inst_XXXXXXXX"  # ID de l'instance générée
  child_id: "child_XXXXXXXX"
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Fichier `task_instances.json` mis à jour
- ✅ Statut de l'instance = `completed_waiting`
- ✅ Événement émis avec `update_type: task_completed`

**Vérifier :**
```bash
cat .storage/habits_manager/task_instances.json
```

Devrait contenir :
```json
{
  "inst_XXXXXXXX": {
    "status": "completed_waiting",
    "completed_at": "2025-11-04T...",
    ...
  }
}
```

---

### Test 7 : Niveau up (test XP)

**Répéter le Test 4** (compléter l'habitude) plusieurs fois jusqu'à atteindre 100 XP

**Calcul :**
- Complétion 1 : +10 XP (total : 10, streak 1)
- Complétion 2 : +12 XP (total : 22, streak 2)
- Complétion 3 : +13 XP (total : 35, streak 3)
- Complétion 4 : +14 XP (total : 49, streak 4)
- Complétion 5 : +15 XP (total : 64, streak 5)
- Complétion 6 : +16 XP (total : 80, streak 6)
- Complétion 7 : +17 XP (total : 97, streak 7)
- Complétion 8 : +18 XP (total : 115, **LEVEL UP !**, streak 8)

**Résultats attendus après la 8ème complétion :**
- ✅ Niveau = 2
- ✅ XP restant = 15 (115 - 100)
- ✅ XP pour prochain niveau = 120 (100 * 1.2)
- ✅ Logs : niveau up détecté

---

### Test 8 : Mettre à jour un enfant

**Service :** `habits_manager.update_child`

**Données :**
```yaml
service: habits_manager.update_child
data:
  child_id: "child_XXXXXXXX"
  name: "Emma Modifiée"
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Nom de l'enfant modifié dans `children.json`
- ✅ Événement émis avec `update_type: child_updated`

---

### Test 9 : Désactiver une tâche

**Service :** `habits_manager.update_task`

**Données :**
```yaml
service: habits_manager.update_task
data:
  task_id: "task_XXXXXXXX"
  active: false
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Tâche marquée `active: false` dans `tasks.json`
- ✅ Événement émis

---

### Test 10 : Supprimer une tâche

**Service :** `habits_manager.delete_task`

**Données :**
```yaml
service: habits_manager.delete_task
data:
  task_id: "task_XXXXXXXX"
```

**Résultats attendus :**
- ✅ Service s'exécute sans erreur
- ✅ Tâche supprimée de `tasks.json`
- ✅ Événement émis avec `update_type: task_deleted`

---

## 🔍 Vérifications des fichiers de stockage

### Localisation
```
.storage/habits_manager/
├── children.json
├── tasks.json
├── habits.json
├── task_instances.json
└── habit_streaks.json
```

### Vérifier l'intégrité JSON

```bash
cd .storage/habits_manager/

# Vérifier chaque fichier
for file in *.json; do
  echo "Checking $file..."
  python3 -m json.tool $file > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"
done
```

---

## 📊 Résultats attendus finaux

Après tous les tests :

### État de l'enfant
```json
{
  "id": "child_XXXXXXXX",
  "name": "Emma Modifiée",
  "points": ~50,
  "coins": ~20,
  "level": 2,
  "experience": 15,
  "experience_to_next_level": 120,
  ...
}
```

### Fichiers créés
- ✅ `children.json` (1 enfant)
- ✅ `tasks.json` (0 tâches, car supprimée)
- ✅ `habits.json` (1 habitude)
- ✅ `task_instances.json` (1+ instances)
- ✅ `habit_streaks.json` (1 streak avec ~8 complétions)

---

## 🐛 Débogage

### Voir tous les services disponibles

```yaml
# Developer Tools → Services → Rechercher "habits_manager"
```

Devrait afficher 11 services :
- create_child
- update_child
- delete_child
- create_task
- update_task
- delete_task
- mark_task_completed
- create_habit
- update_habit
- delete_habit
- complete_habit

### Écouter les événements

```yaml
# Developer Tools → Events → Écouter "habits_manager_update"
```

### Logs en temps réel

```bash
tail -f home-assistant.log | grep -E "(habits_manager|ERROR|WARNING)"
```

### Erreurs communes

#### "Service not found"
- L'intégration n'est pas chargée
- Redémarrer Home Assistant
- Vérifier les logs de démarrage

#### "Child not found"
- L'ID de l'enfant est incorrect
- Vérifier dans `children.json`

#### "Task not found"
- L'ID de la tâche est incorrect
- Vérifier dans `tasks.json`

#### "Validation error"
- Les données du service sont invalides
- Vérifier les types et valeurs requises

---

## ✅ Critères de succès Phase 1

La Phase 1 est validée si :

- [ ] ✅ Tous les 10 tests passent sans erreur
- [ ] ✅ Tous les fichiers JSON sont créés et valides
- [ ] ✅ Les points/pièces/XP sont calculés correctement
- [ ] ✅ Le système de streak fonctionne avec bonus progressif
- [ ] ✅ Le level-up se déclenche à 100 XP
- [ ] ✅ Les événements HA sont émis correctement
- [ ] ✅ Aucune erreur dans les logs HA
- [ ] ✅ Le code respecte PEP 8 (vérifier avec `flake8`)
- [ ] ✅ Tous les fichiers ont des docstrings

---

## 🚀 Prochaines étapes

Une fois Phase 1 validée :

**Phase 2 :** Validation et Récompenses
- Services de validation (validate_task, refuse_task, validate_penalty)
- RewardManager et CosmeticManager
- Système de réclamation de récompenses
- Scheduler automatique (génération instances, check failed tasks)

**Phase 3 :** Frontend Base
- Setup TypeScript, Lit, Rollup
- Composants réutilisables
- Services frontend
- Thèmes

---

**Tests effectués le :** _________________
**Par :** _________________
**Résultat :** ☐ Succès ☐ Échec

**Notes :**
```




```

---

**Document de test - Phase 1 Backend Core**
**Version :** 1.0
**Dernière mise à jour :** 2025-11-04
