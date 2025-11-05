# Guide de démarrage rapide - Gestionnaire de Tâches/Habitudes

> **Bienvenue !** Ce guide vous permet de démarrer rapidement le développement du projet.

---

## Pour commencer

### 1. Lire les documents de référence (OBLIGATOIRE)

Avant de coder quoi que ce soit, lis ces documents dans cet ordre :

1. **README.md** : Vue d'ensemble du projet
2. **architecture.md** : Architecture complète (ESSENTIEL)
3. **DATAMODELS.md** : Modèles de données backend ↔ frontend
4. **AGENTS.md** : Définitions des agents et leurs responsabilités

⏱️ Temps de lecture estimé : 30-45 minutes

### 2. Identifier ton rôle

Quel agent es-tu ?

- **Agent Architecte** → Tu coordonnes tout, tu valides les phases
- **Agent Backend Developer** → Tu codes l'intégration Python HA
- **Agent Frontend Base** → Tu crées l'infrastructure frontend
- **Agent Frontend Supervision** → Tu codes les cartes gestion et supervision
- **Agent Frontend Child** → Tu codes la carte enfant et cosmétiques
- **Agent QA/Reviewer** → Tu testes et valides

📄 Consulte `AGENTS.md` pour ton prompt d'initialisation.

### 3. Identifier ta phase actuelle

Consulte le **plan de mise en œuvre** dans `architecture.md` section 8.

Les phases sont numérotées de 1 à 13, par ordre de priorité.

**Phase actuelle du projet :** Phase 1 (Backend Core)

---

## Démarrage par agent

### Agent Architecte

**Ton premier rôle :** Coordonner le démarrage

1. Vérifier que tous les documents sont complets
2. Assigner la Phase 1 à l'agent backend
3. S'assurer que l'agent backend a tout compris
4. Suivre l'avancement et répondre aux questions

**Checklist de démarrage :**
- [ ] Tous les documents créés (architecture.md, DATAMODELS.md, AGENTS.md)
- [ ] Phase 1 assignée à agent-backend-dev
- [ ] Agent backend a confirmé compréhension
- [ ] Communication ouverte pour questions

---

### Agent Backend Developer

**Ta première tâche :** Phase 1 - Backend Core

#### Étape 1 : Créer la structure de fichiers

```bash
mkdir -p custom_components/habits_manager
cd custom_components/habits_manager

# Créer la structure
mkdir -p core storage managers services
touch __init__.py manifest.json const.py
touch core/{__init__.py,models.py,exceptions.py,validators.py}
touch storage/{__init__.py,storage_manager.py,entity_manager.py}
touch managers/{__init__.py,child_manager.py,task_manager.py,habit_manager.py}
touch services/{__init__.py,points_calculator.py,streak_calculator.py,level_calculator.py}
touch sensor.py
```

#### Étape 2 : Créer manifest.json

```json
{
  "domain": "habits_manager",
  "name": "Habits Manager",
  "documentation": "https://github.com/user/habits",
  "requirements": [],
  "codeowners": ["@user"],
  "version": "0.1.0",
  "iot_class": "calculated"
}
```

#### Étape 3 : Créer const.py

Copie les constantes depuis `DATAMODELS.md` section "Constantes".

#### Étape 4 : Implémenter les modèles (core/models.py)

Copie les dataclasses Python depuis `DATAMODELS.md`.

**IMPORTANT :** Ajoute toujours les imports nécessaires :
```python
from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional
from enum import Enum
```

#### Étape 5 : Implémenter storage_manager.py

Fonctions à créer :
- `load_json(filename)` → charge un fichier JSON
- `save_json(filename, data)` → sauvegarde un fichier JSON
- `get_children()` → récupère liste d'enfants
- `save_child(child)` → sauvegarde un enfant

#### Étape 6 : Implémenter child_manager.py

Méthodes à créer (voir architecture.md section 4.2.1) :
- `create_child(name, person_entity)`
- `update_points(child_id, points, coins, xp)`
- `add_badge(child_id, badge_id)`
- etc.

#### Étape 7 : Implémenter les services HA (__init__.py)

```python
async def async_setup(hass, config):
    """Setup de l'intégration"""

    # Enregistrer les services
    hass.services.async_register(
        DOMAIN,
        'create_child',
        handle_create_child
    )

    return True
```

#### Checklist Phase 1

Avant de soumettre à QA :
- [ ] Tous les fichiers créés selon architecture
- [ ] Modèles de données implémentés (core/models.py)
- [ ] StorageManager fonctionne (tests manuels)
- [ ] ChildManager implémenté
- [ ] TaskManager implémenté
- [ ] HabitManager implémenté
- [ ] Services HA enregistrés
- [ ] Entités sensor créées pour chaque enfant
- [ ] Code documenté (docstrings partout)
- [ ] Testé manuellement via Developer Tools

