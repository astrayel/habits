# 🔍 Guide rapide : Vérifier les sources

## Problème identifié

**Vous n'avez pas encore créé d'enfant** → Donc aucun sensor n'existe → Pas de logs d'activité

## Solution rapide (3 étapes)

### 1️⃣ Activer les logs détaillés

Ajoutez dans `configuration.yaml` de Home Assistant :

```yaml
logger:
  default: info
  logs:
    custom_components.habits_manager: debug
```

Redémarrez Home Assistant.

### 2️⃣ Créer un enfant de test

Dans **Outils de développement > Services** :

```yaml
service: habits_manager.create_child
data:
  name: "TestChild"
  person_entity: "person.test"
```

✅ Vous devriez voir dans les logs :
```
[habits_manager] Service call: Child created - TestChild with 12 sensors
```

### 3️⃣ Vérifier les sensors

Allez dans **Paramètres > Entités** et cherchez `habits_manager`.

Vous devriez voir **8 sensors** :
- Points
- Coins
- Level
- Experience
- Tasks Pending
- Tasks Waiting Validation
- Longest Streak
- Has Pending Validation (binary)

## 📂 Fichiers de vérification créés

| Fichier | Description |
|---------|-------------|
| **verify_sources.py** | Script Python pour vérifier l'état actuel |
| **configuration_logger.yaml** | Configuration exemple pour les logs |
| **VERIFICATION_SOURCES.md** | Guide complet de vérification |
| **test_integration.md** | Tests pas-à-pas pour générer de l'activité |

## 🚀 Utilisation

### Vérifier l'état actuel

```bash
python3 verify_sources.py
```

### Consulter les logs en temps réel

```bash
tail -f /config/home-assistant.log | grep habits_manager
```

### Suivre le guide de test complet

Ouvrez `test_integration.md` et suivez les étapes pour :
- Créer des enfants
- Créer des tâches
- Marquer et valider des tâches
- Créer et compléter des habitudes
- Gérer des récompenses

## ✅ Checklist de vérification

- [ ] Configuration logger ajoutée
- [ ] Home Assistant redémarré
- [ ] Au moins 1 enfant créé
- [ ] 8 sensors visibles par enfant
- [ ] Logs visibles dans **Paramètres > Système > Journaux**
- [ ] Script `verify_sources.py` exécuté avec succès

## 📚 Documentation complète

- **VERIFICATION_SOURCES.md** : Guide détaillé de vérification
- **test_integration.md** : Tests complets pas-à-pas
- **configuration_logger.yaml** : Config logs recommandée

## 🆘 Besoin d'aide ?

Si après ces étapes vous ne voyez toujours pas de logs :

1. Vérifiez que `custom_components/habits_manager/` existe
2. Vérifiez que `manifest.json` est présent
3. Consultez les logs au démarrage de HA pour voir les erreurs
4. Vérifiez les permissions du dossier `.storage/`

---

**Résumé** : Vous devez d'abord créer au moins un enfant pour voir de l'activité et des logs !
