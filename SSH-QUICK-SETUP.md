# Configuration Rapide SSH pour Habits Manager

## Problème
Le script de synchronisation demande le mot de passe à chaque transfert de fichier.

## Solution 1 : Authentification par clé SSH (Recommandé)

### Étape 1 : Générer une clé SSH sur Windows

```powershell
# Ouvrir PowerShell et exécuter :
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Appuyez sur Entrée pour accepter l'emplacement par défaut
# Vous pouvez laisser la passphrase vide pour ne pas avoir à la taper
```

Cela crée deux fichiers :
- `C:\Users\VotreNom\.ssh\id_ed25519` (clé privée)
- `C:\Users\VotreNom\.ssh\id_ed25519.pub` (clé publique)

### Étape 2 : Copier la clé publique vers Home Assistant

```powershell
# Afficher le contenu de votre clé publique
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Copiez le contenu affiché (commence par `ssh-ed25519 ...`)

### Étape 3 : Ajouter la clé sur Home Assistant

1. **Via l'add-on SSH** (si vous utilisez l'add-on SSH & Web Terminal) :
   - Ouvrez l'interface de l'add-on SSH dans Home Assistant
   - Allez dans Configuration
   - Ajoutez votre clé publique dans la section "Authorized Keys"
   - Redémarrez l'add-on

2. **Via SSH direct** (si vous avez un accès root) :
   ```bash
   # Se connecter avec mot de passe une dernière fois
   ssh -o MACs=hmac-sha2-512-etm@openssh.com root@homeassistant

   # Créer le dossier .ssh si nécessaire
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh

   # Ajouter votre clé publique
   echo "COLLEZ_VOTRE_CLE_PUBLIQUE_ICI" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

### Étape 4 : Tester la connexion

```powershell
# Cette commande ne devrait plus demander de mot de passe
ssh -o MACs=hmac-sha2-512-etm@openssh.com root@homeassistant "echo 'Connexion SSH OK !'"
```

Si ça fonctionne, vous pouvez maintenant utiliser le script sans mot de passe !

## Solution 2 : Utiliser rsync (Connexion unique)

Le script a été mis à jour pour utiliser `rsync` qui ne demande le mot de passe qu'**une seule fois** par synchronisation au lieu de demander pour chaque fichier.

### Installer rsync sur Windows

```powershell
# Via winget (Windows 10/11)
winget install rsync

# OU via Chocolatey
choco install rsync

# OU via Git Bash (si Git est installé)
# rsync est déjà inclus dans Git Bash
```

Après installation de rsync, le script `dev-sync-safe.ps1` ne demandera le mot de passe qu'une seule fois !

## Solution 3 : Utiliser le script avec rsync

Si rsync est installé :

```powershell
# Le script utilisera automatiquement rsync
.\dev-sync-safe.ps1

# Vous ne devrez entrer le mot de passe qu'UNE SEULE FOIS
```

## Vérifier quelle solution fonctionne

```powershell
# Tester si rsync est installé
rsync --version

# Si rsync est trouvé, utilisez dev-sync-safe.ps1
# Sinon, configurez l'authentification par clé SSH (Solution 1)
```

## Recommandation

**Pour un workflow de développement optimal :**
1. Configurez l'authentification par clé SSH (Solution 1) → Aucun mot de passe à taper
2. Le script utilisera rsync automatiquement si disponible → Transferts plus rapides
3. Utilisez `npm run watch` dans le terminal pour recompiler automatiquement le frontend

## Dépannage

### "Permission denied (publickey)"
- Vérifiez que la clé publique est bien dans `~/.ssh/authorized_keys` sur HA
- Vérifiez les permissions : `chmod 600 ~/.ssh/authorized_keys`

### "rsync: command not found"
- Installez rsync avec `winget install rsync`
- OU configurez l'authentification par clé SSH pour éviter d'avoir besoin de rsync

### "MAC error" ou "no matching MAC"
- C'est déjà corrigé dans le script avec `-o MACs=hmac-sha2-512-etm@openssh.com`
