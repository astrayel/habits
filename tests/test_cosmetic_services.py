"""Tests for cosmetic-related services."""
import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestCosmeticServices:
    """Test cosmetic management services."""

    async def test_create_cosmetic(self, mock_hass, sample_cosmetic_data):
        """Test creating a cosmetic item."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_cosmetic",
            sample_cosmetic_data,
            blocking=True,
            return_response=True,
        )

        assert "cosmetic" in response
        assert response["cosmetic"]["name"] == sample_cosmetic_data["name"]
        assert response["cosmetic"]["category"] == sample_cosmetic_data["category"]
        assert response["cosmetic"]["cost_coins"] == sample_cosmetic_data["cost_coins"]

    async def test_list_cosmetics(self, mock_hass, setup_test_cosmetic):
        """Test listing cosmetics."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_cosmetics",
            {},
            blocking=True,
            return_response=True,
        )

        assert "cosmetics" in response
        assert len(response["cosmetics"]) >= 1

    async def test_list_cosmetics_by_category(self, mock_hass, setup_test_cosmetic):
        """Test listing cosmetics filtered by category."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_cosmetics",
            {"category": "hat"},
            blocking=True,
            return_response=True,
        )

        assert "cosmetics" in response
        for cosmetic in response["cosmetics"]:
            assert cosmetic["category"] == "hat"

    async def test_update_cosmetic(self, mock_hass, setup_test_cosmetic):
        """Test updating a cosmetic."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "name": "Grand chapeau de pirate",
                "cost_coins": 120,
            },
            blocking=True,
            return_response=True,
        )

        assert response["cosmetic"]["name"] == "Grand chapeau de pirate"
        assert response["cosmetic"]["cost_coins"] == 120

    async def test_purchase_cosmetic(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test purchasing a cosmetic."""
        # Give child enough coins
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": setup_test_child,
                "coins": 150,
            },
            blocking=True,
        )

        # Purchase cosmetic
        response = await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert response["purchased"] is True
        assert response["cosmetic_id"] == setup_test_cosmetic

    async def test_purchase_cosmetic_insufficient_coins(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test purchasing cosmetic without enough coins fails."""
        # Child has 0 coins, cosmetic costs 100
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "purchase_cosmetic",
                {
                    "cosmetic_id": setup_test_cosmetic,
                    "child_id": setup_test_child,
                },
                blocking=True,
            )

    async def test_equip_cosmetic(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test equipping a cosmetic."""
        # Purchase first
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": setup_test_child,
                "coins": 150,
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # Equip cosmetic
        response = await mock_hass.services.async_call(
            DOMAIN,
            "equip_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert response["equipped"] is True

    async def test_equip_unowned_cosmetic(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test equipping a cosmetic that's not owned fails."""
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "equip_cosmetic",
                {
                    "cosmetic_id": setup_test_cosmetic,
                    "child_id": setup_test_child,
                },
                blocking=True,
            )

    async def test_unequip_cosmetic(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test unequipping a cosmetic."""
        # Purchase and equip first
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": setup_test_child,
                "coins": 150,
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "equip_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # Unequip cosmetic
        response = await mock_hass.services.async_call(
            DOMAIN,
            "unequip_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert response["unequipped"] is True

    async def test_list_owned_cosmetics(self, mock_hass, setup_test_child, setup_test_cosmetic):
        """Test listing owned cosmetics."""
        # Purchase a cosmetic
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": setup_test_child,
                "coins": 150,
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {
                "cosmetic_id": setup_test_cosmetic,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # List owned cosmetics
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_owned_cosmetics",
            {"child_id": setup_test_child},
            blocking=True,
            return_response=True,
        )

        assert "cosmetics" in response
        assert len(response["cosmetics"]) >= 1
        assert any(c["id"] == setup_test_cosmetic for c in response["cosmetics"])

    async def test_delete_cosmetic(self, mock_hass, setup_test_cosmetic):
        """Test deleting a cosmetic."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "delete_cosmetic",
            {"cosmetic_id": setup_test_cosmetic},
            blocking=True,
            return_response=True,
        )

        assert response["deleted"] is True
