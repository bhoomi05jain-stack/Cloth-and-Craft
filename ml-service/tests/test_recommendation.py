from app.recommendation.engine import OutfitRecommendationEngine
from app.schemas.models import OutfitRecommendationRequest, GarmentItem


def _engine():
    return OutfitRecommendationEngine()


def test_engine_hard_constraints_filters_laundry():
    engine = _engine()
    items = [
        GarmentItem(id="1", name="Clean Top", category="tops", color="White", status="Clean"),
        GarmentItem(id="2", name="Dirty Top", category="tops", color="Black", status="InLaundry"),
        GarmentItem(id="3", name="Clean Bottom", category="bottoms", color="Blue", status="Clean"),
    ]
    req = OutfitRecommendationRequest(
        user_id="u1", occasion="Casual outing", moods=["Happy"], available_garments=items
    )
    res = engine.generate_recommendations(req)
    assert res.status == "success"
    for out in res.recommendations:
        item_ids = [i.id for i in out.items]
        assert "2" not in item_ids
        assert "1" in item_ids
        assert "3" in item_ids


def test_engine_filters_washing_drying_damaged():
    engine = _engine()
    items = [
        GarmentItem(id="t", name="Top", category="tops", color="White", status="Washing"),
        GarmentItem(id="b", name="Bottom", category="bottoms", color="Blue", status="Damaged"),
        GarmentItem(id="d", name="Dress", category="dresses", color="Red", status="Drying"),
    ]
    res = engine.generate_recommendations(
        OutfitRecommendationRequest(user_id="u1", available_garments=items)
    )
    assert res.status == "empty_wardrobe"
    assert res.recommendations == []


def test_engine_empty_wardrobe_returns_graceful_message():
    engine = _engine()
    req = OutfitRecommendationRequest(user_id="u1", available_garments=[])
    res = engine.generate_recommendations(req)
    assert res.status == "empty_wardrobe"
    assert len(res.recommendations) == 0


def test_engine_incomplete_structure_is_empty():
    engine = _engine()
    items = [GarmentItem(id="1", name="Only Top", category="tops", color="White", status="Clean")]
    res = engine.generate_recommendations(
        OutfitRecommendationRequest(user_id="u1", available_garments=items)
    )
    assert res.status == "empty_wardrobe"


def test_engine_weights_and_breakdown():
    engine = _engine()
    assert abs(sum(engine.weights.values()) - 1.0) < 1e-9
    items = [
        GarmentItem(
            id="top1",
            name="Ivory Silk Blouse",
            category="tops",
            color="Cream",
            style=["Clean & Minimal"],
            occasion=["Office"],
            status="Clean",
        ),
        GarmentItem(
            id="bot1",
            name="Pleated Beige Trousers",
            category="bottoms",
            color="Beige",
            style=["Clean & Minimal"],
            occasion=["Office"],
            status="Clean",
        ),
    ]
    req = OutfitRecommendationRequest(
        user_id="u1",
        occasion="Office",
        moods=["Minimalist"],
        preferred_colors=["Cream", "Beige"],
        available_garments=items,
    )
    res = engine.generate_recommendations(req)
    assert len(res.recommendations) > 0
    rec = res.recommendations[0]
    assert rec.match_score > 80.0
    for key in engine.weights:
        assert key in rec.score_breakdown


def test_engine_novelty_downranks_history():
    engine = _engine()
    items = [
        GarmentItem(id="top1", name="Top", category="tops", color="White", status="Clean"),
        GarmentItem(id="bot1", name="Bottom", category="bottoms", color="Blue", status="Clean"),
    ]
    combo_key = "|".join(sorted(["top1", "bot1"]))
    fresh = engine.generate_recommendations(
        OutfitRecommendationRequest(user_id="u1", available_garments=items)
    )
    seen = engine.generate_recommendations(
        OutfitRecommendationRequest(user_id="u1", available_garments=items, history_outfit_ids=[combo_key])
    )
    assert fresh.recommendations[0].score_breakdown["novelty"] > seen.recommendations[0].score_breakdown["novelty"]
