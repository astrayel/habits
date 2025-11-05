# Installation et Configuration - Habits Manager

## 📦 Installation de l'intégration

### Installation manuelle

1. Copiez le dossier `custom_components/habits_manager` dans votre dossier `config/custom_components/`
2. Redémarrez Home Assistant
3. L'intégration sera chargée automatiquement (pas de configuration nécessaire)

**Note**: Les cartes Lovelace sont automatiquement intégrées dans l'intégration (dossier `custom_components/habits_manager/www/`). Pas besoin de copie manuelle!

### Via HACS (futur)

*Note: L'intégration n'est pas encore publiée sur HACS. Cette méthode sera disponible ultérieurement.*

---

## 🎨 Configuration des Cartes Lovelace

Les cartes Lovelace sont automatiquement servies par l'intégration, mais vous devez les déclarer manuellement.

### Étape 1: Ajouter les ressources

#### Option A: Via l'interface graphique (recommandé)

1. Allez dans **Configuration** > **Lovelace Dashboards** > **Resources**
2. Cliquez sur le bouton **"+"** en bas à droite
3. Ajoutez ces 3 ressources une par une:

**Ressource 1 - Carte de Gestion:**
- **URL**: `/habits_manager_static/habits-manager-card.js`
- **Type**: JavaScript Module

**Ressource 2 - Carte de Supervision:**
- **URL**: `/habits_manager_static/habits-supervision-card.js`
- **Type**: JavaScript Module

**Ressource 3 - Carte Enfant:**
- **URL**: `/habits_manager_static/habits-child-card.js`
- **Type**: JavaScript Module

#### Option B: Via configuration.yaml

Ajoutez dans votre `configuration.yaml`:

```yaml
lovelace:
  mode: yaml
  resources:
    - url: /habits_manager_static/habits-manager-card.js
      type: module
    - url: /habits_manager_static/habits-supervision-card.js
      type: module
    - url: /habits_manager_static/habits-child-card.js
      type: module
```

### Étape 2: Ajouter les cartes à votre dashboard

Une fois les ressources ajoutées, vous pouvez utiliser les cartes dans vos dashboards:

#### 🔧 Carte de Gestion (pour parents/admins)

```yaml
type: custom:habits-manager-card
title: "Gestionnaire Habits"
```

**Fonctionnalités:**
- CRUD complet pour enfants, tâches, habitudes, récompenses, cosmétiques
- 5 onglets: Enfants | Tâches | Habitudes | Récompenses | Cosmétiques
- Interface complète de configuration

---

#### 👀 Carte de Supervision (pour parents)

```yaml
type: custom:habits-supervision-card
title: "Supervision des Enfants"
```

**Fonctionnalités:**
- Vue d'ensemble de tous les enfants (points, coins, niveau, streaks)
- Validation des tâches complétées
- Approbation des réclamations de récompenses
- Interface parent optimisée

---

#### 👶 Carte Enfant (interface ludique)

```yaml
type: custom:habits-child-card
child_id: "child_XXXXXXXX"  # ID de l'enfant (voir plus bas)
title: "Mes Tâches - Emma"
```

**Fonctionnalités:**
- 3 onglets: Accueil | Boutique | Mon Avatar
- Statistiques (points, coins, niveau, XP)
- Boutique de cosmétiques avec filtres
- Personnalisation d'avatar
- Interface colorée et motivante pour enfants

**⚠️ Important**: Remplacez `child_XXXXXXXX` par l'ID réel de l'enfant (voir section "Trouver l'ID d'un enfant")

---

## 👨‍👩‍👧 Créer votre premier enfant

### Via l'interface Carte de Gestion

1. Ajoutez la carte `custom:habits-manager-card` à votre dashboard
2. Allez dans l'onglet **"Enfants"**
3. Cliquez sur **"Ajouter un enfant"**
4. Remplissez le formulaire:
   - **Nom**: Le prénom de l'enfant
   - **Entité personne**: Sélectionnez l'entité `person.xxx` correspondante
   - **Photo avatar**: URL de la photo (optionnel)
5. Cliquez sur **"Créer"**

### Via les services Home Assistant

Allez dans **Outils de développement** > **Services**:

```yaml
service: habits_manager.create_child
data:
  name: "Emma"
  person_entity: "person.emma"
```

---

## 🔍 Trouver l'ID d'un enfant

### Méthode 1: Via les entités sensors

1. Allez dans **Configuration** > **Entités**
2. Recherchez `sensor.habits_manager_`
3. Les entités sont nommées: `sensor.habits_manager_{CHILD_ID}_points`
4. L'ID de l'enfant est la partie entre `habits_manager_` et `_points`

**Exemple:**
- Entité: `sensor.habits_manager_child_a3f8e9d2_points`
- ID enfant: `child_a3f8e9d2`

### Méthode 2: Via les logs

1. Ouvrez les logs Home Assistant
2. Cherchez les messages de type:
   ```
   Habits Manager: Child created - Emma with 12 sensors
   ```
