"""Tests for reward-related services."""
import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestRewardServices:
    """Test reward management services."""

    async def test_create_reward(self, mock_hass, setup_test_child, sample_reward_data):
        """Test creating a reward."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_reward",
            sample_reward_data,
            blocking=True,
            return_response=True,
        )

        assert "reward" in response
        assert response["reward"]["title"] == sample_reward_data["title"]
        assert response["reward"]["cost_points"] == sample_reward_data["cost_points"]

    async def test_list_rewards(self, mock_hass, setup_test_reward):
        """Test listing rewards."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_rewards",
            {},
            blocking=True,
            return_response=True,
        )

        assert "rewards" in response
        assert len(response["rewards"]) >= 1

    async def test_update_reward(self, mock_hass, setup_test_reward):
        """Test updating a reward."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_reward",
            {
                "reward_id": setup_test_reward,
                "cost_points": 60,
            },
            blocking=True,
            return_response=True,
        )

        assert response["reward"]["cost_points"] == 60

    async def test_claim_reward(self, mock_hass, setup_test_child, setup_test_reward):
        """Test claiming a reward."""
        # First give child enough points
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
        )

        # Claim reward
        response = await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": setup_test_reward,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert "claim" in response
        assert response["claim"]["status"] == "pending"
        assert response["claim"]["reward_id"] == setup_test_reward

    async def test_claim_reward_insufficient_points(self, mock_hass, setup_test_child, setup_test_reward):
        """Test claiming reward without enough points fails."""
        # Child has 0 points, reward costs 50
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "claim_reward",
                {
                    "reward_id": setup_test_reward,
                    "child_id": setup_test_child,
                },
                blocking=True,
            )

    async def test_approve_claim(self, mock_hass, setup_test_child, setup_test_reward):
        """Test approving a reward claim."""
        # Give points and claim
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
        )

        claim_response = await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": setup_test_reward,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        claim_id = claim_response["claim"]["id"]

        # Approve claim
        response = await mock_hass.services.async_call(
            DOMAIN,
            "approve_claim",
            {
                "claim_id": claim_id,
                "approver_comment": "Profite bien !",
            },
            blocking=True,
            return_response=True,
        )

        assert response["claim"]["status"] == "approved"

    async def test_refuse_claim(self, mock_hass, setup_test_child, setup_test_reward):
        """Test refusing a reward claim."""
        # Give points and claim
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
        )

        claim_response = await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": setup_test_reward,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        claim_id = claim_response["claim"]["id"]

        # Refuse claim
        response = await mock_hass.services.async_call(
            DOMAIN,
            "refuse_claim",
            {
                "claim_id": claim_id,
                "reason": "Pas aujourd'hui",
            },
            blocking=True,
            return_response=True,
        )

        assert response["claim"]["status"] == "refused"
        # Points should be refunded
        assert response["points_refunded"] > 0

    async def test_consume_claim(self, mock_hass, setup_test_child, setup_test_reward):
        """Test consuming an approved claim."""
        # Give points, claim and approve
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
        )

        claim_response = await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": setup_test_reward,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        claim_id = claim_response["claim"]["id"]

        await mock_hass.services.async_call(
            DOMAIN,
            "approve_claim",
            {"claim_id": claim_id},
            blocking=True,
        )

        # Consume claim
        response = await mock_hass.services.async_call(
            DOMAIN,
            "consume_claim",
            {"claim_id": claim_id},
            blocking=True,
            return_response=True,
        )

        assert response["claim"]["status"] == "consumed"

    async def test_list_claims(self, mock_hass, setup_test_child, setup_test_reward):
        """Test listing reward claims."""
        # Create a claim
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": setup_test_reward,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # List claims
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_claims",
            {
                "child_id": setup_test_child,
                "status": "pending",
            },
            blocking=True,
            return_response=True,
        )

        assert "claims" in response
        assert len(response["claims"]) >= 1

    async def test_delete_reward(self, mock_hass, setup_test_reward):
        """Test deleting a reward."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "delete_reward",
            {"reward_id": setup_test_reward},
            blocking=True,
            return_response=True,
        )

        assert response["deleted"] is True
