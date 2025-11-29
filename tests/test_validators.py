"""Tests for data validators."""
import pytest
from custom_components.habits_manager.core.validators import (
    validate_child_data,
    validate_task_data,
    validate_habit_data,
    validate_reward_data,
    validate_cosmetic_data,
    validate_points,
    validate_coins,
    validate_level,
)
from custom_components.habits_manager.core.exceptions import ValidationError


class TestChildDataValidator:
    """Test child data validation."""

    def test_valid_child_data(self):
        """Test valid child data passes."""
        data = {"name": "Alice", "person_entity": "person.alice"}
        assert validate_child_data(data) is True

    def test_missing_name(self):
        """Test missing name raises error."""
        with pytest.raises(ValidationError, match="nom de l'enfant est requis"):
            validate_child_data({"person_entity": "person.alice"})

    def test_empty_name(self):
        """Test empty name raises error."""
        with pytest.raises(ValidationError, match="nom de l'enfant est requis"):
            validate_child_data({"name": "", "person_entity": "person.alice"})

    def test_name_too_long(self):
        """Test name exceeding 50 chars raises error."""
        with pytest.raises(ValidationError, match="50 caractères"):
            validate_child_data({
                "name": "A" * 51,
                "person_entity": "person.alice"
            })

    def test_missing_person_entity(self):
        """Test missing person_entity raises error."""
        with pytest.raises(ValidationError, match="entité person est requise"):
            validate_child_data({"name": "Alice"})

    def test_invalid_person_entity_prefix(self):
        """Test person_entity must start with 'person.'"""
        with pytest.raises(ValidationError, match="commencer par 'person.'"):
            validate_child_data({
                "name": "Alice",
                "person_entity": "sensor.alice"
            })


class TestTaskDataValidator:
    """Test task data validation."""

    def test_valid_task_data(self):
        """Test valid task data passes."""
        data = {
            "title": "Clean room",
            "assigned_to": ["child_001"],
            "difficulty": 2,
            "estimated_duration": 15,
            "rewards": {"points": 10, "coins": 5, "experience": 20},
            "penalties": {"points": -5, "coins": 0},
        }
        assert validate_task_data(data) is True

    def test_missing_title(self):
        """Test missing title raises error."""
        with pytest.raises(ValidationError, match="titre de la tâche est requis"):
            validate_task_data({"assigned_to": ["child_001"]})

    def test_title_too_long(self):
        """Test title exceeding 100 chars raises error."""
        with pytest.raises(ValidationError, match="100 caractères"):
            validate_task_data({
                "title": "T" * 101,
                "assigned_to": ["child_001"]
            })

    def test_missing_assigned_to(self):
        """Test missing assigned_to raises error."""
        with pytest.raises(ValidationError, match="assignée à au moins un enfant"):
            validate_task_data({"title": "Clean room"})

    def test_empty_assigned_to(self):
        """Test empty assigned_to raises error."""
        with pytest.raises(ValidationError, match="assignée à au moins un enfant"):
            validate_task_data({"title": "Clean room", "assigned_to": []})

    def test_invalid_difficulty_low(self):
        """Test difficulty < 1 raises error."""
        with pytest.raises(ValidationError, match="difficulté doit être entre 1 et 3"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "difficulty": 0
            })

    def test_invalid_difficulty_high(self):
        """Test difficulty > 3 raises error."""
        with pytest.raises(ValidationError, match="difficulté doit être entre 1 et 3"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "difficulty": 4
            })

    def test_negative_duration(self):
        """Test negative duration raises error."""
        with pytest.raises(ValidationError, match="durée estimée doit être positive"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "estimated_duration": -5
            })

    def test_zero_duration(self):
        """Test zero duration raises error."""
        with pytest.raises(ValidationError, match="durée estimée doit être positive"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "estimated_duration": 0
            })

    def test_negative_reward_points(self):
        """Test negative reward points raises error."""
        with pytest.raises(ValidationError, match="points ne peuvent pas être négatifs"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "rewards": {"points": -10}
            })

    def test_negative_reward_coins(self):
        """Test negative reward coins raises error."""
        with pytest.raises(ValidationError, match="pièces ne peuvent pas être négatives"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "rewards": {"coins": -5}
            })

    def test_negative_reward_experience(self):
        """Test negative reward experience raises error."""
        with pytest.raises(ValidationError, match="expérience ne peut pas être négative"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "rewards": {"experience": -10}
            })

    def test_positive_penalty_points(self):
        """Test positive penalty points raises error."""
        with pytest.raises(ValidationError, match="pénalités de points doivent être négatives"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "penalties": {"points": 5}
            })

    def test_positive_penalty_coins(self):
        """Test positive penalty coins raises error."""
        with pytest.raises(ValidationError, match="pénalités de pièces doivent être négatives"):
            validate_task_data({
                "title": "Clean room",
                "assigned_to": ["child_001"],
                "penalties": {"coins": 5}
            })


