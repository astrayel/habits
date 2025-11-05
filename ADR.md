# Architecture Decision Records (ADR)

> **Documentation des décisions architecturales importantes du projet**

---

## ADR-001 : Format des cosmétiques (2025-11-04)

### Contexte
Les avatars personnalisables nécessitent un système de superposition de couches (photo de base + vêtements + accessoires + pet).

### Décision
**Utiliser des images PNG avec transparence** plutôt que des SVG.

### Raisons
- Affichage plus joli et professionnel
- Plus extensible (facile d'ajouter de nouveaux items)
- La transparence PNG permet les couches
- Plus simple pour créer/importer des assets
- Meilleure compatibilité navigateurs pour effets visuels

### Conséquences
- Nécessite un catalogue d'images PNG organisé
- Taille des assets à optimiser (compression PNG)
- Système de couches à implémenter en CSS (z-index)
- Prévoir un dossier `assets/avatars/` structuré par catégorie

### Statut
✅ **VALIDÉ**

---

## ADR-002 : Notifications Home Assistant (2025-11-04)

### Contexte
Les enfants peuvent oublier leurs tâches. Faut-il ajouter des rappels automatiques ?

### Décision
**OUI - Ajouter des notifications Home Assistant persistantes** pour rappeler les tâches à faire.

### Raisons
- Améliore l'engagement des enfants
- Réduit la charge mentale des parents (pas besoin de rappeler)
- Intégration native avec HA (notifications mobiles, TTS, etc.)
- Configurable (parents peuvent activer/désactiver)

### Implémentation
- Notifications pour parents : "Emma a marqué une tâche complétée" (validation en attente)
- Notifications pour enfants : "Rappel : Ranger ta chambre avant 18h" (X heures avant deadline)
- À implémenter en **Phase 13 (Optimisations et finitions)**

### Conséquences
- Service de notifications à créer dans le backend
- Configuration des notifications dans la carte de gestion
- Utiliser `persistent_notification.create` de HA

### Statut
✅ **VALIDÉ** - Implémentation Phase 13

---

## ADR-003 : Multi-parent et droits de validation (2025-11-04)

### Contexte
Dans une famille, plusieurs adultes peuvent vouloir valider les tâches des enfants.

### Décision
**Tous les administrateurs Home Assistant peuvent valider les tâches.**

### Raisons
- Simplicité : pas de gestion complexe de rôles
- Utilise le système de permissions HA existant
- Flexibilité : tous les parents/adultes de confiance peuvent valider

### Implémentation
- Vérifier `hass.user.is_admin` dans les handlers de services
- Enregistrer l'ID de l'utilisateur HA qui a validé (traçabilité)
- Afficher le nom du validateur dans l'historique

### Conséquences
- Tous les admins HA ont les mêmes droits sur l'intégration
- Traçabilité : on sait qui a validé quoi
- Pas de notion de "parent principal" ou "parent secondaire"

### Statut
✅ **VALIDÉ**

---

## ADR-004 : Authentification enfant/parent (2025-11-04)

### Contexte
Comment différencier un enfant d'un parent dans l'interface ?

### Décision
**Utiliser la sélection d'utilisateur Home Assistant simple, sans système de PIN.**

### Raisons
- Principe de confiance : on ne part pas du principe que les enfants vont tricher
- Simplicité d'implémentation et d'utilisation
- Utilise le système d'utilisateurs HA existant
- Expérience utilisateur fluide (pas de PIN à taper à chaque fois)

### Implémentation
- **Carte enfant** : Sélecteur d'utilisateur (enfant) au lancement
  - Liste déroulante avec les enfants configurés
  - Stockage LocalStorage du dernier enfant sélectionné
  - Pas de PIN, juste une sélection

- **Carte supervision/gestion** : Réservée aux admins HA
  - Vérification `hass.user.is_admin`
  - Message d'erreur si utilisateur non-admin

### Conséquences
- Enfants peuvent théoriquement se faire passer pour un autre enfant
- → Accepté car basé sur la confiance familiale
- Parents doivent valider les tâches de toute façon
- Interface plus simple et rapide à utiliser

### Statut
✅ **VALIDÉ**

---

## ADR-005 : Internationalisation (i18n) (2025-11-04)

### Contexte
Faut-il supporter plusieurs langues dès le début ?

### Décision
**NON - Français uniquement pour la v0.1 et MVP.**

### Raisons
- Simplicité de développement (pas de gestion de traductions)
- Focus sur les fonctionnalités principales
- Public cible français initialement
- i18n peut être ajouté en v1.0 si besoin

### Conséquences
- Tous les textes en dur en français
- Structure du code à prévoir pour faciliter i18n future :
  - Textes séparés dans des constantes
  - Pas de texte en dur dans les templates
  - Prévoir `src/locales/fr.ts` même si seul le français est implémenté

### Évolution future
- Version 1.0 : Support EN + FR si demande communautaire
- Utiliser `lit-localize` ou solution similaire

### Statut
✅ **VALIDÉ** - FR uniquement en MVP

---

## ADR-006 : Système de pénalités (2025-11-04)

### Contexte
Comment gérer les tâches non faites dans les temps ?

### Décision
**Pénalités en attente de validation parent** (workflow flexible).

### Workflow validé
1. Tâche non faite à l'heure limite → statut `failed` automatique
2. Pénalité en attente de validation parent (comme une tâche à valider)
3. Parent peut :
   - **Approuver** → perte de points/pièces
   - **Annuler** → pas de perte (circonstances atténuantes)

### Raisons
- Flexibilité : le parent garde le contrôle
- Évite les frustrations injustes (enfant malade, imprévu, etc.)
- Responsabilise le parent dans la décision
- Cohérent avec le workflow de validation des tâches complétées

### Conséquences
- Les pénalités ne sont jamais automatiques (toujours validation)
- File d'attente de validation inclut tâches ET pénalités
- Interface supervision doit clairement différencier les deux

### Statut
✅ **VALIDÉ**

---

## ADR-007 : Niveau de gamification (2025-11-04)

### Contexte
Quel niveau de gamification pour motiver des enfants de 10-14 ans ?

### Décision
**Gamification équilibrée** avec :
- ✅ Niveaux + XP (progression RPG)
- ✅ Streaks avec bonus progressifs (à la Duolingo)
- ✅ Badges de réussite automatiques
- ✅ Deux monnaies (Points + Pièces)
- ✅ Avatar personnalisable
- ✅ Animations de célébration

### Raisons
- Adapté à la tranche d'âge 10-14 ans
- Équilibre entre simplicité et richesse
- Inspiré de systèmes prouvés (Habitica, Duolingo)
- Suffisamment riche pour engagement long terme
- Pas trop complexe pour comprendre facilement

### Conséquences
- Développement en 2 temps :
  - **MVP (Phases 1-6)** : Tâches, validation, progression basique
  - **Gamification complète (Phases 7-12)** : Cosmétiques, badges, animations

### Statut
✅ **VALIDÉ**

---

## ADR-008 : Stratégie de développement MVP (2025-11-04)

### Contexte
Développer tout d'un coup ou par itérations ?

### Décision
**MVP simple d'abord (Phases 1-6), puis gamification complète.**

### Phases MVP (priorité HAUTE)
1. Backend Core
2. Validation et Récompenses
3. Frontend Base
4. Carte de gestion
5. Carte de supervision
6. Carte enfant (basique, sans cosmétiques)

### Phases gamification (priorité MOYENNE/BASSE)
7. Cosmétiques Backend
8. Cosmétiques Frontend
9. Boutique de récompenses
10. Système de badges
11. Animations
12. Cosmétiques avancés
13. Optimisations et finitions

### Raisons
- **Validation rapide** du concept avec les enfants
- **Feedback utilisateur** avant d'investir dans les cosmétiques
- **Réduction des risques** : si le système de base ne fonctionne pas, on n'a pas perdu de temps
- **Motivation progressive** : les enfants voient les nouvelles fonctionnalités arriver

### Conséquences
- MVP fonctionnel en ~13-15 jours
- Test en conditions réelles possible rapidement
- Cosmétiques ajoutés après validation du système de base

### Statut
✅ **VALIDÉ**

---

## ADR-009 : Structure du catalogue de cosmétiques (2025-11-04)

### Contexte
Organisation des assets PNG pour les cosmétiques.

### Décision
**Structure de dossiers par catégorie et sous-catégorie.**

### Structure des assets
```
www/habits-manager/assets/avatars/
├── base/
│   └── default_avatar.png          # Avatar par défaut si pas de photo
├── clothes/
│   ├── shirts/
│   │   ├── tshirt_pirate.png
│   │   ├── tshirt_superhero.png
│   │   └── ...
│   ├── pants/
│   │   ├── jeans_blue.png
│   │   └── ...
│   └── full_outfits/
│       ├── pirate_complete.png
│       └── ...
├── accessories/
│   ├── hats/
│   │   ├── pirate_hat.png
│   │   └── wizard_hat.png
│   ├── glasses/
│   │   └── sunglasses.png
│   └── jewelry/
│       └── star_necklace.png
├── pets/
│   ├── dogs/
│   │   ├── golden_retriever.png
│   │   └── ...
│   ├── cats/
│   │   ├── black_cat.png
│   │   └── ...
│   └── fantasy/
│       ├── mini_dragon.png
│       └── ...
└── animations/
    ├── sparkles.png                # Frames ou Lottie
    ├── aura_gold.png
    └── ...
```

### Spécifications techniques
- **Format** : PNG avec transparence (alpha channel)
- **Résolution recommandée** : 512x512 px (haute qualité)
- **Optimisation** : Compression PNG (TinyPNG ou similaire)
- **Nommage** : `snake_case.png`

### Catalogue de démarrage (MVP)
Au minimum pour Phase 8 :
- 5 vêtements (shirts/pants)
- 3 accessoires (hat/glasses)
- 3 pets (dog/cat/dragon)
- 3 thèmes de carte

### Statut
✅ **VALIDÉ**

---

## Résumé des décisions

| ADR | Sujet | Décision | Phase impactée |
|-----|-------|----------|----------------|
| 001 | Format cosmétiques | PNG avec transparence | Phase 7-8 |
| 002 | Notifications | Oui, en Phase 13 | Phase 13 |
| 003 | Multi-parent | Tous les admins HA | Phases 2, 5 |
| 004 | Authentification | Sélection user HA simple | Phases 5, 6 |
| 005 | i18n | FR uniquement (MVP) | Toutes |
| 006 | Pénalités | Validation parent | Phase 2 |
| 007 | Gamification | Équilibrée | Phases 7-12 |
| 008 | Stratégie MVP | Phases 1-6 d'abord | Toutes |
| 009 | Catalogue cosmétiques | Structure par catégorie | Phase 7-8 |

---

## Prochaines décisions à prendre (futures)

Ces questions seront traitées pendant le développement :

1. **Système de quêtes** (enchaînement de tâches) → Version 2.0 ?
2. **Mode compétition** entre enfants → À valider après MVP
3. **Intégration routeur** pour temps d'écran automatique → Version 1.0 ?
4. **Application mobile dédiée** → Version 2.0 ?
5. **Marketplace communautaire** de cosmétiques → Version 2.0 ?

---

**Document vivant - Dernière mise à jour : 2025-11-04**
