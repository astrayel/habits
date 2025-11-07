# Sensors Documentation - Habits Manager

Ce document liste tous les sensors créés par l'intégration.

## Types de Sensors

- **Child Sensors** (~10 par enfant) - Données spécifiques à un enfant
- **Global Sensors** (2) - Données globales pour tous les enfants

---

## Child Sensors

Pour chaque enfant créé, **10 sensors** sont automatiquement générés avec le format `sensor.habits_{child_id}_{type}`.

### Format des Entity IDs

```
sensor.habits_child_abc123_points
sensor.habits_child_abc123_coins
sensor.habits_child_abc123_level
...
```

⚠️ **Note:** Le nom affiché est `habits {child_id} {type}` mais l'entity_id est standardisé.

---

### 1. `sensor.habits_{child_id}_points`

Points accumulés par l'enfant (monnaie réelle pour récompenses physiques).

**État:** Nombre de points (int)

**Attributs:**
```yaml
child_id: "child_abc123"
child_name: "Sophie"
person_entity: "person.sophie"
avatar:
  photo_url: "/local/..."
  customization:
    clothes: "cape_superhero"
    accessory: null
    pet: "dragon_fire"
    theme: "default"
badges: ["first_task", "streak_7"]
owned_cosmetics: ["cape_superhero", "dragon_fire"]
```

**Unité:** `pts`

**Mise à jour:** Quand l'enfant complète une tâche validée ou une habitude

**Utilisation dans automations:**
```yaml
trigger:
  - platform: numeric_state
    entity_id: sensor.habits_child_abc123_points
    above: 100
action:
  - service: notify.mobile_app
    data:
      message: "Sophie a atteint 100 points! 🎉"
```

---

### 2. `sensor.habits_{child_id}_coins`

Pièces virtuelles pour acheter des cosmétiques.

**État:** Nombre de pièces (int)

**Attributs:** (mêmes que points)

**Unité:** `coins`

**Mise à jour:** Quand l'enfant complète une tâche/habitude ou achète un cosmétique

---

### 3. `sensor.habits_{child_id}_level`

Niveau actuel de l'enfant (progression gamifiée).

**État:** Niveau (int, commence à 1)

**Attributs:** (mêmes que points)

**Unité:** Aucune

**Mise à jour:** Quand l'XP atteint le seuil requis

---

### 4. `sensor.habits_{child_id}_experience`

Points d'expérience (XP) accumulés.

**État:** XP actuelle (int)

**Attributs:**
- (attributs de base)
- `experience_to_next_level`: XP nécessaire pour level up

**Unité:** `XP`

**Mise à jour:** Quand l'enfant complète une tâche/habitude

**Exemple:**
```yaml
state: 450
attributes:
  experience_to_next_level: 500
  child_name: "Sophie"
  level: 3
```

---

### 5. `sensor.habits_{child_id}_tasks_pending`

Nombre de tâches en attente de complétion pour aujourd'hui.

**État:** Nombre de tâches (int)

**Attributs:** (attributs de base)

**Unité:** `tasks`

**Mise à jour:** 
- Au démarrage de HA (génération des instances)
- Quand une tâche est complétée
- À minuit (nouvelles instances générées)

**Utilisation:**
```yaml
trigger:
  - platform: time
    at: "18:00:00"
condition:
  - condition: numeric_state
    entity_id: sensor.habits_child_abc123_tasks_pending
    above: 0
action:
  - service: notify.mobile_app
    data:
      message: "Sophie, tu as encore {{ states('sensor.habits_child_abc123_tasks_pending') }} tâches à faire!"
```

---

### 6. `sensor.habits_{child_id}_tasks_waiting`

Nombre de tâches complétées en attente de validation parent.

**État:** Nombre de tâches (int)

**Attributs:** (attributs de base)

**Unité:** `tasks`

**Mise à jour:**
- Quand enfant marque une tâche comme complétée
- Quand parent valide/refuse une tâche

**Utilisation:**
```yaml
trigger:
  - platform: state
    entity_id: sensor.habits_child_abc123_tasks_waiting
    to: "1"
action:
  - service: notify.parent_phone
    data:
      message: "Sophie a complété une tâche, validation requise!"
```

---

### 7. `sensor.habits_{child_id}_longest_streak`

Plus long streak (série de jours consécutifs) d'habitudes.

**État:** Nombre de jours (int)

**Attributs:** (attributs de base)

**Unité:** `days`

**Mise à jour:** Quand un habit est complété et que le streak bat le record

---

### 8. `sensor.habits_{child_id}_tasks_waiting_validation_list`

**Liste complète** des tâches en attente de validation (avec tous les détails).

**État:** Nombre de tâches (int)

**Attributs:**
- (attributs de base)
- `instances`: Liste détaillée des tâches

**Exemple d'attributs:**
```yaml
state: 2
attributes:
  child_name: "Sophie"
  instances:
    - instance_id: "instance_xyz789"
      task_id: "task_def456"
      task_title: "Ranger sa chambre"
      child_id: "child_abc123"
      date: "2025-11-07"
      status: "COMPLETED_WAITING"
      completed_at: "2025-11-07T14:30:00"
      rewards:
        points: 10
        coins: 5
        experience: 15
    - instance_id: "instance_uvw012"
      task_title: "Faire ses devoirs"
      # ...
```

**Mise à jour:** Comme `tasks_waiting` mais avec détails complets

**Utilisation frontend:**
```typescript
const sensor = this.hass.states['sensor.habits_child_abc123_tasks_waiting_validation_list'];
const tasks = sensor.attributes.instances;

tasks.forEach(task => {
  console.log(`${task.task_title}: ${task.rewards.points} pts`);
});
```

