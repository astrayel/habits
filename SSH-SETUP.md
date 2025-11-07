# Configuration SSH pour Home Assistant (Windows)

Guide pour configurer l'accès SSH depuis Windows vers Home Assistant.

## 📋 Prérequis

- Windows 10/11 (OpenSSH est inclus par défaut)
- Home Assistant avec l'add-on SSH activé
- Accès administrateur à HA

## 🔧 Étape 1 : Activer SSH sur Home Assistant

### Option A : Terminal & SSH Add-on (Recommandé)

1. Ouvrez Home Assistant dans votre navigateur
2. Allez dans **Configuration** → **Modules complémentaires** → **Boutique des modules complémentaires**
3. Cherchez et installez **"Terminal & SSH"** ou **"Advanced SSH & Web Terminal"**
4. Configurez le module :
   ```yaml
   # Configuration de base
   ssh:
     username: root
     password: votre_mot_de_passe_securise
     authorized_keys:
       - "votre_cle_publique_ssh_ici"  # Optionnel, voir étape 2
   ```
5. Démarrez le module

### Option B : SSH & Web Terminal (Alternative)

1. **Modules complémentaires** → Installer **"SSH & Web Terminal"**
2. Configuration :
   ```yaml
   authorized_keys:
     - "votre_cle_publique_ssh_ici"
   ```
3. Démarrer le module

## 🔑 Étape 2 : Configurer l'Authentification par Clé SSH (Recommandé)

L'authentification par clé est plus sécurisée et évite de taper le mot de passe à chaque fois.

### 2.1 Générer une clé SSH (Si vous n'en avez pas)

```powershell
# Ouvrir PowerShell
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Appuyez sur Entrée pour accepter le chemin par défaut
# Optionnel : Entrez une passphrase pour sécuriser la clé
```

Vos clés seront créées dans `C:\Users\VotreNom\.ssh\`

### 2.2 Copier la Clé Publique vers Home Assistant

**Méthode 1 : Via l'interface Web (Plus simple)**

1. Afficher votre clé publique :
   ```powershell
   type $env:USERPROFILE\.ssh\id_ed25519.pub
   ```

2. Copiez tout le texte affiché (commence par `ssh-ed25519`)

3. Dans Home Assistant :
   - Configuration du module SSH
   - Collez la clé dans le champ `authorized_keys:`
   ```yaml
   authorized_keys:
     - "ssh-ed25519 AAAAC3... votre-email@example.com"
   ```

4. Redémarrez le module SSH

**Méthode 2 : Via ssh-copy-id (Si disponible)**

```powershell
ssh-copy-id root@homeassistant
# Entrez le mot de passe quand demandé
```

### 2.3 Tester la Connexion

```powershell
ssh root@homeassistant "echo 'Connexion SSH OK !'"
```

✅ Si ça affiche "Connexion SSH OK !", c'est bon !

## 🌐 Étape 3 : Configurer le Nom d'Hôte (Optionnel)

Si `homeassistant` ne fonctionne pas, utilisez l'IP ou ajoutez-le au fichier hosts.

### Option A : Utiliser l'IP directement

```powershell
# Trouver l'IP de votre HA
# Dans HA : Configuration > Système > Réseau

# Tester avec l'IP
ssh root@192.168.1.XXX "echo 'OK'"

# Utiliser l'IP dans les scripts
.\dev-sync.ps1 -Host "192.168.1.XXX"
```

### Option B : Ajouter au fichier hosts

1. Ouvrir PowerShell en **Administrateur**

2. Éditer le fichier hosts :
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```

3. Ajouter à la fin :
   ```
   192.168.1.XXX   homeassistant
   ```
   (Remplacez par l'IP réelle de votre HA)

4. Sauvegarder et fermer

5. Tester :
   ```powershell
   ssh root@homeassistant "echo 'OK'"
   ```

## 🔒 Étape 4 : Sécurité (Optionnel mais recommandé)

### Désactiver l'authentification par mot de passe

Une fois l'authentification par clé configurée, désactivez le mot de passe :

Dans la configuration du module SSH :
```yaml
ssh:
  username: root
  password: ""  # Vide
  authorized_keys:
    - "ssh-ed25519 AAAAC3... votre-email@example.com"
password_authentication: false  # Important !
```

### Changer le port SSH (Si besoin)

```yaml
ssh:
  port: 22222  # Changer le port par défaut
```

Puis utilisez :
```powershell
ssh -p 22222 root@homeassistant
```

## 🐛 Résolution de Problèmes

### "ssh: Could not resolve hostname homeassistant"

**Cause :** Le nom d'hôte n'est pas résolu

**Solutions :**
1. Utilisez l'IP : `ssh root@192.168.1.XXX`
2. Ajoutez au fichier hosts (voir Étape 3)
3. Utilisez le hostname complet : `ssh root@homeassistant.local`

### "Permission denied (publickey,password)"

**Cause :** Authentification échouée

**Solutions :**
1. Vérifiez que la clé publique est bien copiée dans `authorized_keys:`
2. Vérifiez le mot de passe si vous utilisez l'authentification par mot de passe
3. Redémarrez le module SSH dans HA
4. Vérifiez les logs du module SSH

### "Connection refused" ou "Connection timed out"

**Cause :** Le serveur SSH n'est pas accessible

**Solutions :**
1. Vérifiez que le module SSH est démarré dans HA
2. Vérifiez l'IP de votre HA
3. Vérifiez le port (22 par défaut)
4. Vérifiez le pare-feu/routeur

### "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"

**Cause :** L'empreinte SSH a changé (HA réinstallé ou clé régénérée)

**Solution :**
```powershell
ssh-keygen -R homeassistant
# Ou avec l'IP
ssh-keygen -R 192.168.1.XXX
```

Puis reconnectez-vous normalement.

## 📝 Configuration SSH Avancée (Optionnel)

Créez un fichier de config SSH pour simplifier la connexion :

```powershell
# Créer/éditer le fichier config
notepad $env:USERPROFILE\.ssh\config
```

Ajoutez :
```
Host ha
    HostName homeassistant
    User root
    IdentityFile ~/.ssh/id_ed25519
    Port 22

Host ha-ip
    HostName 192.168.1.XXX
    User root
    IdentityFile ~/.ssh/id_ed25519
```

Maintenant vous pouvez simplement faire :
```powershell
ssh ha
```

## ✅ Vérification Finale

Une fois tout configuré, testez ces commandes :

```powershell
# Test de connexion
ssh root@homeassistant "echo 'SSH OK'"

# Test du système de fichiers
ssh root@homeassistant "ls /config"

# Test de redémarrage (optionnel)
ssh root@homeassistant "ha core info"
```

Si tout fonctionne, vous êtes prêt à utiliser les scripts de développement !

## 🚀 Prochaines Étapes

Consultez **QUICKSTART-DEV.md** pour commencer le développement.

## 📚 Ressources

- [Home Assistant SSH Add-on](https://github.com/hassio-addons/addon-ssh)
- [OpenSSH Documentation](https://www.openssh.com/)
- [Windows SSH Documentation](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)
