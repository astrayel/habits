"""Reward manager for Habits Manager.

Manages real-world rewards (screen time, meal choices, outings, etc.)
"""
import uuid
from datetime import datetime, timedelta
from typing import List, Optional

from ..const import _LOGGER
from ..core.models import Reward, RewardClaim, RewardType, RewardClaimStatus, Child
from ..core.exceptions import (
    RewardNotFoundError,
    ChildNotFoundError,
    InsufficientPointsError,
    ValidationError
)
from ..storage.storage_manager import StorageManager


class RewardManager:
    """Gère les récompenses réelles et leur réclamation."""

    def __init__(self, storage: StorageManager):
        """Initialise le reward manager.

        Args:
            storage: Manager de stockage
        """
        self.storage = storage

    async def create_reward(self, reward_data: dict) -> Reward:
        """Crée une nouvelle récompense.

        Args:
            reward_data: Données de la récompense

        Returns:
            Reward créée
        """
        # Générer ID
        reward_id = f"reward_{uuid.uuid4().hex[:8]}"

        # Créer la récompense
        reward = Reward(
            id=reward_id,
            title=reward_data["title"],
            description=reward_data.get("description", ""),
            type=RewardType(reward_data.get("type", "real_reward")),
            cost_points=reward_data.get("cost_points", 0),
            cost_coins=reward_data.get("cost_coins", 0),
            icon=reward_data.get("icon", "mdi:gift"),
            color=reward_data.get("color", "#FF5722"),
            stock=reward_data.get("stock"),
            cooldown_days=reward_data.get("cooldown_days", 0),
            active=reward_data.get("active", True),
            requires_parent_approval=reward_data.get("requires_parent_approval", True),
        )

        # Sauvegarder
        await self.storage.save_reward(reward)

        _LOGGER.info(f"Reward created: {reward.title} ({reward.id})")

        return reward

    async def get_reward(self, reward_id: str) -> Reward:
        """Récupère une récompense par son ID.

        Args:
            reward_id: ID de la récompense

        Returns:
            Reward

        Raises:
            RewardNotFoundError: Si la récompense n'existe pas
        """
        rewards = await self.storage.load_rewards()
        for reward in rewards:
            if reward.id == reward_id:
                return reward

        raise RewardNotFoundError(f"Reward {reward_id} not found")

    async def get_all_rewards(self, active_only: bool = False) -> List[Reward]:
        """Récupère toutes les récompenses.

        Args:
            active_only: Si True, ne retourne que les récompenses actives

        Returns:
            Liste des récompenses
        """
        rewards = await self.storage.load_rewards()

        if active_only:
            rewards = [r for r in rewards if r.active]

        return rewards

    async def update_reward(self, reward: Reward) -> Reward:
        """Met à jour une récompense.

        Args:
            reward: Récompense à mettre à jour

        Returns:
            Reward mise à jour
        """
        await self.storage.save_reward(reward)
        _LOGGER.debug(f"Reward updated: {reward.title} ({reward.id})")
        return reward

    async def delete_reward(self, reward_id: str) -> None:
        """Supprime une récompense.

        Args:
            reward_id: ID de la récompense

        Raises:
            RewardNotFoundError: Si la récompense n'existe pas
        """
        # Vérifier que la récompense existe
        await self.get_reward(reward_id)

        # Supprimer
        await self.storage.delete_reward(reward_id)
        _LOGGER.info(f"Reward deleted: {reward_id}")

    async def claim_reward(self, reward_id: str, child_id: str) -> tuple[RewardClaim, int, int]:
        """Un enfant réclame une récompense.

        Args:
            reward_id: ID de la récompense
            child_id: ID de l'enfant

        Returns:
            Tuple (claim créé, points déduits, coins déduits)

        Raises:
            RewardNotFoundError: Si la récompense n'existe pas
            ChildNotFoundError: Si l'enfant n'existe pas
            InsufficientPointsError: Si l'enfant n'a pas assez de points/coins
            ValidationError: Si le stock est épuisé ou cooldown actif
        """
        # Charger la récompense
        reward = await self.get_reward(reward_id)

        # Vérifier que la récompense est active
        if not reward.active:
            raise ValidationError(f"Reward {reward_id} is not active")

        # Vérifier le stock
        if reward.stock is not None and reward.stock <= 0:
            raise ValidationError(f"Reward {reward_id} is out of stock")

        # Charger l'enfant
        child = await self.storage.get_child(child_id)
        if child is None:
            raise ChildNotFoundError(f"Child {child_id} not found")

        # Vérifier les points/coins
        if child.points < reward.cost_points:
            raise InsufficientPointsError(
                f"Child {child_id} has {child.points} points, needs {reward.cost_points}"
            )

        if child.coins < reward.cost_coins:
            raise InsufficientPointsError(
                f"Child {child_id} has {child.coins} coins, needs {reward.cost_coins}"
            )

        # Vérifier le cooldown
        if reward.cooldown_days > 0:
            claims = await self.get_claims_for_child(child_id)
            recent_claims = [
                c for c in claims
                if c.reward_id == reward_id
                and c.status in [RewardClaimStatus.APPROVED, RewardClaimStatus.USED]
                and c.approved_at is not None
                and (datetime.now() - c.approved_at).days < reward.cooldown_days
            ]
            if recent_claims:
                raise ValidationError(
                    f"Reward {reward_id} is in cooldown for {reward.cooldown_days} days"
                )

        # Créer le claim
        claim_id = f"claim_{uuid.uuid4().hex[:8]}"
        claim = RewardClaim(
            id=claim_id,
            reward_id=reward_id,
            child_id=child_id,
            claimed_at=datetime.now(),
            status=RewardClaimStatus.PENDING if reward.requires_parent_approval else RewardClaimStatus.APPROVED,
        )

        # Si pas besoin d'approbation, approuver automatiquement
        if not reward.requires_parent_approval:
            claim.approved_by = "auto"
            claim.approved_at = datetime.now()

        # Sauvegarder le claim
        await self.storage.save_reward_claim(claim)

        # Déduire le stock si défini
        if reward.stock is not None:
            reward.stock -= 1
            await self.storage.save_reward(reward)

        _LOGGER.info(
            f"Reward claimed: {reward.title} by child {child_id} "
            f"(status={claim.status.value}, cost={reward.cost_points}pts/{reward.cost_coins}coins)"
        )

        return claim, reward.cost_points, reward.cost_coins

    async def approve_claim(self, claim_id: str, approver_id: str) -> RewardClaim:
        """Approuve une réclamation de récompense.

        Args:
            claim_id: ID de la réclamation
            approver_id: ID de l'approbateur (parent/admin)

        Returns:
            RewardClaim approuvé

        Raises:
            ValidationError: Si le claim n'est pas en attente
        """
        # Charger le claim
        claims = await self.storage.load_reward_claims()
        claim = None
        for c in claims:
            if c.id == claim_id:
                claim = c
                break

        if claim is None:
            raise ValidationError(f"Reward claim {claim_id} not found")

        # Vérifier le statut
        if claim.status != RewardClaimStatus.PENDING:
            raise ValidationError(
                f"Cannot approve claim {claim_id}: status is {claim.status.value}"
            )

        # Approuver
        claim.status = RewardClaimStatus.APPROVED
        claim.approved_by = approver_id
        claim.approved_at = datetime.now()

        # Sauvegarder
        await self.storage.save_reward_claim(claim)

        _LOGGER.info(f"Reward claim {claim_id} approved by {approver_id}")

        return claim

    async def refuse_claim(self, claim_id: str, refuser_id: str) -> RewardClaim:
        """Refuse une réclamation de récompense.

        Remet le stock et les points/coins en place.

        Args:
            claim_id: ID de la réclamation
            refuser_id: ID du refuseur (parent/admin)

        Returns:
            RewardClaim refusé
        """
        # Charger le claim
        claims = await self.storage.load_reward_claims()
        claim = None
        for c in claims:
            if c.id == claim_id:
                claim = c
                break

        if claim is None:
            raise ValidationError(f"Reward claim {claim_id} not found")

        # Vérifier le statut
        if claim.status != RewardClaimStatus.PENDING:
            raise ValidationError(
                f"Cannot refuse claim {claim_id}: status is {claim.status.value}"
            )

        # Charger la récompense pour remettre le stock
        reward = await self.get_reward(claim.reward_id)
        if reward.stock is not None:
            reward.stock += 1
            await self.storage.save_reward(reward)

        # Refuser
        claim.status = RewardClaimStatus.REFUSED
        claim.approved_by = refuser_id
        claim.approved_at = datetime.now()

        # Sauvegarder
        await self.storage.save_reward_claim(claim)

        _LOGGER.info(f"Reward claim {claim_id} refused by {refuser_id}")

        return claim

    async def mark_claim_used(self, claim_id: str) -> RewardClaim:
        """Marque une réclamation comme utilisée.

        Args:
            claim_id: ID de la réclamation

        Returns:
            RewardClaim marqué comme utilisé
        """
        # Charger le claim
        claims = await self.storage.load_reward_claims()
        claim = None
        for c in claims:
            if c.id == claim_id:
                claim = c
                break

        if claim is None:
            raise ValidationError(f"Reward claim {claim_id} not found")

        # Vérifier le statut
        if claim.status != RewardClaimStatus.APPROVED:
            raise ValidationError(
                f"Cannot mark claim {claim_id} as used: status is {claim.status.value}"
            )

        # Marquer comme utilisé
        claim.status = RewardClaimStatus.USED
        claim.used_at = datetime.now()

        # Sauvegarder
        await self.storage.save_reward_claim(claim)

        _LOGGER.info(f"Reward claim {claim_id} marked as used")

        return claim

    async def get_claims_for_child(self, child_id: str) -> List[RewardClaim]:
        """Récupère toutes les réclamations d'un enfant.

        Args:
            child_id: ID de l'enfant

        Returns:
            Liste des réclamations
        """
        all_claims = await self.storage.load_reward_claims()
        return [c for c in all_claims if c.child_id == child_id]

    async def get_pending_claims(self) -> List[RewardClaim]:
        """Récupère toutes les réclamations en attente.

        Returns:
            Liste des réclamations en attente
        """
        all_claims = await self.storage.load_reward_claims()
        return [c for c in all_claims if c.status == RewardClaimStatus.PENDING]
