# Services manquants - Implémentation

## État actuel
- ✅ services.yaml: update_reward, delete_reward, update_cosmetic, delete_cosmetic déclarés
- ✅ const.py: Constantes SERVICE_UPDATE_REWARD, SERVICE_DELETE_REWARD, SERVICE_UPDATE_COSMETIC, SERVICE_DELETE_COSMETIC ajoutées
- ✅ __init__.py: Imports des constantes ajoutés
- ❌ __init__.py: Handlers manquants (à ajouter après ligne 703)
- ❌ __init__.py: Enregistrements de services manquants (à ajouter après ligne 985)

## Handlers à ajouter dans __init__.py

Insérer après `handle_approve_claim` (ligne 703):

```python
    async def handle_update_reward(call: ServiceCall):
        """Service: Mettre à jour une récompense."""
        try:
            reward_id = call.data["reward_id"]
            reward_mgr = hass.data[DOMAIN]["reward_manager"]
            
            # Récupérer la récompense existante
            reward = await reward_mgr.get_reward(reward_id)
            
            # Appliquer les mises à jour
            if "title" in call.data:
                reward.title = call.data["title"]
            if "description" in call.data:
                reward.description = call.data["description"]
            if "cost_points" in call.data:
                reward.cost_points = call.data["cost_points"]
            if "stock" in call.data:
                reward.stock = call.data["stock"]
            if "active" in call.data:
                reward.active = call.data["active"]
            
            # Sauvegarder
            await reward_mgr.update_reward(reward)
            
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_updated",
                "reward_id": reward.id,
            })
            
            _LOGGER.info(f"Service call: Reward updated - {reward.title}")
            
        except RewardNotFoundError as err:
            _LOGGER.error(f"Reward not found: {err}")
            raise HomeAssistantError(f"Reward not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_reward: {err}")
            raise HomeAssistantError(f"Failed to update reward: {err}")

    async def handle_delete_reward(call: ServiceCall):
        """Service: Supprimer une récompense."""
        try:
            reward_id = call.data["reward_id"]
            reward_mgr = hass.data[DOMAIN]["reward_manager"]
            
            # Supprimer la récompense
            await reward_mgr.delete_reward(reward_id)
            
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_deleted",
                "reward_id": reward_id,
            })
            
            _LOGGER.info(f"Service call: Reward deleted - {reward_id}")
            
        except RewardNotFoundError as err:
            _LOGGER.error(f"Reward not found: {err}")
            raise HomeAssistantError(f"Reward not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in delete_reward: {err}")
            raise HomeAssistantError(f"Failed to delete reward: {err}")
```

Insérer après `handle_purchase_cosmetic` (ligne 764):

```python
    async def handle_update_cosmetic(call: ServiceCall):
        """Service: Mettre à jour un cosmétique."""
        try:
            cosmetic_id = call.data["cosmetic_id"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]
            
            # Récupérer le cosmétique existant
            cosmetic = await cosmetic_mgr.get_cosmetic(cosmetic_id)
            
            # Appliquer les mises à jour
            if "name" in call.data:
                cosmetic.name = call.data["name"]
            if "description" in call.data:
                cosmetic.description = call.data["description"]
            if "cost_coins" in call.data:
                cosmetic.cost_coins = call.data["cost_coins"]
            if "active" in call.data:
                cosmetic.active = call.data["active"]
            
            # Sauvegarder
            await cosmetic_mgr.update_cosmetic(cosmetic)
            
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_updated",
                "cosmetic_id": cosmetic.id,
            })
            
            _LOGGER.info(f"Service call: Cosmetic updated - {cosmetic.name}")
            
        except CosmeticNotFoundError as err:
            _LOGGER.error(f"Cosmetic not found: {err}")
            raise HomeAssistantError(f"Cosmetic not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to update cosmetic: {err}")

    async def handle_delete_cosmetic(call: ServiceCall):
        """Service: Supprimer un cosmétique."""
        try:
            cosmetic_id = call.data["cosmetic_id"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]
            
            # Supprimer le cosmétique
            await cosmetic_mgr.delete_cosmetic(cosmetic_id)
            
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_deleted",
                "cosmetic_id": cosmetic_id,
            })
            
            _LOGGER.info(f"Service call: Cosmetic deleted - {cosmetic_id}")
            
        except CosmeticNotFoundError as err:
            _LOGGER.error(f"Cosmetic not found: {err}")
            raise HomeAssistantError(f"Cosmetic not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in delete_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to delete cosmetic: {err}")
```

## Enregistrements à ajouter

Après ligne 985:

```python
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_REWARD, handle_update_reward)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_REWARD, handle_delete_reward)
```

Après ligne 987:

```python
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_COSMETIC, handle_update_cosmetic)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_COSMETIC, handle_delete_cosmetic)
```

Mettre à jour ligne 995:

```python
    _LOGGER.info(f"Registered {27} services for {DOMAIN} (11 Phase 1 + 11 Phase 2 + 5 Listing)")
```

## Frontend à mettre à jour

Fichier: `www/habits-manager/src/cards/manager-card.js`

Remplacer les alertes d'édition par des appels réels:

```javascript
  async submitRewardForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Get form values
    const title = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]')?.value || '';
    const cost_points = parseInt(form.querySelector('[name="cost"]').value) || 0;
    const stock_value = form.querySelector('[name="remaining_quantity"]').value;
    const stock = stock_value ? parseInt(stock_value) : null;

    const serviceData = {
      title,
      description,
      cost_points
    };

    if (stock !== null) {
      serviceData.stock = stock;
    }

    if (isEdit) {
      const rewardId = form.querySelector('[name="reward_id"]').value;
      serviceData.reward_id = rewardId;
      await this.callService(SERVICE_DOMAIN, 'update_reward', serviceData);
    } else {
      await this.callService(SERVICE_DOMAIN, 'create_reward', serviceData);
    }

    dialog.close();
  }
  
  async submitCosmeticForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form')  if (!form) return;

    // Get form values
    const name = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]')?.value || '';
    const category = form.querySelector('[name="category"]').value;
    const subcategory = form.querySelector('[name="subcategory"]')?.value || '';
    const rarity = form.querySelector('[name="rarity"]').value;
    const cost_coins = parseInt(form.querySelector('[name="cost_coins"]').value) || 50;
    const preview_image = form.querySelector('[name="preview_image"]')?.value || '';
    const level_value = form.querySelector('[name="level"]').value;
    const level = level_value ? parseInt(level_value) : null;
    const active = form.querySelector('[name="active"]').checked;

    const serviceData = {
      name,
      description,
      category,
      subcategory,
      rarity,
      cost_coins,
      active
    };

    if (preview_image) {
      serviceData.preview_image = preview_image;
    }

    if (level) {
      serviceData.unlock_requirements = { level };
    }

    if (isEdit) {
      const cosmeticId = form.querySelector('[name="cosmetic_id"]').value;
      serviceData.cosmetic_id = cosmeticId;
      await this.callService(SERVICE_DOMAIN, 'update_cosmetic', serviceData);
    } else {
      await this.callService(SERVICE_DOMAIN, 'create_cosmetic', serviceData);
    }

    dialog.close();
  }
```

## Test

1. Redémarrer Home Assistant
2. Vérifier les services avec: Outils > Services > Filter "habits_manager"
3. Devrait afficher 27 services au total incluant:
   - habits_manager.update_reward
   - habits_manager.delete_reward
   - habits_manager.update_cosmetic
   - habits_manager.delete_cosmetic

## API Reference à mettre à jour

Ajouter les sections après create_reward et create_cosmetic dans docs/backend/API_REFERENCE.md.
