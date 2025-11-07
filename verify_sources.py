#!/usr/bin/env python3
"""Script de vérification des sources Habits Manager.

Ce script vérifie que tous les sensors sont correctement créés
et affiche leur état actuel.
"""
import json
import os
from pathlib import Path


def main():
    """Vérifie les sources de l'intégration."""
    print("=" * 80)
    print("VÉRIFICATION DES SOURCES HABITS MANAGER")
    print("=" * 80)
    print()

    # 1. Vérifier le répertoire de stockage
    storage_dir = Path(".storage/habits_manager")

    print("📁 1. VÉRIFICATION DU STOCKAGE")
    print("-" * 80)
    if storage_dir.exists():
        print(f"✅ Répertoire de stockage trouvé: {storage_dir}")

        # Lister les fichiers
        files = list(storage_dir.glob("*.json"))
        print(f"   Fichiers trouvés: {len(files)}")
        for f in files:
            size = f.stat().st_size
            print(f"   - {f.name} ({size} bytes)")
    else:
        print(f"❌ Répertoire de stockage non trouvé: {storage_dir}")
        print("   L'intégration n'a probablement pas encore été initialisée.")
        return

    print()

    # 2. Charger et vérifier les enfants
    children_file = storage_dir / "children.json"

    print("👶 2. VÉRIFICATION DES ENFANTS")
    print("-" * 80)
    if children_file.exists():
        with open(children_file, 'r', encoding='utf-8') as f:
            children = json.load(f)

        print(f"✅ Fichier children.json trouvé")
        print(f"   Nombre d'enfants: {len(children)}")
        print()

        if not children:
            print("⚠️  Aucun enfant créé. Utilisez le service 'habits_manager.create_child' pour en créer un.")
            return

        # Afficher les détails de chaque enfant
        for child in children:
            print(f"   Enfant: {child.get('name', 'Unknown')}")
            print(f"   - ID: {child['id']}")
            print(f"   - Points: {child.get('points', 0)}")
            print(f"   - Coins: {child.get('coins', 0)}")
            print(f"   - Level: {child.get('level', 1)}")
            print(f"   - XP: {child.get('experience', 0)}/{child.get('experience_to_next_level', 100)}")
            print()

            # Vérifier les sensors attendus pour cet enfant
            child_id = child['id']
            print(f"   📊 Sensors attendus pour cet enfant:")
            expected_sensors = [
                f"sensor.habits_manager_{child_id}_points",
                f"sensor.habits_manager_{child_id}_coins",
                f"sensor.habits_manager_{child_id}_level",
                f"sensor.habits_manager_{child_id}_experience",
                f"sensor.habits_manager_{child_id}_tasks_pending",
                f"sensor.habits_manager_{child_id}_tasks_waiting",
                f"sensor.habits_manager_{child_id}_longest_streak",
                f"binary_sensor.habits_manager_{child_id}_has_pending_validation",
            ]

            for sensor in expected_sensors:
                print(f"      - {sensor}")

            print()
    else:
        print(f"❌ Fichier children.json non trouvé")
        return

    print()

    # 3. Vérifier les tâches
    tasks_file = storage_dir / "tasks.json"
    instances_file = storage_dir / "task_instances.json"

    print("📋 3. VÉRIFICATION DES TÂCHES")
    print("-" * 80)

    if tasks_file.exists():
        with open(tasks_file, 'r', encoding='utf-8') as f:
            tasks = json.load(f)
        print(f"✅ {len(tasks)} tâche(s) créée(s)")

        for task in tasks:
            print(f"   - {task.get('title', 'Unknown')} (ID: {task['id']})")
            print(f"     Active: {task.get('active', True)}")
            print(f"     Assignée à: {', '.join(task.get('assigned_to', []))}")
    else:
        print("⚠️  Aucune tâche créée")

    print()

    if instances_file.exists():
        with open(instances_file, 'r', encoding='utf-8') as f:
            instances = json.load(f)
        print(f"✅ {len(instances)} instance(s) de tâche(s)")

        # Compter par statut
        statuses = {}
        for inst in instances:
            status = inst.get('status', 'unknown')
            statuses[status] = statuses.get(status, 0) + 1

        for status, count in statuses.items():
            print(f"   - {status}: {count}")
    else:
        print("⚠️  Aucune instance de tâche")

    print()

    # 4. Vérifier les habitudes
    habits_file = storage_dir / "habits.json"
    streaks_file = storage_dir / "habit_streaks.json"

    print("🔥 4. VÉRIFICATION DES HABITUDES")
    print("-" * 80)

    if habits_file.exists():
        with open(habits_file, 'r', encoding='utf-8') as f:
            habits = json.load(f)
        print(f"✅ {len(habits)} habitude(s) créée(s)")

        for habit in habits:
            print(f"   - {habit.get('title', 'Unknown')} (ID: {habit['id']})")
    else:
        print("⚠️  Aucune habitude créée")

    print()

    if streaks_file.exists():
        with open(streaks_file, 'r', encoding='utf-8') as f:
            streaks = json.load(f)
        print(f"✅ {len(streaks)} streak(s) d'habitude(s)")
    else:
        print("⚠️  Aucun streak")

    print()

    # 5. Instructions pour vérifier dans Home Assistant
    print("🏠 5. VÉRIFICATION DANS HOME ASSISTANT")
    print("-" * 80)
    print("Pour vérifier que les sensors sont bien créés dans Home Assistant:")
    print()
    print("1. Aller dans 'Paramètres' > 'Appareils et services' > 'Entités'")
    print("2. Rechercher 'habits_manager'")
    print("3. Vous devriez voir 8 sensors par enfant")
    print()
    print("OU utiliser les Outils de développement:")
    print()
    print("1. Aller dans 'Outils de développement' > 'États'")
    print("2. Filtrer par 'habits_manager'")
    print("3. Vérifier l'état de chaque sensor")
    print()

    # 6. Instructions pour les logs
    print("📝 6. ACTIVER LES LOGS DÉTAILLÉS")
    print("-" * 80)
    print("Pour avoir plus de logs, ajoutez ceci dans configuration.yaml:")
    print()
    print("logger:")
    print("  default: info")
    print("  logs:")
    print("    custom_components.habits_manager: debug")
    print()
    print("Puis redémarrer Home Assistant.")
    print()
    print("Ensuite, consultez les logs dans:")
    print("- 'Paramètres' > 'Système' > 'Journaux'")
    print("- OU le fichier 'home-assistant.log'")
    print()

    print("=" * 80)
    print("✅ VÉRIFICATION TERMINÉE")
    print("=" * 80)


if __name__ == "__main__":
    main()
