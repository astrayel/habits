"""Custom exceptions for Habits Manager."""


class HabitsManagerError(Exception):
    """Base exception for Habits Manager."""


class ChildNotFoundError(HabitsManagerError):
    """Child not found."""


class TaskNotFoundError(HabitsManagerError):
    """Task not found."""


class HabitNotFoundError(HabitsManagerError):
    """Habit not found."""


class RewardNotFoundError(HabitsManagerError):
    """Reward not found."""


class CosmeticNotFoundError(HabitsManagerError):
    """Cosmetic not found."""


class InsufficientPointsError(HabitsManagerError):
    """Not enough points to perform this action."""


class InsufficientCoinsError(HabitsManagerError):
    """Not enough coins to perform this action."""


class ValidationError(HabitsManagerError):
    """Data validation failed."""


class StorageError(HabitsManagerError):
    """Storage operation failed."""


class UnauthorizedError(HabitsManagerError):
    """User is not authorized to perform this action."""
