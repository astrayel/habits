# 🔍 Guide de vérification post-déploiement

## Problèmes courants et solutions

### 1. Les sensors ne sont pas créés

**Symptôme:** Aucun sensor `sensor.habits_*` n'apparaît dans Home Assistant

**Diagnostic:**
```bash
# Vérifier les logs
ssh root@homeassistant "ha core logs | grep -i habits"
```

**Solutions:**

#### A. Aucun enfant créé
Si vous voyez `"Loaded 0 children from storage"` dans les logs:

```yaml
# Créer un enfant
service: habits_manager.create_child
data:
  name: "Sophie"
  person_entity: "person.sophie"
```

#### B. Problème d'initialisation
Si vous voyez des erreurs pendant le setup:

1. Vérifier que tous les fichiers sont présents:
   ```bash
   ssh root@homeassistant "ls -la /config/custom_components/habits_manager/"
   ```

2. Redémarrer Home Assistant:
   ```bash
   ssh root@homeassistant "ha core restart"
   ```

### 2. Les cartes ne se chargent pas

**Symptôme:** "Custom element doesn't exist" dans le navigateur

**Solutions:**

1. **Vérifier les ressources frontend:**
   - Ouvrez **Paramètres > Tableaux de bord > Resources**
   - Vérifiez que les 3 cartes sont enregistrées

2. **Vider le cache:**
   - Chrome/Edge: Ctrl+Shift+R
   - Firefox: Ctrl+F5
   - OU ouvrez DevTools (F12) et cochez "Disable cache"

3. **Vérifier que les fichiers JS existent:**
   ```bash
   ssh root@homeassistant "ls -lh /config/custom_components/habits_manager/www/"
   ```

### 3. La carte child affiche "Loading..." en boucle

**Symptôme:** Boucle infinie de chargement

**Cause:** Bug de rendu corrigé dans les dernières versions

**Solution:**
1. Mettez à jour vers la dernière version
2. Videz le cache du navigateur
3. Rechargez la page

### 4. Ancien format de sensors

**Symptôme:** Sensors nommés `sensor.toto_points` au lieu de `sensor.habits_child_XXXXX_points`

**Solution:**
1. Supprimez manuellement les anciens sensors dans l'UI
2. Redémarrez Home Assistant
3. Les nouveaux sensors seront créés avec le bon format

## Vérification complète

### Étape 1 : Backend fonctionnel

```yaml
# 1. Lister les enfants
service: habits_manager.list_children
response_variable: children
```

Vous devriez obtenir une liste des enfants avec leurs données.

### Étape 2 : Sensors créés

Dans **Outils de développement > États**, recherchez "habits":
- ✅ Vous devez voir ~10 sensors par enfant
- ✅ Format: `sensor.habits_child_XXXXX_*`

### Étape 3 : Cartes fonctionnelles

1. Ajoutez une carte de test:
   ```yaml
   type: custom:habits-child-card
   child_id: child_XXXXX
   ```

2. Vérifiez dans la console (F12):
   - ✅ Pas d'erreurs rouges
   - ✅ Message "[Child Card] Data loaded"
   - ✅ Données de l'enfant affichées

## Commandes de diagnostic

```bash
# Logs complets de l'intégration
ssh root@homeassistant "ha core logs | grep -A 5 -B 5 'Habits Manager'"

# Vérifier les sensors créés
ssh root@homeassistant "ha states list | grep habits"

# Redémarrer si nécessaire
ssh root@homeassistant "ha core restart"
```

## Support

Si le problème persiste:
1. Collectez les logs complets
2. Vérifiez la version de Home Assistant
3. Ouvrez une issue sur GitHub avec les informations