**Soumettre à :** agent-qa-reviewer

---

### Agent Frontend Base

**Ta première tâche :** Phase 3 - Frontend Base

⚠️ **ATTENTION :** Phase 3 ne peut commencer que si Phase 1 ET 2 sont validées.

#### Étape 1 : Créer la structure

```bash
mkdir -p www/habits-manager
cd www/habits-manager

# Initialiser npm
npm init -y
```

#### Étape 2 : Installer les dépendances

```bash
npm install --save lit
npm install --save-dev typescript rollup @rollup/plugin-node-resolve @rollup/plugin-typescript rollup-plugin-terser
npm install --save-dev @types/node
npm install --save-dev eslint prettier
```

#### Étape 3 : Créer tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "experimentalDecorators": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### Étape 4 : Créer rollup.config.js

```javascript
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/habits-manager.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    typescript(),
    terser(),
  ],
};
```

#### Étape 5 : Créer la structure src/

```bash
mkdir -p src/{components/shared,services,styles/themes,types,utils}
```

#### Étape 6 : Créer les types (src/types/)

Copie tous les types TypeScript depuis `DATAMODELS.md`.

Fichiers à créer :
- `child.ts`
- `task.ts`
- `habit.ts`
- `reward.ts`
- `cosmetic.ts`
- `hass.ts` (types Home Assistant)

#### Étape 7 : Implémenter hass-service.ts

```typescript
export class HassService {
  constructor(private hass: any) {}

  async callService(service: string, data: any): Promise<any> {
    return this.hass.callService('habits_manager', service, data);
  }

  subscribeToEvents(callback: (event: any) => void): void {
    this.hass.connection.subscribeEvents(callback, 'habits_manager_update');
  }

  getEntity(entityId: string): any {
    return this.hass.states[entityId];
  }
}
```

#### Étape 8 : Créer les composants réutilisables

Ordre recommandé :
1. `ha-button.ts`
2. `ha-modal.ts`
3. `ha-list-item.ts`
4. `ha-progress-bar.ts`
5. `ha-icon-badge.ts`
6. `ha-card-base.ts`

**Template pour un composant Lit :**

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ha-button')
export class HaButton extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: var(--hm-primary-color);
      color: white;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`
      <button ?disabled=${this.disabled} @click=${this._handleClick}>
        ${this.icon ? html`<ha-icon icon=${this.icon}></ha-icon>` : ''}
        ${this.label}
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('click'));
  }
}
```

#### Étape 9 : Créer le thème par défaut

`src/styles/themes/default.ts` :

