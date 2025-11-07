# 🚀 Déploiement vers Home Assistant

## Installation

### Installation manuelle

1. **Copier l'intégration**
   ```bash
   # Sur votre machine de développement
   scp -r custom_components/habits_manager root@homeassistant:/config/custom_components/
   ```

2. **Redémarrer Home Assistant**
   ```bash
   ssh root@homeassistant "ha core restart"
   ```

3. **Vérifier les logs**
   ```bash
   ssh root@homeassistant "ha core logs | grep habits"
   ```

## Configuration

### 1. Ajouter l'intégration

Dans Home Assistant :
1. Allez dans **Paramètres > Appareils et Services**
2. Cliquez sur **+ Ajouter une intégration**
3. Recherchez "Habits Manager"
4. Suivez les instructions

### 2. Créer votre premier enfant

```yaml
service: habits_manager.create_child
data:
  name: "Sophie"
  person_entity: "person.sophie"
```

### 3. Vérifier que les sensors sont créés

Allez dans **Outils de développement > États** et recherchez "habits".

Vous devriez voir des sensors comme:
- `sensor.habits_child_XXXXX_points`
- `sensor.habits_child_XXXXX_coins`
- `sensor.habits_child_XXXXX_level`
- etc. (10 sensors par enfant)

Si les sensors n'apparaissent pas, voir [VERIFICATION.md](./VERIFICATION.md).

## Configuration des cartes Lovelace

### 1. Ajouter les ressources frontend

Dans **Paramètres > Tableaux de bord > Resources** (ou via configuration.yaml) :

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

### 2. Ajouter une carte

**Carte principale (parent):**
```yaml
type: custom:habits-manager-card
```

**Carte de supervision:**
```yaml
type: custom:habits-supervision-card
```

**Carte enfant:**
```yaml
type: custom:habits-child-card
child_id: child_XXXXX  # Remplacez par l'ID de votre enfant
```

## Mise à jour

```bash
# 1. Copier la nouvelle version
scp -r custom_components/habits_manager root@homeassistant:/config/custom_components/

# 2. Redémarrer
ssh root@homeassistant "ha core restart"

# 3. Vider le cache du navigateur (Ctrl+Shift+R)
```

## Dépannage

Voir [VERIFICATION.md](./VERIFICATION.md) pour le guide de vérification complet.