---

### 9. `sensor.habits_{child_id}_pending_claims`

**Liste complète** des réclamations de récompenses en attente d'approbation.

**État:** Nombre de réclamations (int)

**Attributs:**
- (attributs de base)
- `claims`: Liste détaillée des réclamations

**Exemple d'attributs:**
```yaml
state: 1
attributes:
  claims:
    - claim_id: "claim_jkl345"
      reward_id: "reward_ghi789"
      reward_title: "30 min temps d'écran"
      child_id: "child_abc123"
      claimed_at: "2025-11-07T16:00:00"
      status: "PENDING"
      cost_points: 100
```

**Mise à jour:** Quand enfant réclame une récompense ou parent approuve/refuse

---

### 10. `binary_sensor.habits_{child_id}_has_pending_validation`

Indicateur binaire: a-t-il des tâches en attente?

**État:** `on` (oui) ou `off` (non)

**Attributs:** (attributs de base)

**Mise à jour:** Sync avec `tasks_waiting`

**Utilisation:**
```yaml
condition:
  - condition: state
    entity_id: binary_sensor.habits_child_abc123_has_pending_validation
    state: "on"
```

---

## Global Sensors

### 11. `sensor.habits_manager_task_instances`

Toutes les instances de tâches pour tous les enfants.

**État:** Nombre total d'instances (int)

**Attributs:**
```yaml
instances:
  - instance_id: "instance_xyz789"
    task_id: "task_def456"
    child_id: "child_abc123"
    date: "2025-11-07"
    status: "PENDING"
    # ...
  - instance_id: "instance_uvw012"
    # ...
```

**Mise à jour:** À chaque changement d'état d'une instance

**Utilisation:** Principalement pour les cartes parent/supervision

---

### 12. `sensor.habits_manager_reward_claims`

Toutes les réclamations de récompenses.

**État:** Nombre total de réclamations (int)

**Attributs:**
```yaml
claims:
  - claim_id: "claim_jkl345"
    reward_id: "reward_ghi789"
    child_id: "child_abc123"
    status: "PENDING"
    # ...
  - claim_id: "claim_mno678"
    status: "APPROVED"
    # ...
```

**Mise à jour:** À chaque réclamation ou approbation

---

## Sensors Désactivés (pour performances)

Ces sensors existent dans le code mais sont commentés car ils causaient des problèmes de performance:

### ❌ `sensor.habits_{child_id}_daily_tasks`
Liste complète des tâches du jour avec statuts.

### ❌ `sensor.habits_{child_id}_habits_list`
Liste complète des habitudes actives.

**Raison:** Ces sensors généraient trop de données. Utilisez plutôt les services `list_*` avec `response_variable`.

---

## Mise à Jour des Sensors

### Mécanisme

Les sensors se mettent à jour via:
1. **Événements:** Écoute de `habits_manager_entity_update`
2. **Polling:** Désactivé (`should_poll = False`)
3. **Callbacks:** Abonnement aux événements HA

### Exemple de code interne:
```python
async def async_added_to_hass(self):
    @callback
    def handle_entity_update(event):
        if event.data.get("child_id") == self._child_id:
            self.async_schedule_update_ha_state(True)
    
    self.hass.bus.async_listen(
        f"{DOMAIN}_entity_update", 
        handle_entity_update
    )
```

---

## Utilisation dans Lovelace

### Carte simple:
```yaml
type: entity
entity: sensor.habits_child_abc123_points
name: Points de Sophie
icon: mdi:star
```

### Carte avec plusieurs sensors:
```yaml
type: entities
title: Progression de Sophie
entities:
  - sensor.habits_child_abc123_points
  - sensor.habits_child_abc123_coins
  - sensor.habits_child_abc123_level
  - sensor.habits_child_abc123_tasks_pending
  - sensor.habits_child_abc123_tasks_waiting
```

### Utilisation des attributs:
```yaml
type: markdown
content: |
  ## {{ state_attr('sensor.habits_child_abc123_points', 'child_name') }}
  
  **Points:** {{ states('sensor.habits_child_abc123_points') }} pts
  **Niveau:** {{ states('sensor.habits_child_abc123_level') }}
  **XP:** {{ states('sensor.habits_child_abc123_experience') }}/{{ state_attr('sensor.habits_child_abc123_experience', 'experience_to_next_level') }}
```

---

## Troubleshooting

### Les sensors n'apparaissent pas

1. **Vérifier que l'enfant existe:**
   ```yaml
   service: habits_manager.list_children
   response_variable: children
   ```

2. **Vérifier les logs:**
   ```bash
   ha core logs | grep "habits"
   ```
   
   Recherchez:
   - `"Loaded X children from storage"`
   - `"Successfully created Y sensor entities"`

3. **Redémarrer Home Assistant:**
   Les sensors sont créés au démarrage de HA.

### Les sensors ne se mettent pas à jour

1. **Vérifier les événements:**
   Dans DevTools > Events, écouter `habits_manager_entity_update`

2. **Forcer une mise à jour:**
   Appelez n'importe quel service qui modifie les données (ex: `update_child`)

3. **Vérifier les logs:**
   ```bash
   ha core logs | grep "Updated entity data"
   ```

---

## Voir Aussi

- [API_REFERENCE.md](./API_REFERENCE.md) - Services qui modifient ces sensors
- [EVENTS.md](./EVENTS.md) - Événements qui déclenchent les mises à jour
- [../deployment/VERIFICATION.md](../deployment/VERIFICATION.md) - Guide de vérification
