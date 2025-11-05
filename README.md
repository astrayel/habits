# Gestionnaire de Tâches/Habitudes pour Home Assistant

> **Système gamifié de gestion de tâches et d'habitudes pour motiver les enfants**

[![Version](https://img.shields.io/badge/version-0.1.0--dev-blue)](https://github.com/user/habits)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue)](https://www.home-assistant.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Vue d'ensemble

Ce projet est un système complet de gestion de tâches et d'habitudes pour Home Assistant, conçu pour motiver les enfants (10-14 ans) via la gamification.

### Fonctionnalités principales

✅ **Tâches obligatoires et bonus** avec planification flexible
🔥 **Système d'habitudes** avec streaks à la Duolingo
🎁 **Deux types de récompenses :** réelles (temps d'écran, choix de repas) et cosmétiques
👕 **Personnalisation riche :** avatars, vêtements, accessoires, animaux, thèmes
⭐ **Système de progression :** niveaux, XP, badges
✔️ **Validation parentale :** contrôle complet sur les récompenses et pénalités
📊 **Supervision en temps réel :** tableaux de bord pour parents

---

## 🏗️ Architecture

Le projet se compose de :

- **Backend Python :** Intégration Home Assistant complète
- **Frontend Lit/Web Components :** 3 cartes interactives
  - **Carte de gestion :** Configuration complète (parents/admins)
  - **Carte de supervision :** Validation et monitoring (parents)
  - **Carte utilisateur :** Interface enfants (tâches, cosmétiques, boutiques)

### Principe architectural : Réutilisabilité maximale

Tous les composants sont conçus pour être réutilisables, évitant toute duplication de code.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ **Commencez ici !** Guide de démarrage rapide |
| **[architecture.md](architecture.md)** | 🏛️ Architecture complète et plan de mise en œuvre |
| **[DATAMODELS.md](DATAMODELS.md)** | 📊 Modèles de données (Python ↔ TypeScript) |
| **[AGENTS.md](AGENTS.md)** | 🤖 Définition des agents spécialisés |

---

## 🚀 Démarrage rapide

### Pour les nouveaux développeurs

1. **Lire la documentation** (dans cet ordre) :
   - `README.md` (ce fichier)
   - `QUICKSTART.md`
   - `architecture.md`

2. **Identifier votre rôle** :
   - Agent Architecte
   - Agent Backend Developer
   - Agent Frontend Developer (Base/Supervision/Child)
   - Agent QA/Reviewer

3. **Consulter votre prompt** dans `AGENTS.md`

4. **Commencer votre phase** selon le plan de mise en œuvre

### Pour l'utilisateur final (à venir)

_Installation et configuration détaillées seront disponibles lors de la version 1.0._

---

## 📦 Structure du projet

```
habits/
├── README.md                          # Ce fichier
├── QUICKSTART.md                      # Guide de démarrage rapide
├── architecture.md                    # Architecture complète
├── DATAMODELS.md                      # Modèles de données
├── AGENTS.md                          # Définition des agents
│
├── custom_components/                 # Backend (à créer)
│   └── habits_manager/
│       ├── __init__.py
│       ├── manifest.json
│       ├── const.py
│       ├── core/                      # Modèles de données
│       ├── storage/                   # Gestion du stockage
│       ├── managers/                  # Managers métier
│       ├── services/                  # Services calculateurs
│       └── sensor.py                  # Entités Home Assistant
│
└── www/                               # Frontend (à créer)
    └── habits-manager/
        ├── package.json
        ├── tsconfig.json
        ├── rollup.config.js
        └── src/
            ├── cards/                 # 3 cartes principales
            ├── components/            # Composants Lit
            ├── services/              # Services frontend
            ├── styles/                # Thèmes et animations
            ├── types/                 # Types TypeScript
            └── utils/                 # Utilitaires
```

---

## 🎯 Plan de mise en œuvre

Le projet est divisé en 13 phases, développées progressivement :

### Phases prioritaires (Backend)

1. ✅ **Phase 1 :** Backend Core (TERMINÉE - 2025-11-05)
2. ✅ **Phase 2 :** Validation et Récompenses (TERMINÉE - 2025-11-05)
3. ✅ **Phase 3 :** Frontend Base (TERMINÉE - 2025-11-05)

### Phases prioritaires (Frontend)

4. ⏳ **Phase 4 :** Carte de gestion
5. ⏳ **Phase 5 :** Carte de supervision
6. ⏳ **Phase 6 :** Carte enfant (basique)

### Phases cosmétiques et gamification

7. ⏳ **Phase 7 :** Cosmétiques Backend
8. ⏳ **Phase 8 :** Cosmétiques Frontend
9. ⏳ **Phase 9 :** Boutique de récompenses
10. ⏳ **Phase 10 :** Système de badges
11. ⏳ **Phase 11 :** Animations
12. ⏳ **Phase 12 :** Cosmétiques avancés
13. ⏳ **Phase 13 :** Optimisations et finitions

**Détails complets :** Voir `architecture.md` section 8.

---

## 🛠️ Technologies

### Backend
- **Python 3.11+**
- **Home Assistant 2024.1+**
- **Stockage :** JSON + Entités Home Assistant

### Frontend
- **Lit 3.x** (Web Components)
- **TypeScript** (mode strict)
- **Rollup** (bundler)
- **ESLint + Prettier**

---

## 👥 Équipe et agents

Ce projet utilise une approche multi-agents :

| Agent | Responsabilités |
|-------|-----------------|
| **Architecte** | Architecture, coordination, validation |
| **Backend Developer** | Intégration Python Home Assistant |
| **Frontend Base** | Infrastructure frontend, composants réutilisables |
| **Frontend Supervision** | Cartes gestion et supervision |
| **Frontend Child** | Carte enfant et système de cosmétiques |
| **QA/Reviewer** | Tests, validation, qualité |

**Plus de détails :** Voir `AGENTS.md`

---

## 🎮 Captures d'écran (à venir)

_Captures d'écran des cartes seront ajoutées au fur et à mesure du développement._

---

## 🤝 Contribution

### Pour les agents du projet

1. Lire **toute** la documentation avant de coder
2. Respecter les standards définis dans `architecture.md` section 10
3. Demander validation à l'architecte avant changements majeurs
4. Documenter tout le code (docstrings/JSDoc)
5. Soumettre à QA avant validation de phase

### Pour les contributeurs externes

_Les contributions externes seront ouvertes à partir de la version 1.0._

---

## 📝 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## ❓ FAQ

### Pourquoi ce projet ?

Motiver les enfants à accomplir leurs tâches et développer de bonnes habitudes, tout en donnant aux parents un outil de suivi et de récompense.

### Pourquoi Home Assistant ?

- Déjà installé dans de nombreux foyers
- Intégration facile avec d'autres systèmes (limitation de temps d'écran, etc.)
- Contrôle local et privé des données

### Quelle est la différence entre Points et Pièces ?

- **Points :** Monnaie pour acheter des récompenses réelles (temps d'écran, choix de repas, sorties)
- **Pièces :** Monnaie pour acheter des cosmétiques (vêtements d'avatar, thèmes, accessoires)

### Les enfants peuvent-ils tricher ?

Non, toutes les validations passent par les parents. Les enfants peuvent marquer une tâche "complétée", mais elle doit être validée par un parent avant que les récompenses soient attribuées.

### Peut-on perdre des points ?

Oui, si une tâche n'est pas faite dans les temps, une pénalité peut s'appliquer (définie dans la tâche). Mais cette pénalité doit aussi être validée par un parent, qui peut choisir de l'annuler.

### Les soldes peuvent-ils être négatifs ?

Non, les points et pièces ne descendent jamais en dessous de 0.

---

## 🔗 Liens utiles

- **Home Assistant :** https://www.home-assistant.io/
- **Lit Documentation :** https://lit.dev/
- **TypeScript Handbook :** https://www.typescriptlang.org/docs/
- **Material Design Icons :** https://pictogrammers.com/library/mdi/

---

## 🗺️ Roadmap

### Version 0.1.0 (MVP) - En développement

- [x] Architecture complète
- [x] Documentation technique
- [x] Backend core fonctionnel (Phase 1)
- [x] Système de validation et récompenses (Phase 2)
- [x] Tests automatisés backend (15/15 passent)
- [x] Infrastructure frontend (Phase 3)
- [x] Types TypeScript et API Client
- [ ] 3 cartes opérationnelles (implémentation complète)
- [ ] Système de cosmétiques frontend

### Version 0.2.0 - À venir

- [ ] Système de badges
- [ ] Animations avancées
- [ ] Catalogue de cosmétiques enrichi
- [ ] Tests automatisés

### Version 1.0.0 - Objectif

- [ ] Système complet et stable
- [ ] Documentation utilisateur
- [ ] Guide d'installation
- [ ] Catalogue de cosmétiques complet
- [ ] Optimisations de performance

---

## 📧 Contact

Pour toute question ou suggestion :

- **Issues :** https://github.com/user/habits/issues
- **Discussions :** https://github.com/user/habits/discussions

---

**Développé avec ❤️ pour motiver les enfants et faciliter la vie des parents.**

---

**Dernière mise à jour :** 2025-11-05
**Version :** 0.1.0-dev
**Statut :** Backend complet (Phase 1 & 2) ✅ | Infrastructure Frontend (Phase 3) ✅ | Cartes en cours (Phase 4+) ⏳
