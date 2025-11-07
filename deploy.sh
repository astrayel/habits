#!/bin/bash
# Script de déploiement rapide vers Home Assistant
#
# Usage:
#   ./deploy.sh                                    # Copie les fichiers critiques uniquement
#   COPY_ALL=true ./deploy.sh                      # Copie tout le contenu du dossier
#
# Variables d'environnement:
#   HA_SSH_HOST      : IP/hostname du serveur HA (active le mode SSH)
#   HA_SSH_USER      : Utilisateur SSH (défaut: root)
#   HA_SSH_PATH      : Chemin config HA distant (défaut: /config)
#   HA_CONFIG_DIR    : Chemin config HA local (mode local)
#   COPY_ALL         : Copier tout le contenu (défaut: false)
#
# Exemples:
#   # Mode SSH avec fichiers critiques
#   export HA_SSH_HOST='192.168.1.100'
#   ./deploy.sh
#
#   # Mode SSH avec copie complète
#   export HA_SSH_HOST='192.168.1.100'
#   COPY_ALL=true ./deploy.sh
#
#   # Mode local
#   export HA_CONFIG_DIR='/mnt/c/homeassistant'
#   ./deploy.sh

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Déploiement Habits Manager vers Home Assistant${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
SOURCE_DIR="./custom_components/habits_manager"

# Option pour copier tout le contenu (défaut: non)
COPY_ALL="${COPY_ALL:-false}"

# Vérifier si on utilise SSH pour le déploiement
if [[ -n "${HA_SSH_HOST}" ]]; then
    # Mode SSH
    USE_SSH=true
    SSH_HOST="${HA_SSH_HOST}"
    SSH_USER="${HA_SSH_USER:-root}"
    TARGET_DIR="${HA_SSH_PATH:-/config}/custom_components/habits_manager"

    echo -e "${GREEN}✅ Mode SSH activé${NC}"
    echo -e "${BLUE}   Hôte: ${SSH_USER}@${SSH_HOST}${NC}"
    echo -e "${BLUE}   Chemin: ${TARGET_DIR}${NC}"
    if [[ "$COPY_ALL" == "true" ]]; then
        echo -e "${BLUE}   Mode: Copie complète${NC}"
    else
        echo -e "${BLUE}   Mode: Fichiers critiques uniquement${NC}"
    fi
    echo ""

    # Configurer la connexion SSH persistante pour éviter de redemander le mot de passe
    SSH_CONTROL_PATH="/tmp/ssh-deploy-habits-$$"
    SSH_OPTS="-o ControlMaster=auto -o ControlPath=$SSH_CONTROL_PATH -o ControlPersist=300"

    # Fonction pour fermer la connexion SSH à la fin
    cleanup_ssh() {
        if [ -S "$SSH_CONTROL_PATH" ]; then
            ssh -O exit -o ControlPath="$SSH_CONTROL_PATH" "${SSH_USER}@${SSH_HOST}" 2>/dev/null
        fi
    }
    trap cleanup_ssh EXIT

    # Tester la connexion SSH (ouvre la connexion persistante)
    echo -e "${YELLOW}🔌 Test de connexion SSH...${NC}"
    if ssh $SSH_OPTS -o ConnectTimeout=5 "${SSH_USER}@${SSH_HOST}" "echo 'OK'" &>/dev/null; then
        echo -e "${GREEN}✅ Connexion SSH réussie (connexion persistante établie)${NC}"
        echo ""
    else
        echo -e "${RED}❌ Impossible de se connecter à ${SSH_USER}@${SSH_HOST}${NC}"
        echo -e "${YELLOW}   Vérifiez que SSH est configuré et accessible${NC}"
        exit 1
    fi
else
    # Mode local/WSL
    USE_SSH=false

    if [[ -z "${HA_CONFIG_DIR}" ]]; then
        # Chemin par défaut (Docker/Linux natif)
        TARGET_DIR="/config/custom_components/habits_manager"

        # Si WSL est détecté, suggérer les options
        if grep -qi microsoft /proc/version 2>/dev/null; then
            echo -e "${YELLOW}⚠️  WSL détecté !${NC}"
            echo -e "${YELLOW}   Options de déploiement:${NC}"
            echo ""
            echo -e "${YELLOW}   1. Chemin local/réseau:${NC}"
            echo -e "${BLUE}      export HA_CONFIG_DIR='/mnt/c/path/to/homeassistant'${NC}"
            echo -e "${BLUE}      ./deploy.sh${NC}"
            echo ""
            echo -e "${YELLOW}   2. SSH (recommandé):${NC}"
            echo -e "${BLUE}      export HA_SSH_HOST='192.168.1.100'${NC}"
            echo -e "${BLUE}      export HA_SSH_USER='root'  # optionnel, défaut: root${NC}"
            echo -e "${BLUE}      export HA_SSH_PATH='/config'  # optionnel, défaut: /config${NC}"
            echo -e "${BLUE}      ./deploy.sh${NC}"
            echo ""
            read -p "Voulez-vous continuer avec le chemin par défaut /config ? (y/N) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${RED}Déploiement annulé.${NC}"
                echo -e "${YELLOW}Configurez HA_CONFIG_DIR ou HA_SSH_HOST et relancez.${NC}"
                exit 1
            fi
        fi
    else
        TARGET_DIR="${HA_CONFIG_DIR}/custom_components/habits_manager"
        echo -e "${GREEN}✅ Mode local - Chemin: ${HA_CONFIG_DIR}${NC}"
        if [[ "$COPY_ALL" == "true" ]]; then
            echo -e "${BLUE}   Mode: Copie complète${NC}"
        else
            echo -e "${BLUE}   Mode: Fichiers critiques uniquement${NC}"
        fi
        echo ""
    fi
fi

# Fichiers critiques à copier
FILES=(
    "__init__.py"
    "const.py"
    "services.yaml"
    "sensor.py"
    "managers/cosmetic_manager.py"
    "www/habits-manager-card.js"
    "www/habits-child-card.js"
    "www/habits-supervision-card.js"
)

# Vérifier que le dossier source existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Erreur : Dossier source introuvable : $SOURCE_DIR${NC}"
    exit 1
fi

if [[ "$USE_SSH" == true ]]; then
    # Mode SSH - Vérifier que le dossier cible existe
    echo -e "${YELLOW}🔍 Vérification du dossier distant...${NC}"
    if ! ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "[ -d '$TARGET_DIR' ]"; then
        echo -e "${YELLOW}⚠️  Le dossier n'existe pas, création...${NC}"
        ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "mkdir -p '$TARGET_DIR'"
    fi

    # Créer un backup distant (en dehors de custom_components pour éviter les erreurs d'import)
    BACKUP_BASE="${HA_SSH_PATH:-/config}/backups"
    ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "mkdir -p '$BACKUP_BASE'" 2>/dev/null
    BACKUP_DIR="$BACKUP_BASE/habits_manager.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}📦 Création d'un backup distant : $BACKUP_DIR${NC}"
    ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "cp -r '$TARGET_DIR' '$BACKUP_DIR'"
    echo -e "${GREEN}✅ Backup créé${NC}"
    echo ""

    if [[ "$COPY_ALL" == "true" ]]; then
        # Copier tout le contenu via rsync/scp
        echo -e "${BLUE}📋 Copie complète du dossier via rsync...${NC}"
        if command -v rsync &> /dev/null; then
            if rsync -az --delete -e "ssh $SSH_OPTS" "$SOURCE_DIR/" "${SSH_USER}@${SSH_HOST}:$TARGET_DIR/"; then
                echo -e "${GREEN}✅ Copie complète réussie${NC}"
                COPIED=1
                FAILED=0
            else
                echo -e "${RED}❌ Erreur lors de la copie complète${NC}"
                COPIED=0
                FAILED=1
            fi
        else
            echo -e "${YELLOW}⚠️  rsync non disponible, utilisation de scp -r${NC}"
            if scp -q -r $SSH_OPTS "$SOURCE_DIR/"* "${SSH_USER}@${SSH_HOST}:$TARGET_DIR/"; then
                echo -e "${GREEN}✅ Copie complète réussie${NC}"
                COPIED=1
                FAILED=0
            else
                echo -e "${RED}❌ Erreur lors de la copie complète${NC}"
                COPIED=0
                FAILED=1
            fi
        fi
    else
        # Copier uniquement les fichiers spécifiés
        echo -e "${BLUE}📋 Copie des fichiers sélectionnés via SSH...${NC}"
        COPIED=0
        FAILED=0

        for file in "${FILES[@]}"; do
            SOURCE_FILE="$SOURCE_DIR/$file"
            TARGET_FILE="$TARGET_DIR/$file"

            if [ -f "$SOURCE_FILE" ]; then
                # Créer le dossier parent si nécessaire
                TARGET_DIR_PARENT=$(dirname "$TARGET_FILE")
                ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "mkdir -p '$TARGET_DIR_PARENT'" 2>/dev/null

                echo -n "  Copie de $file... "
                if scp -q $SSH_OPTS "$SOURCE_FILE" "${SSH_USER}@${SSH_HOST}:$TARGET_FILE"; then
                    echo -e "${GREEN}✅${NC}"
                    ((COPIED++))
                else
                    echo -e "${RED}❌${NC}"
                    ((FAILED++))
                fi
            else
                echo -e "  ${YELLOW}⚠️  $file non trouvé dans la source${NC}"
            fi
        done
    fi
else
    # Mode local - Vérifier que le dossier cible existe
    if [ ! -d "$TARGET_DIR" ]; then
        echo -e "${YELLOW}⚠️  Le dossier cible n'existe pas : $TARGET_DIR${NC}"
        echo -e "${YELLOW}   Création du dossier...${NC}"
        mkdir -p "$TARGET_DIR"
    fi

    # Créer un backup local (en dehors de custom_components pour éviter les erreurs d'import)
    if [[ -n "${HA_CONFIG_DIR}" ]]; then
        BACKUP_BASE="${HA_CONFIG_DIR}/backups"
    else
        BACKUP_BASE="/config/backups"
    fi
    mkdir -p "$BACKUP_BASE" 2>/dev/null
    BACKUP_DIR="$BACKUP_BASE/habits_manager.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}📦 Création d'un backup : $BACKUP_DIR${NC}"
    cp -r "$TARGET_DIR" "$BACKUP_DIR"
    echo -e "${GREEN}✅ Backup créé${NC}"
    echo ""

    if [[ "$COPY_ALL" == "true" ]]; then
        # Copier tout le contenu
        echo -e "${BLUE}📋 Copie complète du dossier...${NC}"
        if rsync -a --delete "$SOURCE_DIR/" "$TARGET_DIR/" 2>/dev/null; then
            echo -e "${GREEN}✅ Copie complète réussie${NC}"
            COPIED=1
            FAILED=0
        elif cp -r "$SOURCE_DIR/"* "$TARGET_DIR/"; then
            echo -e "${GREEN}✅ Copie complète réussie${NC}"
            COPIED=1
            FAILED=0
        else
            echo -e "${RED}❌ Erreur lors de la copie complète${NC}"
            COPIED=0
            FAILED=1
        fi
    else
        # Copier uniquement les fichiers spécifiés
        echo -e "${BLUE}📋 Copie des fichiers sélectionnés...${NC}"
        COPIED=0
        FAILED=0

        for file in "${FILES[@]}"; do
            SOURCE_FILE="$SOURCE_DIR/$file"
            TARGET_FILE="$TARGET_DIR/$file"

            if [ -f "$SOURCE_FILE" ]; then
                # Créer le dossier parent si nécessaire
                TARGET_DIR_PARENT=$(dirname "$TARGET_FILE")
                if [ ! -d "$TARGET_DIR_PARENT" ]; then
                    mkdir -p "$TARGET_DIR_PARENT"
                fi

                echo -n "  Copie de $file... "
                if cp "$SOURCE_FILE" "$TARGET_FILE"; then
                    echo -e "${GREEN}✅${NC}"
                    ((COPIED++))
                else
                    echo -e "${RED}❌${NC}"
                    ((FAILED++))
                fi
            else
                echo -e "  ${YELLOW}⚠️  $file non trouvé dans la source${NC}"
            fi
        done
    fi
fi

echo ""
echo -e "${GREEN}✅ $COPIED fichier(s) copié(s)${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ $FAILED erreur(s)${NC}"
fi
echo ""

# Vérifications post-déploiement
echo -e "${BLUE}🔍 Vérifications...${NC}"

if [[ "$USE_SSH" == true ]]; then
    # Vérifications via SSH
    if ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "grep -q 'SERVICE_LIST_CHILDREN' '$TARGET_DIR/const.py'"; then
        echo -e "${GREEN}✅ const.py contient SERVICE_LIST_CHILDREN${NC}"
    else
        echo -e "${RED}❌ ERREUR : SERVICE_LIST_CHILDREN introuvable dans const.py !${NC}"
    fi

    if ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "grep -q 'if reqs_data and isinstance(reqs_data, dict):' '$TARGET_DIR/managers/cosmetic_manager.py'"; then
        echo -e "${GREEN}✅ cosmetic_manager.py contient le fix NoneType${NC}"
    else
        echo -e "${YELLOW}⚠️  Fix NoneType non trouvé dans cosmetic_manager.py${NC}"
    fi

    if ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "grep -q 'Points (pénalité)' '$TARGET_DIR/www/habits-manager-card.js'"; then
        echo -e "${GREEN}✅ Frontend contient les champs de pénalité${NC}"
    else
        echo -e "${YELLOW}⚠️  Champs de pénalité non trouvés dans le frontend${NC}"
    fi

    if ssh $SSH_OPTS "${SSH_USER}@${SSH_HOST}" "grep -q 'background: transparent' '$TARGET_DIR/www/habits-manager-card.js'"; then
        echo -e "${GREEN}✅ Boutons annuler utilisent le style outlined${NC}"
    else
        echo -e "${YELLOW}⚠️  Style outlined non trouvé pour les boutons${NC}"
    fi
else
    # Vérifications locales
    if grep -q "SERVICE_LIST_CHILDREN" "$TARGET_DIR/const.py"; then
        echo -e "${GREEN}✅ const.py contient SERVICE_LIST_CHILDREN${NC}"
    else
        echo -e "${RED}❌ ERREUR : SERVICE_LIST_CHILDREN introuvable dans const.py !${NC}"
    fi

    if grep -q "if reqs_data and isinstance(reqs_data, dict):" "$TARGET_DIR/managers/cosmetic_manager.py"; then
        echo -e "${GREEN}✅ cosmetic_manager.py contient le fix NoneType${NC}"
    else
        echo -e "${YELLOW}⚠️  Fix NoneType non trouvé dans cosmetic_manager.py${NC}"
    fi

    if grep -q "Points (pénalité)" "$TARGET_DIR/www/habits-manager-card.js"; then
        echo -e "${GREEN}✅ Frontend contient les champs de pénalité${NC}"
    else
        echo -e "${YELLOW}⚠️  Champs de pénalité non trouvés dans le frontend${NC}"
    fi

    if grep -q "background: transparent" "$TARGET_DIR/www/habits-manager-card.js"; then
        echo -e "${GREEN}✅ Boutons annuler utilisent le style outlined${NC}"
    else
        echo -e "${YELLOW}⚠️  Style outlined non trouvé pour les boutons${NC}"
    fi
fi

echo ""

# Afficher les instructions de redémarrage
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes :${NC}"
echo ""
echo -e "  1. ${YELLOW}Redémarrer Home Assistant${NC}"
if [[ "$USE_SSH" == true ]]; then
    echo -e "     Via SSH :     ${BLUE}ssh ${SSH_USER}@${SSH_HOST} 'ha core restart'${NC}"
    echo -e "     Ou Docker :   ${BLUE}ssh ${SSH_USER}@${SSH_HOST} 'docker restart homeassistant'${NC}"
else
    echo -e "     Docker :      ${BLUE}docker restart homeassistant${NC}"
    echo -e "     Core :        ${BLUE}systemctl restart home-assistant@homeassistant${NC}"
    echo -e "     Supervised :  ${BLUE}ha core restart${NC}"
fi
echo ""
echo -e "  2. ${YELLOW}Vérifier les logs${NC}"
if [[ "$USE_SSH" == true ]]; then
    echo -e "     ${BLUE}ssh ${SSH_USER}@${SSH_HOST} 'tail -f /config/home-assistant.log | grep habits_manager'${NC}"
else
    echo -e "     ${BLUE}tail -f /config/home-assistant.log | grep habits_manager${NC}"
fi
echo ""
echo -e "  3. ${YELLOW}Logs attendus au démarrage :${NC}"
echo -e "     ${GREEN}✅ Registered 23 services for habits_manager${NC}"
echo -e "     ${GREEN}✅ Created 18 sensor entities for 2 children + 2 global sensors${NC}"
echo ""
echo -e "  4. ${YELLOW}Tester un service manuellement${NC}"
echo -e "     Outils de dev > Services :"
echo -e "     ${BLUE}service: habits_manager.list_children${NC}"
echo -e "     ${BLUE}data: {}${NC}"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💾 Backup disponible dans : $BACKUP_DIR${NC}"
echo ""