class TestHabitDataValidator:
    """Test habit data validation."""

    def test_valid_habit_data(self):
        """Test valid habit data passes."""
        data = {
            "title": "Brush teeth",
            "frequency": "daily",
            "rewards": {
                "points": 5,
                "coins": 1,
                "experience": 10,
                "streak_bonus": {"multiplier": 0.1}
            }
        }
        assert validate_habit_data(data) is True

    def test_missing_title(self):
        """Test missing title raises error."""
        with pytest.raises(ValidationError, match="titre de l'habitude est requis"):
            validate_habit_data({"frequency": "daily"})

    def test_title_too_long(self):
        """Test title exceeding 100 chars raises error."""
        with pytest.raises(ValidationError, match="100 caractères"):
            validate_habit_data({
                "title": "H" * 101,
                "frequency": "daily"
            })

    def test_missing_frequency(self):
        """Test missing frequency raises error."""
        with pytest.raises(ValidationError, match="fréquence est requise"):
            validate_habit_data({"title": "Brush teeth"})

    def test_invalid_frequency(self):
        """Test invalid frequency raises error."""
        with pytest.raises(ValidationError, match="Fréquence invalide"):
            validate_habit_data({
                "title": "Brush teeth",
                "frequency": "yearly"
            })

    def test_negative_reward_points(self):
        """Test negative reward points raises error."""
        with pytest.raises(ValidationError, match="points ne peuvent pas être négatifs"):
            validate_habit_data({
                "title": "Brush teeth",
                "frequency": "daily",
                "rewards": {"points": -5}
            })

    def test_negative_reward_coins(self):
        """Test negative reward coins raises error."""
        with pytest.raises(ValidationError, match="pièces ne peuvent pas être négatives"):
            validate_habit_data({
                "title": "Brush teeth",
                "frequency": "daily",
                "rewards": {"coins": -1}
            })

    def test_negative_reward_experience(self):
        """Test negative reward experience raises error."""
        with pytest.raises(ValidationError, match="expérience ne peut pas être négative"):
            validate_habit_data({
                "title": "Brush teeth",
                "frequency": "daily",
                "rewards": {"experience": -10}
            })

    def test_negative_streak_multiplier(self):
        """Test negative streak multiplier raises error."""
        with pytest.raises(ValidationError, match="multiplicateur de streak"):
            validate_habit_data({
                "title": "Brush teeth",
                "frequency": "daily",
                "rewards": {"streak_bonus": {"multiplier": -0.1}}
            })


class TestRewardDataValidator:
    """Test reward data validation."""

    def test_valid_reward_data(self):
        """Test valid reward data passes."""
        data = {
            "title": "Extra screen time",
            "type": "screen_time",
            "cost_points": 50,
            "cost_coins": 0,
            "cooldown_days": 1
        }
        assert validate_reward_data(data) is True

    def test_missing_title(self):
        """Test missing title raises error."""
        with pytest.raises(ValidationError, match="titre de la récompense est requis"):
            validate_reward_data({"type": "screen_time", "cost_points": 50})

    def test_title_too_long(self):
        """Test title exceeding 100 chars raises error."""
        with pytest.raises(ValidationError, match="100 caractères"):
            validate_reward_data({
                "title": "R" * 101,
                "type": "screen_time",
                "cost_points": 50
            })

    def test_missing_type(self):
        """Test missing type raises error."""
        with pytest.raises(ValidationError, match="type de récompense est requis"):
            validate_reward_data({"title": "Test", "cost_points": 50})

    def test_invalid_type(self):
        """Test invalid type raises error."""
        with pytest.raises(ValidationError, match="Type de récompense invalide"):
            validate_reward_data({
                "title": "Test",
                "type": "invalid_type",
                "cost_points": 50
            })

    def test_negative_cost_points(self):
        """Test negative cost_points raises error."""
        with pytest.raises(ValidationError, match="coût en points ne peut pas être négatif"):
            validate_reward_data({
                "title": "Test",
                "type": "screen_time",
                "cost_points": -50
            })

    def test_negative_cost_coins(self):
        """Test negative cost_coins raises error."""
        with pytest.raises(ValidationError, match="coût en pièces ne peut pas être négatif"):
            validate_reward_data({
                "title": "Test",
                "type": "screen_time",
                "cost_points": 50,
                "cost_coins": -10
            })

    def test_zero_cost(self):
        """Test zero cost raises error."""
        with pytest.raises(ValidationError, match="doit avoir un coût"):
            validate_reward_data({
                "title": "Test",
                "type": "screen_time",
                "cost_points": 0,
                "cost_coins": 0
            })

    def test_negative_cooldown(self):
        """Test negative cooldown raises error."""
        with pytest.raises(ValidationError, match="cooldown ne peut pas être négatif"):
            validate_reward_data({
                "title": "Test",
                "type": "screen_time",
                "cost_points": 50,
                "cooldown_days": -1
            })