3. Ou utilisez le service Developer Tools pour appeler:
   ```yaml
   service: logbook.log
   data:
     name: Habits Manager
   ```

---

## 📝 Exemples de configuration complète

### Dashboard Parent

```yaml
title: Gestion Enfants
views:
  - title: Vue d'ensemble
    cards:
      # Carte de supervision en haut
      - type: custom:habits-supervision-card
        title: "Supervision"

      # Carte de gestion en dessous
      - type: custom:habits-manager-card
        title: "Configuration"
```

### Dashboard Enfant (Emma)

```yaml
title: Emma
views:
  - title: Mes Tâches
    cards:
      - type: custom:habits-child-card
        child_id: "child_a3f8e9d2"
        title: "Bonjour Emma!"
```

### Dashboard Famille (plusieurs enfants)

```yaml
title: Famille
views:
  - title: Tous les enfants
    cards:
      # Vue supervision pour parents
      - type: custom:habits-supervision-card
        title: "Supervision Famille"

      # Cartes individuelles pour chaque enfant
      - type: custom:habits-child-card
        child_id: "child_a3f8e9d2"
        title: "Emma"

      - type: custom:habits-child-card
        child_id: "child_b7c2f1e4"
        title: "Lucas"
```

---

## 🎮 Services disponibles

### Gestion des enfants
- `habits_manager.create_child`
- `habits_manager.update_child`
- `habits_manager.delete_child`

### Gestion des tâches
- `habits_manager.create_task`
- `habits_manager.update_task`
- `habits_manager.delete_task`
- `habits_manager.mark_task_completed`
- `habits_manager.validate_task`
- `habits_manager.refuse_task`

### Gestion des habitudes
- `habits_manager.create_habit`
- `habits_manager.update_habit`
- `habits_manager.delete_habit`
- `habits_manager.complete_habit`

### Gestion des récompenses
- `habits_manager.create_reward`
- `habits_manager.claim_reward`
- `habits_manager.approve_claim`

### Gestion des cosmétiques
- `habits_manager.create_cosmetic`
- `habits_manager.purchase_cosmetic`

---

## 📊 Sensors créés

Pour chaque enfant, 12 sensors sont automatiquement créés:

### Statistiques principales
- `sensor.habits_manager_{child_id}_points`
- `sensor.habits_manager_{child_id}_coins`
- `sensor.habits_manager_{child_id}_level`
- `sensor.habits_manager_{child_id}_experience`

### Compteurs de tâches
- `sensor.habits_manager_{child_id}_tasks_pending`
- `sensor.habits_manager_{child_id}_tasks_completed`
- `sensor.habits_manager_{child_id}_tasks_completed_today`
- `sensor.habits_manager_{child_id}_tasks_waiting_validation_list` *(avec liste complète)*
- `sensor.habits_manager_{child_id}_daily_tasks` *(avec liste complète)*

### Statistiques d'habitudes
- `sensor.habits_manager_{child_id}_habits_count`
- `sensor.habits_manager_{child_id}_longest_streak`
- `sensor.habits_manager_{child_id}_habits_list` *(avec liste complète)*

### Réclamations
- `sensor.habits_manager_{child_id}_pending_claims` *(avec liste complète)*

---

## 🐛 Dépannage

### Les cartes n'apparaissent pas

1. **Vérifiez que les ressources sont bien ajoutées:**
   - Configuration > Lovelace Dashboards > Resources
   - Les 3 URLs doivent être présentes

2. **Videz le cache du navigateur:**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

3. **Rechargez les ressources:**
   - Dans l'interface Lovelace, appuyez sur Ctrl+F5

4. **Vérifiez les logs:**
   - Configuration > Logs
   - Cherchez les erreurs contenant "habits_manager"

### L'ID de l'enfant ne fonctionne pas

1. Vérifiez l'orthographe exacte de l'ID
2. L'ID doit être au format: `child_XXXXXXXX` (8 caractères hexadécimaux)
3. Utilisez le sensor pour confirmer: `sensor.habits_manager_{votre_id}_points`

### Les services ne fonctionnent pas

1. **Vérifiez que l'intégration est chargée:**
   ```
   Configuration > Intégrations > Cherchez "Habits Manager"
   ```

2. **Redémarrez Home Assistant** si l'intégration n'apparaît pas

3. **Vérifiez les logs** pour les erreurs de chargement

---

## 📞 Support

- **Issues GitHub**: [https://github.com/astrayel/habits/issues](https://github.com/astrayel/habits/issues)
- **Documentation**: [README.md](./README.md)
- **Architecture**: [architecture.md](./architecture.md)

---

## 🚀 Prochaines étapes

Après l'installation, consultez:
- [README.md](./README.md) - Vue d'ensemble du projet
- [architecture.md](./architecture.md) - Architecture technique détaillée
- [DATAMODELS.md](./DATAMODELS.md) - Modèles de données
