# Guide de tests - Backend (Phase 1 & 2)

> **Phases :** Phase 1 (Backend Core) & Phase 2 (Validation & Récompenses)
> **Date :** 2025-11-04 - 2025-11-05
> **Statut :** ✅ TERMINÉ - Tests automatisés disponibles (15/15 passent)

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
   Registered 17 services for habits_manager (11 Phase 1 + 6 Phase 2)
   ```

---

## 🤖 Tests automatisés (RECOMMANDÉ)

### Script 1: test_habits_manager.py

**Description:** Script de test automatisé complet via l'API REST de Home Assistant

**Prérequis:**
- Python 3.8+
- Module `requests` installé
- Token d'accès longue durée Home Assistant

**Installation:**
```bash
pip install requests
```

**Utilisation:**
```bash
python test_habits_manager.py --url https://home.hacquin.com --token YOUR_LONG_LIVED_TOKEN
```

**Obtenir un token:**
1. Aller dans Home Assistant
2. Profil (en bas à gauche)
3. Tokens d'accès de longue durée
4. Créer un token

**Ce que le script teste:**
- ✅ **Phase 1:** Création enfant, sensors dynamiques, tâches, habitudes, task instances, complétion
- ✅ **Phase 2:** Validation de tâches, récompenses, réclamations, cosmétiques

**15 tests couverts:**
1. Vérification des services (Test 0a)
2. Détection des entités person (Test 0b)
3. Création d'enfant (Test 1)
4. Vérification des sensors créés dynamiquement (Test 2)
5. Création de tâche (Test 3)
6. Vérification de génération d'instance (Test 4)
7. Création d'habitude (Test 5)
8. Complétion d'habitude (Test 6)
9. Marquage de tâche complétée (Test 7)
10. Validation de tâche Phase 2 (Test 8)
11. Création de récompense Phase 2 (Test 9)
12. Réclamation de récompense Phase 2 (Test 10)
13. Approbation de réclamation Phase 2 (Test 11)
14. Refus de tâche Phase 2 (Test 12)
15. Création de cosmétique Phase 2 (Test 13)

**Output:**
- Terminal coloré (vert ✓ / rouge ✗)
- Rapport détaillé avec score
- Statistiques de pass/fail

**Résultat actuel:** ✅ 15/15 tests passent (100%)

---

### Script 2: test_storage_files.py

**Description:** Validation directe des fichiers JSON de stockage (ne nécessite pas d'API)

**Utilisation:**
```bash
python test_storage_files.py --storage-dir /config/.storage/habits_manager
```

**Ce que le script vérifie:**
- Structure des 8 fichiers JSON
- Présence des champs requis
- Validation des types de données
- Statistiques (counts, statuses, etc.)

**Fichiers vérifiés:**
1. children.json
2. tasks.json
3. task_instances.json
4. habits.json
5. habit_streaks.json
6. rewards.json (Phase 2)
7. reward_claims.json (Phase 2)
8. cosmetics.json (Phase 2)

**Avantages:**
- Pas besoin de token API
- Vérification rapide de l'intégrité des données
- Peut être exécuté localement avec accès filesystem

---

## ✅ Checklist de tests manuels (Phase 1)

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

## ✅ Checklist de tests manuels (Phase 2)

### Test 11 : Valider une tâche

**Service :** `habits_manager.validate_task`

**Données :**
```yaml
service: habits_manager.validate_task
data:
  instance_id: "inst_XXXXXXXX"  # ID d'une instance complétée
  validator_id: "admin"
  note: "Bien fait !"
```

**Résultats attendus :**
- ✅ Status change de `completed_waiting` à `validated`
- ✅ Récompenses attribuées à l'enfant
- ✅ Compteurs de tâches mis à jour
- ✅ Événement émis

---

### Test 12 : Refuser une tâche avec pénalité

**Service :** `habits_manager.refuse_task`

**Données :**
```yaml
service: habits_manager.refuse_task
data:
  instance_id: "inst_XXXXXXXX"
  validator_id: "admin"
  apply_penalty: true
  note: "Pas suffisamment bien fait"