class TestCosmeticDataValidator:
    """Test cosmetic data validation."""

    def test_valid_cosmetic_data(self):
        """Test valid cosmetic data passes."""
        data = {
            "name": "Cool Hat",
            "category": "accessory",
            "rarity": "rare",
            "cost_coins": 100
        }
        assert validate_cosmetic_data(data) is True

    def test_missing_name(self):
        """Test missing name raises error."""
        with pytest.raises(ValidationError, match="nom du cosmétique est requis"):
            validate_cosmetic_data({
                "category": "accessory",
                "rarity": "rare"
            })

    def test_name_too_long(self):
        """Test name exceeding 100 chars raises error."""
        with pytest.raises(ValidationError, match="100 caractères"):
            validate_cosmetic_data({
                "name": "C" * 101,
                "category": "accessory",
                "rarity": "rare"
            })

    def test_missing_category(self):
        """Test missing category raises error."""
        with pytest.raises(ValidationError, match="catégorie est requise"):
            validate_cosmetic_data({
                "name": "Cool Hat",
                "rarity": "rare"
            })

    def test_invalid_category(self):
        """Test invalid category raises error."""
        with pytest.raises(ValidationError, match="Catégorie invalide"):
            validate_cosmetic_data({
                "name": "Cool Hat",
                "category": "invalid_cat",
                "rarity": "rare"
            })

    def test_missing_rarity(self):
        """Test missing rarity raises error."""
        with pytest.raises(ValidationError, match="rareté est requise"):
            validate_cosmetic_data({
                "name": "Cool Hat",
                "category": "accessory"
            })

    def test_invalid_rarity(self):
        """Test invalid rarity raises error."""
        with pytest.raises(ValidationError, match="Rareté invalide"):
            validate_cosmetic_data({
                "name": "Cool Hat",
                "category": "accessory",
                "rarity": "mythic"
            })

    def test_negative_cost(self):
        """Test negative cost raises error."""
        with pytest.raises(ValidationError, match="coût ne peut pas être négatif"):
            validate_cosmetic_data({
                "name": "Cool Hat",
                "category": "accessory",
                "rarity": "rare",
                "cost_coins": -50
            })


class TestSimpleValidators:
    """Test simple value validators."""

    def test_validate_points_valid(self):
        """Test valid points passes."""
        assert validate_points(100) is True
        assert validate_points(0) is True
        assert validate_points(-50) is True  # Negative allowed for penalties

    def test_validate_points_invalid_type(self):
        """Test non-integer points raises error."""
        with pytest.raises(ValidationError, match="points doivent être un entier"):
            validate_points("100")
        with pytest.raises(ValidationError, match="points doivent être un entier"):
            validate_points(100.5)

    def test_validate_coins_valid(self):
        """Test valid coins passes."""
        assert validate_coins(50) is True
        assert validate_coins(0) is True

    def test_validate_coins_invalid_type(self):
        """Test non-integer coins raises error."""
        with pytest.raises(ValidationError, match="pièces doivent être un entier"):
            validate_coins("50")
        with pytest.raises(ValidationError, match="pièces doivent être un entier"):
            validate_coins(50.5)

    def test_validate_level_valid(self):
        """Test valid level passes."""
        assert validate_level(1) is True
        assert validate_level(10) is True
        assert validate_level(99) is True

    def test_validate_level_invalid_type(self):
        """Test non-integer level raises error."""
        with pytest.raises(ValidationError, match="niveau doit être un entier"):
            validate_level("5")
        with pytest.raises(ValidationError, match="niveau doit être un entier"):
            validate_level(5.5)

    def test_validate_level_too_low(self):
        """Test level < 1 raises error."""
        with pytest.raises(ValidationError, match="niveau doit être au moins 1"):
            validate_level(0)
        with pytest.raises(ValidationError, match="niveau doit être au moins 1"):
            validate_level(-1)