```typescript
import { css } from 'lit';

export const defaultTheme = css`
  :host {
    --hm-primary-color: #4CAF50;
    --hm-secondary-color: #2196F3;
    --hm-background-color: #FAFAFA;
    --hm-card-background: #FFFFFF;
    --hm-text-primary: #212121;
    --hm-text-secondary: #757575;
    --hm-success-color: #4CAF50;
    --hm-warning-color: #FF9800;
    --hm-error-color: #F44336;
    --hm-border-radius: 8px;
    --hm-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;
```

#### Étape 10 : Build et test

```bash
npm run build
```

Vérifier que `dist/habits-manager.js` est créé.

#### Checklist Phase 3

- [ ] Structure de fichiers créée
- [ ] Dependencies installées
- [ ] TypeScript build sans erreurs
- [ ] Tous les types définis (synchronisés avec DATAMODELS.md)
- [ ] hass-service.ts implémenté
- [ ] Tous les composants réutilisables créés et documentés
- [ ] Thème par défaut fonctionne
- [ ] Build Rollup sans erreurs

**Soumettre à :** agent-qa-reviewer

---

### Agent Frontend Supervision

**Tes premières tâches :** Phases 4 et 5

⚠️ **ATTENTION :** Ne peut commencer que si Phase 3 validée.

#### Phase 4 : Carte de gestion

1. Créer `src/cards/management-card.ts`
2. Créer les formulaires :
   - `src/components/tasks/task-form.ts`
   - `src/components/habits/habit-form.ts`
   - `src/components/rewards/reward-form.ts`
3. Créer les listes :
   - `src/components/tasks/task-list.ts`
   - `src/components/habits/habit-list.ts`
4. Intégrer dans la carte avec système d'onglets

#### Phase 5 : Carte de supervision

1. Créer `src/cards/supervisor-card.ts`
2. Créer `src/components/validation/validation-queue.ts`
3. Créer `src/components/validation/validation-modal.ts`
4. Créer `src/components/stats/stats-dashboard.ts`

**Consulte AGENTS.md pour détails et checklist.**

---

### Agent Frontend Child

**Tes premières tâches :** Phases 6, 8, 9

⚠️ **ATTENTION :** Phase 6 nécessite Phase 3 validée. Phases 8 et 9 nécessitent Phase 6 validée.

#### Phase 6 : Carte enfant basique

1. Créer `src/cards/child-card.ts`
2. Créer composants tâches/habitudes version enfant
3. Créer `src/components/stats/level-display.ts`
4. Intégrer le tout avec design adapté enfants

#### Phase 8 : Cosmétiques

1. Créer `src/components/cosmetics/avatar-viewer.ts`
2. Créer `src/components/cosmetics/avatar-editor.ts`
3. Créer `src/components/cosmetics/cosmetic-shop.ts`
4. Créer `src/components/cosmetics/theme-selector.ts`
5. Intégrer dans carte enfant

#### Phase 9 : Boutique récompenses

1. Créer `src/components/rewards/reward-shop.ts`
2. Créer `src/components/rewards/reward-card.ts`
3. Intégrer dans carte enfant
4. Intégrer approbation dans carte supervision

**Consulte AGENTS.md pour détails et checklist.**

---

### Agent QA/Reviewer

**Ton rôle :** Valider chaque phase avant passage à la suivante

#### Workflow

1. Attendre soumission d'un agent
2. Vérifier la checklist correspondante (voir AGENTS.md)
3. Tester manuellement toutes les fonctionnalités
4. Rédiger un rapport de validation
5. Envoyer le rapport à l'architecte
6. SI REFUSER : lister les corrections nécessaires

#### Tests manuels

**Pour backend :**
- Utiliser Developer Tools → Services dans Home Assistant
- Appeler chaque service manuellement
- Vérifier les entités créées
- Vérifier les fichiers JSON dans `.storage/habits_manager/`

**Pour frontend :**
- Ouvrir la carte dans Home Assistant
- Tester chaque interaction
- Vérifier les appels réseau (DevTools Network)
- Vérifier les erreurs console (DevTools Console)

**Format du rapport :** Voir AGENTS.md section "Agent QA/Reviewer".

---

## FAQ

### Q: Par où commencer si je suis perdu ?

**R:** Lis `architecture.md` en entier. C'est long mais essentiel.

### Q: Je ne comprends pas un modèle de données

**R:** Consulte `DATAMODELS.md`. Chaque modèle est défini en Python ET TypeScript.

### Q: J'ai un doute sur une décision technique

**R:** Demande IMMÉDIATEMENT à l'architecte. Ne devine jamais.

### Q: Je détecte une duplication de code

**R:** Signale-le immédiatement. La réutilisabilité est prioritaire.

### Q: Une phase dépend d'une autre non validée

**R:** STOP. Attends la validation de la phase précédente. Ne code jamais en aveugle.

### Q: Je vois un problème dans l'architecture

**R:** Excellente initiative ! Signale-le à l'architecte pour discussion.

### Q: Les types backend et frontend ne correspondent pas

**R:** C'est un problème grave. Signale-le immédiatement. `DATAMODELS.md` est la source de vérité.

---

## Commandes utiles

### Backend (Home Assistant)

```bash
# Recharger l'intégration
# Dans Home Assistant : Configuration → Serveur → Redémarrer

# Voir les logs
tail -f /config/home-assistant.log | grep habits_manager

# Tester un service via CLI
hass-cli service call habits_manager.create_child '{"name": "Emma", "person_entity": "person.emma"}'
```

### Frontend

```bash
# Installer dépendances
npm install

# Build de développement
npm run build

# Build de développement avec watch
npm run build:watch

# Linter
npm run lint

# Formater
npm run format
```

---

## Ressources

### Documentation officielle

- **Home Assistant Developer Docs :** https://developers.home-assistant.io/
- **Lit Documentation :** https://lit.dev/
- **TypeScript Handbook :** https://www.typescriptlang.org/docs/

### Exemples de code

- **Intégrations HA :** https://github.com/home-assistant/core/tree/dev/homeassistant/components
- **Cartes Lit pour HA :** https://github.com/custom-cards

---

## Prochaines étapes

1. **Architecte :** Assigne Phase 1 à agent-backend-dev
2. **Backend Dev :** Démarre Phase 1 (Backend Core)
3. **Tout le monde :** Lis l'architecture complète !

---

**Bon développement ! 🚀**

N'oublie pas : la communication est clé. Pose des questions, demande des validations, signale les problèmes tôt.

**Document vivant - Dernière mise à jour : 2025-11-04**