```

**Résultats attendus :**
- ✅ Status change à `refused`
- ✅ Pénalités appliquées (points négatifs, ne descend pas < 0)
- ✅ Événement émis

---

### Test 13 : Créer une récompense

**Service :** `habits_manager.create_reward`

**Données :**
```yaml
service: habits_manager.create_reward
data:
  title: "30 minutes d'écran"
  description: "Temps d'écran supplémentaire"
  type: "screen_time"
  cost_points: 100
  requires_parent_approval: true
  stock: 5
  cooldown_days: 7
```

**Résultats attendus :**
- ✅ Récompense créée dans `rewards.json`
- ✅ Événement émis

---

### Test 14 : Réclamer une récompense

**Service :** `habits_manager.claim_reward`

**Données :**
```yaml
service: habits_manager.claim_reward
data:
  reward_id: "reward_XXXXXXXX"
  child_id: "child_XXXXXXXX"
```

**Résultats attendus :**
- ✅ Réclamation créée dans `reward_claims.json`
- ✅ Points déduits du solde de l'enfant
- ✅ Status: `pending` (si requires_parent_approval) ou `approved`
- ✅ Stock décrémenté si limité
- ✅ Événement émis

---

### Test 15 : Approuver une réclamation

**Service :** `habits_manager.approve_claim`

**Données :**
```yaml
service: habits_manager.approve_claim
data:
  claim_id: "claim_XXXXXXXX"
  approver_id: "admin"
```

**Résultats attendus :**
- ✅ Status change de `pending` à `approved`
- ✅ Date d'approbation enregistrée
- ✅ Événement émis

---

### Test 16 : Créer un cosmétique

**Service :** `habits_manager.create_cosmetic`

**Données :**
```yaml
service: habits_manager.create_cosmetic
data:
  name: "T-shirt pirate"
  description: "Un t-shirt rayé avec un crâne"
  category: "clothes"
  subcategory: "shirt"
  rarity: "rare"
  cost_coins: 100
  unlock_requirements:
    min_level: 5
```

**Résultats attendus :**
- ✅ Cosmétique créé dans `cosmetics.json`
- ✅ Unlock requirements enregistrés
- ✅ Événement émis

---

## ✅ Critères de succès Phase 1 & 2

Les phases 1 et 2 sont validées si :

**Phase 1:**
- [x] ✅ Tous les 10 tests Phase 1 passent sans erreur
- [x] ✅ Tous les fichiers JSON Phase 1 sont créés et valides
- [x] ✅ Les points/pièces/XP sont calculés correctement
- [x] ✅ Le système de streak fonctionne avec bonus progressif
- [x] ✅ Le level-up se déclenche à 100 XP
- [x] ✅ Les événements HA sont émis correctement
- [x] ✅ Aucune erreur dans les logs HA
- [x] ✅ Le code respecte PEP 8
- [x] ✅ Tous les fichiers ont des docstrings

**Phase 2:**
- [x] ✅ Tous les 6 tests Phase 2 passent sans erreur
- [x] ✅ Fichiers JSON Phase 2 créés (rewards, reward_claims, cosmetics)
- [x] ✅ Workflow de validation fonctionne (validate/refuse)
- [x] ✅ Système de récompenses avec approbation fonctionne
- [x] ✅ Système de cosmétiques avec unlocks fonctionne
- [x] ✅ Scheduler implémenté et testé
- [x] ✅ Tests automatisés créés (15/15 passent)
- [x] ✅ Encodage UTF-8 correct sur tous les fichiers
- [x] ✅ I/O asynchrone avec aiofiles

**Global:**
- [x] ✅ 17 services HA enregistrés et fonctionnels
- [x] ✅ Tests automatisés disponibles et passent à 100%
- [x] ✅ Documentation à jour

---

## 🚀 Prochaines étapes

**Phase 3 :** Frontend Base (EN COURS)
- Setup TypeScript, Lit, Rollup
- Composants réutilisables
- Services frontend
- Thèmes et animations de base

**Phase 4-6 :** Cartes Lovelace
- Carte de gestion (parents/admins)
- Carte de supervision (parents)
- Carte enfant (interface gamifiée)

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
