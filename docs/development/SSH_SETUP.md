# Configuration SSH pour Windows → Home Assistant

## Problème
Le script de synchronisation demande le mot de passe à chaque transfert de fichier.

## Solution Recommandée : Authentification par clé SSH

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

**Option A - Via l'add-on SSH** (si vous utilisez l'add-on SSH & Web Terminal) :
1. Ouvrez l'interface de l'add-on SSH dans Home Assistant
2. Allez dans Configuration
3. Ajoutez votre clé publique dans la section "Authorized Keys"
4. Redémarrez l'add-on

**Option B - Via SSH direct** (si vous avez un accès root) :
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

Si ça fonctionne, vous pouvez maintenant utiliser les scripts sans mot de passe !

## Alternative : Utiliser rsync

Le script utilise `rsync` qui ne demande le mot de passe qu'**une seule fois** par synchronisation.

### Installer rsync sur Windows

```powershell
# Via winget (Windows 10/11)
winget install rsync

# OU via Chocolatey
choco install rsync

# OU via Git Bash (si Git est installé)
# rsync est déjà inclus dans Git Bash
```

## Vérifier la configuration

```powershell
# Tester si rsync est installé
rsync --version

# Tester la connexion SSH sans mot de passe
ssh root@homeassistant "echo 'OK'"
```

## Dépannage

### "Permission denied (publickey)"
- Vérifiez que la clé publique est bien dans `~/.ssh/authorized_keys` sur HA
- Vérifiez les permissions : `chmod 600 ~/.ssh/authorized_keys`

### "rsync: command not found"
- Installez rsync avec `winget install rsync`
- OU configurez l'authentification par clé SSH

### "MAC error" ou "no matching MAC"
- Utilisez l'option `-o MACs=hmac-sha2-512-etm@openssh.com` dans vos commandes SSH
- C'est déjà configuré dans les scripts dev-sync.ps1
