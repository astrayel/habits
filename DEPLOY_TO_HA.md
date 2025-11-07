# 🚀 Déploiement vers Home Assistant

## ⚠️ Problème actuel

Erreur au démarrage :
```
cannot import name 'SERVICE_LIST_CHILDREN' from 'custom_components.habits_manager.const'
```

**Cause** : Le fichier `__init__.py` a été copié mais pas `const.py` qui contient les nouvelles constantes.

## ✅ Solution : Copier TOUS les fichiers modifiés

### Fichiers à copier

Les fichiers suivants ont été modifiés et **doivent TOUS** être copiés :

1. **`custom_components/habits_manager/__init__.py`**
   - Ajout de `SupportsResponse` import
   - Modification des 5 handlers `list_*` pour retourner des données
   - Ajout de `supports_response=SupportsResponse.ONLY`

2. **`custom_components/habits_manager/const.py`** ← **IMPORTANT !**
   - Contient les constantes `SERVICE_LIST_CHILDREN`, etc.
   - Déjà présent dans le code source mais pas copié vers HA

3. **`custom_components/habits_manager/services.yaml`**
   - Documentation des services `list_*`
   - Amélioration des descriptions

4. **`custom_components/habits_manager/sensor.py`**
   - Ajout de 2 sensors globaux
   - `AllTaskInstancesSensor`
   - `AllRewardClaimsSensor`

## 📋 Méthode de déploiement

### Option 1 : Copie manuelle (recommandé pour test)

```bash
# Depuis le dossier du projet
cd /home/user/habits

# Copier vers Home Assistant
cp custom_components/habits_manager/__init__.py /config/custom_components/habits_manager/
cp custom_components/habits_manager/const.py /config/custom_components/habits_manager/
cp custom_components/habits_manager/services.yaml /config/custom_components/habits_manager/
cp custom_components/habits_manager/sensor.py /config/custom_components/habits_manager/
```

### Option 2 : Copie du dossier complet

```bash
# Sauvegarder l'ancien (au cas où)
cp -r /config/custom_components/habits_manager /config/custom_components/habits_manager.backup

# Copier tout le nouveau code
cp -r custom_components/habits_manager/* /config/custom_components/habits_manager/
```

### Option 3 : Lien symbolique (pour développement)

```bash
# Supprimer l'ancien
rm -rf /config/custom_components/habits_manager

# Créer un lien symbolique
ln -s /home/user/habits/custom_components/habits_manager /config/custom_components/habits_manager
```

**Avantage** : Toute modification est immédiatement disponible
**Inconvénient** : Plus fragile

## 🔄 Après la copie

### 1. Vérifier que tous les fichiers sont présents

```bash
ls -la /config/custom_components/habits_manager/
```

Vous devriez voir :
```
__init__.py
const.py
manifest.json
sensor.py
services.yaml
core/
managers/
services/
storage/
www/
```

### 2. Vérifier que const.py contient les nouvelles constantes

```bash
grep "SERVICE_LIST_CHILDREN" /config/custom_components/habits_manager/const.py
```

**Résultat attendu** :
```python
SERVICE_LIST_CHILDREN = "list_children"
```

Si cette ligne n'apparaît pas, le fichier n'a pas été copié correctement !

### 3. Redémarrer Home Assistant

```bash
# Docker
docker restart homeassistant

# Core
systemctl restart home-assistant@homeassistant

# Supervised
ha core restart
```

### 4. Vérifier les logs au démarrage

```bash
tail -f /config/home-assistant.log | grep habits_manager
```

**Logs attendus (succès)** :
```
[habits_manager] Setting up Habits Manager integration
[habits_manager] Loaded 2 children
[habits_manager] Registered 23 services for habits_manager
[habits_manager] Created 18 sensor entities for 2 children + 2 global sensors
[habits_manager] Habits Manager integration setup complete
```

**Logs d'erreur (si problème)** :
```
Setup failed for custom integration 'habits_manager': ...
```

## 🔍 Vérification complète

### Checklist après déploiement

- [ ] Fichier `const.py` copié et contient `SERVICE_LIST_CHILDREN`
- [ ] Fichier `__init__.py` copié avec les modifications
- [ ] Fichier `services.yaml` copié avec les nouveaux services
- [ ] Fichier `sensor.py` copié avec les sensors globaux
- [ ] Home Assistant redémarré sans erreur
- [ ] 23 services enregistrés (dans les logs)
- [ ] 18 sensors créés (8 par enfant + 2 globaux)
- [ ] Services `list_*` visibles dans Outils de dev

### Test rapide

Dans **Outils de développement > Services** :

```yaml
service: habits_manager.list_children
data: {}
response_variable: result
```

**Si ça fonctionne** : Vous verrez les données des enfants
**Si erreur** : Vérifier que tous les fichiers sont bien copiés

## 🚨 Dépannage

### Erreur : "cannot import name 'SERVICE_LIST_CHILDREN'"

**Cause** : Le fichier `const.py` n'est pas à jour

**Solution** :
```bash
# Vérifier le contenu
cat /config/custom_components/habits_manager/const.py | grep SERVICE_LIST

# Si vide, copier à nouveau
cp custom_components/habits_manager/const.py /config/custom_components/habits_manager/
```

### Erreur : "SupportsResponse" not found

**Cause** : Version de Home Assistant trop ancienne (< 2023.7)

**Solution** : Mettre à jour Home Assistant vers 2024.1+

### Erreur : Sensors globaux non créés

**Cause** : Le fichier `sensor.py` n'est pas à jour

**Solution** :
```bash
cp custom_components/habits_manager/sensor.py /config/custom_components/habits_manager/
```

## 📊 État des fichiers modifiés

| Fichier | Modifications | Taille | Critique |
|---------|---------------|--------|----------|
| `__init__.py` | Services list_* modifiés | ~1000 lignes | ✅ Oui |
| `const.py` | Constantes SERVICE_LIST_* | ~79 lignes | ✅ **CRITIQUE** |
| `services.yaml` | Documentation services | ~707 lignes | ⚠️ Important |
| `sensor.py` | Sensors globaux | ~1161 lignes | ⚠️ Important |

## 🎯 Commande rapide tout-en-un

```bash
# Copier tous les fichiers modifiés d'un coup
cd /home/user/habits
for file in __init__.py const.py services.yaml sensor.py; do
    cp "custom_components/habits_manager/$file" "/config/custom_components/habits_manager/"
done

# Redémarrer HA (adapter selon votre installation)
docker restart homeassistant  # ou ha core restart

# Vérifier les logs
tail -f /config/home-assistant.log | grep habits_manager
```

## ✅ Validation finale

Une fois le déploiement réussi, vous devriez voir :

1. **Au démarrage** :
   ```
   Registered 23 services for habits_manager
   Created 18 sensor entities for 2 children + 2 global sensors
   ```

2. **Dans Outils de dev > Services** :
   - `habits_manager.list_children`
   - `habits_manager.list_tasks`
   - `habits_manager.list_habits`
   - `habits_manager.list_rewards`
   - `habits_manager.list_cosmetics`

3. **Dans Outils de dev > États** :
   - `sensor.habits_manager_all_task_instances`
   - `sensor.habits_manager_all_reward_claims`

4. **Test manuel réussi** :
   ```yaml
   service: habits_manager.list_children
   data: {}
   ```
   Retourne les données des enfants

---

**Après déploiement réussi** : Les cartes frontend fonctionneront correctement et vous verrez des logs détaillés de toute l'activité ! 🎉
