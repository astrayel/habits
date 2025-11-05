#!/usr/bin/env python3
"""
Script de vérification des fichiers de storage Habits Manager.

Ce script lit directement les fichiers JSON et vérifie leur structure.
Plus simple que l'API REST, pas besoin de token.

Usage:
    python test_storage_files.py [--storage-dir /config/.storage/habits_manager]
"""
import json
import os
import argparse
from datetime import datetime
from pathlib import Path


class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


class StorageTester:
    """Testeur pour les fichiers de storage."""

    def __init__(self, storage_dir: str):
        """Initialise le testeur.

        Args:
            storage_dir: Chemin du répertoire de storage
        """
        self.storage_dir = Path(storage_dir)
        self.test_results = []

    def read_json(self, filename: str):
        """Lit un fichier JSON.

        Args:
            filename: Nom du fichier

        Returns:
            Contenu JSON ou None
        """
        filepath = self.storage_dir / filename
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"  {Colors.YELLOW}⚠ Fichier non trouvé: {filename}{Colors.RESET}")
            return {}
        except json.JSONDecodeError as e:
            print(f"  {Colors.RED}✗ Erreur JSON dans {filename}: {e}{Colors.RESET}")
            return None
        except Exception as e:
            print(f"  {Colors.RED}✗ Erreur lecture {filename}: {e}{Colors.RESET}")
            return None

    def test(self, name: str, func):
        """Exécute un test.

        Args:
            name: Nom du test
            func: Fonction de test

        Returns:
            Résultat du test
        """
        print(f"\n{Colors.BOLD}{Colors.CYAN}━━━ {name} ━━━{Colors.RESET}")
        try:
            result = func()
            if result:
                print(f"{Colors.GREEN}✓ Test réussi{Colors.RESET}")
                self.test_results.append((name, True, None))
            else:
                print(f"{Colors.RED}✗ Test échoué{Colors.RESET}")
                self.test_results.append((name, False, "Assertion failed"))
            return result
        except Exception as e:
            print(f"{Colors.RED}✗ Test échoué: {e}{Colors.RESET}")
            self.test_results.append((name, False, str(e))
            return False

    def run_all_tests(self):
        """Exécute tous les tests."""
        print(f"{Colors.BOLD}{Colors.GREEN}")
        print("╔════════════════════════════════════════════════════════════╗")
        print("║     HABITS MANAGER - VÉRIFICATION DES FICHIERS            ║")
        print("╚════════════════════════════════════════════════════════════╝")
        print(f"{Colors.RESET}")

        print(f"\n{Colors.BLUE}Répertoire: {self.storage_dir}{Colors.RESET}\n")

        # Vérifier l'existence du répertoire
        if not self.storage_dir.exists():
            print(f"{Colors.RED}✗ Le répertoire de storage n'existe pas !{Colors.RESET}")
            print(f"  Chemin: {self.storage_dir}")
            print(f"  L'intégration n'a peut-être pas encore été chargée.")
            return

        # Tests
        self.test("Vérifier children.json", self.test_children)
        self.test("Vérifier tasks.json", self.test_tasks)
        self.test("Vérifier task_instances.json", self.test_task_instances)
        self.test("Vérifier habits.json", self.test_habits)
        self.test("Vérifier habit_streaks.json", self.test_habit_streaks)
        self.test("Vérifier rewards.json", self.test_rewards)
        self.test("Vérifier reward_claims.json", self.test_reward_claims)
        self.test("Vérifier cosmetics.json", self.test_cosmetics)

        # Rapport
        self.print_report()

    def test_children(self):
        """Test: Vérifier children.json."""
        data = self.read_json('children.json')
        if data is None:
            return False

        print(f"  → {len(data)} enfant(s) trouvé(s)")

        for child_id, child in data.items():
            print(f"\n  Enfant: {child.get('name', 'Unknown')} ({child_id})")
            print(f"    Points: {child.get('points', 0)}")
            print(f"    Coins: {child.get('coins', 0)}")
            print(f"    Level: {child.get('level', 1)}")
            print(f"    XP: {child.get('experience', 0)}/{child.get('experience_to_next_level', 100)}")

            # Vérifier la structure
            required_fields = ['id', 'name', 'person_entity', 'points', 'coins', 'level', 'avatar']
            missing = [f for f in required_fields if f not in child]
            if missing:
                print(f"    {Colors.RED}✗ Champs manquants: {missing}{Colors.RESET}")
                return False

        return True

    def test_tasks(self):
        """Test: Vérifier tasks.json."""
        data = self.read_json('tasks.json')
        if data is None:
            return False

        print(f"  → {len(data)} tâche(s) trouvée(s)")

        for task_id, task in data.items():
            print(f"\n  Tâche: {task.get('title', 'Unknown')} ({task_id})")
            print(f"    Type: {task.get('type', 'N/A')}")
            print(f"    Difficulté: {task.get('difficulty', 1)}")
            print(f"    Schedule: {task.get('schedule', {}).get('type', 'N/A')}")
            print(f"    Active: {task.get('active', False)}")

        return True

    def test_task_instances(self):
        """Test: Vérifier task_instances.json."""
        data = self.read_json('task_instances.json')
        if data is None:
            return False

        print(f"  → {len(data)} instance(s) trouvée(s)")

        statuses = {}
        for instance_id, instance in data.items():
            status = instance.get('status', 'unknown')
            statuses[status] = statuses.get(status, 0) + 1

        print(f"\n  Statuts:")
        for status, count in statuses.items():
            print(f"    {status}: {count}")

        return True

    def test_habits(self):
        """Test: Vérifier habits.json."""
        data = self.read_json('habits.json')
        if data is None:
            return False

        print(f"  → {len(data)} habitude(s) trouvée(s)")

        for habit_id, habit in data.items():
            print(f"\n  Habitude: {habit.get('title', 'Unknown')} ({habit_id})")
            print(f"    Fréquence: {habit.get('frequency', 'N/A')}")
            print(f"    Active: {habit.get('active', False)}")

        return True

    def test_habit_streaks(self):
        """Test: Vérifier habit_streaks.json."""
        data = self.read_json('habit_streaks.json')
        if data is None:
            return False

        print(f"  → {len(data)} streak(s) trouvé(s)")

        for streak_id, streak in data.items():
            print(f"\n  Streak: {streak_id}")
            print(f"    Current: {streak.get('current_streak', 0)}")
            print(f"    Longest: {streak.get('longest_streak', 0)}")
            print(f"    Total completions: {streak.get('total_completions', 0)}")

        return True

    def test_rewards(self):
        """Test: Vérifier rewards.json."""
        data = self.read_json('rewards.json')
        if data is None:
            return False

        print(f"  → {len(data)} récompense(s) trouvée(s)")

        for reward_id, reward in data.items():
            print(f"\n  Récompense: {reward.get('title', 'Unknown')} ({reward_id})")
            print(f"    Coût: {reward.get('cost_points', 0)} points")
            print(f"    Stock: {reward.get('stock', 'Illimité')}")
            print(f"    Cooldown: {reward.get('cooldown_days', 0)} jours")

        return True

    def test_reward_claims(self):
        """Test: Vérifier reward_claims.json."""
        data = self.read_json('reward_claims.json')
        if data is None:
            return False

        print(f"  → {len(data)} réclamation(s) trouvée(s)")

        statuses = {}
        for claim_id, claim in data.items():
            status = claim.get('status', 'unknown')
            statuses[status] = statuses.get(status, 0) + 1

        print(f"\n  Statuts:")
        for status, count in statuses.items():
            print(f"    {status}: {count}")

        return True

    def test_cosmetics(self):
        """Test: Vérifier cosmetics.json."""
        data = self.read_json('cosmetics.json')
        if data is None:
            return False

        print(f"  → {len(data)} cosmétique(s) trouvé(s)")

        categories = {}
        for cosmetic_id, cosmetic in data.items():
            cat = cosmetic.get('category', 'unknown')
            categories[cat] = categories.get(cat, 0) + 1

        print(f"\n  Catégories:")
        for cat, count in categories.items():
            print(f"    {cat}: {count}")

        return True

    def print_report(self):
        """Affiche le rapport final."""
        print(f"\n{Colors.BOLD}{Colors.CYAN}")
        print("╔════════════════════════════════════════════════════════════╗")
        print("║                  RAPPORT DE VÉRIFICATION                   ║")
        print("╚════════════════════════════════════════════════════════════╝")
        print(f"{Colors.RESET}")

        passed = sum(1 for _, result, _ in self.test_results if result)
        failed = sum(1 for _, result, _ in self.test_results if not result)
        total = len(self.test_results)

        print(f"\n{Colors.BOLD}Résumé:{Colors.RESET}")
        print(f"  Total: {total} fichiers vérifiés")
        print(f"  {Colors.GREEN}✓ OK: {passed}{Colors.RESET}")
        print(f"  {Colors.RED}✗ Erreurs: {failed}{Colors.RESET}")

        if failed > 0:
            print(f"\n{Colors.BOLD}Fichiers avec erreurs:{Colors.RESET}")
            for name, result, error in self.test_results:
                if not result:
                    print(f"  {Colors.RED}✗ {name}{Colors.RESET}")
                    if error:
                        print(f"    {error}")

        score = (passed / total * 100) if total > 0 else 0
        print(f"\n{Colors.BOLD}Score: {score:.1f}%{Colors.RESET}")

        if score == 100:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 TOUS LES FICHIERS SONT VALIDES !{Colors.RESET}")
        elif score >= 75:
            print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠ La plupart des fichiers sont OK{Colors.RESET}")
        else:
            print(f"\n{Colors.RED}{Colors.BOLD}✗ Plusieurs fichiers ont des problèmes{Colors.RESET}")


def main():
    """Point d'entrée."""
    parser = argparse.ArgumentParser(
        description='Vérification des fichiers de storage Habits Manager'
    )
    parser.add_argument(
        '--storage-dir',
        default='/config/.storage/habits_manager',
        help='Chemin du répertoire de storage (défaut: /config/.storage/habits_manager)'
    )

    args = parser.parse_args()

    tester = StorageTester(args.storage_dir)
    tester.run_all_tests()


if __name__ == '__main__':
    main()
