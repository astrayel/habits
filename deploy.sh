#!/bin/bash
# Script de déploiement rapide vers Home Assistant

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
SOURCE_DIR="/home/user/habits/custom_components/habits_manager"

# Détecter si on est sous WSL et adapter le chemin cible
if [[ -z "${HA_CONFIG_DIR}" ]]; then
    # Chemin par défaut (Docker/Linux natif)
    TARGET_DIR="/config/custom_components/habits_manager"

    # Si WSL est détecté, suggérer de définir HA_CONFIG_DIR
    if grep -qi microsoft /proc/version 2>/dev/null; then
        echo -e "${YELLOW}⚠️  WSL détecté !${NC}"
        echo -e "${YELLOW}   Utilisez: export HA_CONFIG_DIR='/mnt/c/path/to/homeassistant/config'${NC}"
        echo -e "${YELLOW}   Ou le chemin réseau: export HA_CONFIG_DIR='/mnt/nas/homeassistant/config'${NC}"
        echo ""
        echo -e "${YELLOW}   Exemple complet:${NC}"
        echo -e "${BLUE}   export HA_CONFIG_DIR='/mnt/c/Users/YourName/homeassistant'${NC}"
        echo -e "${BLUE}   ./deploy.sh${NC}"
        echo ""
        read -p "Voulez-vous continuer avec le chemin par défaut /config ? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}Déploiement annulé.${NC}"
            echo -e "${YELLOW}Définissez HA_CONFIG_DIR et relancez le script.${NC}"
            exit 1
        fi
    fi
else
    TARGET_DIR="${HA_CONFIG_DIR}/custom_components/habits_manager"
    echo -e "${GREEN}✅ Utilisation du chemin personnalisé : ${HA_CONFIG_DIR}${NC}"
    echo ""
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

# Vérifier que le dossier cible existe
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}⚠️  Le dossier cible n'existe pas : $TARGET_DIR${NC}"
    echo -e "${YELLOW}   Création du dossier...${NC}"
    mkdir -p "$TARGET_DIR"
fi

# Créer un backup
BACKUP_DIR="/config/custom_components/habits_manager.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}📦 Création d'un backup dans : $BACKUP_DIR${NC}"
cp -r "$TARGET_DIR" "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup créé${NC}"
echo ""

# Copier les fichiers
echo -e "${BLUE}📋 Copie des fichiers modifiés...${NC}"
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

echo ""
echo -e "${GREEN}✅ $COPIED fichier(s) copié(s)${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ $FAILED erreur(s)${NC}"
fi
echo ""

# Vérifications post-déploiement
echo -e "${BLUE}🔍 Vérifications...${NC}"

# Vérifier const.py
if grep -q "SERVICE_LIST_CHILDREN" "$TARGET_DIR/const.py"; then
    echo -e "${GREEN}✅ const.py contient SERVICE_LIST_CHILDREN${NC}"
else
    echo -e "${RED}❌ ERREUR : SERVICE_LIST_CHILDREN introuvable dans const.py !${NC}"
fi

# Vérifier le fix NoneType dans cosmetic_manager.py
if grep -q "if reqs_data and isinstance(reqs_data, dict):" "$TARGET_DIR/managers/cosmetic_manager.py"; then
    echo -e "${GREEN}✅ cosmetic_manager.py contient le fix NoneType${NC}"
else
    echo -e "${YELLOW}⚠️  Fix NoneType non trouvé dans cosmetic_manager.py${NC}"
fi

# Vérifier les champs de pénalité dans le frontend
if grep -q "Points (pénalité)" "$TARGET_DIR/www/habits-manager-card.js"; then
    echo -e "${GREEN}✅ Frontend contient les champs de pénalité${NC}"
else
    echo -e "${YELLOW}⚠️  Champs de pénalité non trouvés dans le frontend${NC}"
fi

# Vérifier le style des boutons annuler
if grep -q "background: transparent" "$TARGET_DIR/www/habits-manager-card.js"; then
    echo -e "${GREEN}✅ Boutons annuler utilisent le style outlined${NC}"
else
    echo -e "${YELLOW}⚠️  Style outlined non trouvé pour les boutons${NC}"
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
echo -e "     Docker :      ${BLUE}docker restart homeassistant${NC}"
echo -e "     Core :        ${BLUE}systemctl restart home-assistant@homeassistant${NC}"
echo -e "     Supervised :  ${BLUE}ha core restart${NC}"
echo ""
echo -e "  2. ${YELLOW}Vérifier les logs${NC}"
echo -e "     ${BLUE}tail -f /config/home-assistant.log | grep habits_manager${NC}"
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
