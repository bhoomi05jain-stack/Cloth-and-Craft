from typing import List, Dict, Tuple
from app.schemas.models import (
    GarmentItem,
    OutfitRecommendationRequest,
    OutfitComposition,
    RecommendationResponse,
)
from app.models.clip_service import CLIPEmbeddingService

UNAVAILABLE = {"inlaundry", "washing", "drying", "damaged", "in_laundry", "inlaundry"}
TOP_CATS = {"tops", "top", "shirt", "kurti"}
BOTTOM_CATS = {"bottoms", "bottom", "jeans", "pants", "skirt", "trousers"}
DRESS_CATS = {"dresses", "dress", "traditional", "gown", "one-piece"}
OUTER_CATS = {"outerwear", "jacket", "coat", "blazer", "sweater"}
SHOE_CATS = {"shoes", "footwear", "sneakers", "heels", "boots", "sandals"}
BAG_CATS = {"bags", "bag", "tote", "handbag"}
ACC_CATS = {"accessories", "jewellery", "jewelry", "sunglasses", "scarves"}


class OutfitRecommendationEngine:
    def __init__(self):
        self.clip = CLIPEmbeddingService()
        self.weights = {
            "occasion": 0.25,
            "mood": 0.20,
            "color": 0.15,
            "weather": 0.10,
            "category": 0.10,
            "accessory": 0.05,
            "novelty": 0.10,
            "feedback": 0.05,
        }

    def generate_recommendations(self, req: OutfitRecommendationRequest) -> RecommendationResponse:
        clean_garments = [
            g
            for g in req.available_garments
            if g.status.replace(" ", "").replace("_", "").lower() not in UNAVAILABLE
        ]

        if not clean_garments:
            return RecommendationResponse(
                status="empty_wardrobe",
                is_ml_accelerated=self.clip.is_loaded,
                total_candidates_generated=0,
                recommendations=[],
                message="All garments are currently in laundry or unavailable. Please mark clean items in Laundry Tracker.",
            )

        tops = [g for g in clean_garments if g.category.lower() in TOP_CATS]
        bottoms = [g for g in clean_garments if g.category.lower() in BOTTOM_CATS]
        dresses = [g for g in clean_garments if g.category.lower() in DRESS_CATS]
        outerwear = [g for g in clean_garments if g.category.lower() in OUTER_CATS]
        shoes = [g for g in clean_garments if g.category.lower() in SHOE_CATS]
        bags = [g for g in clean_garments if g.category.lower() in BAG_CATS]
        accessories = [g for g in clean_garments if g.category.lower() in ACC_CATS]

        candidates: List[List[GarmentItem]] = []

        for t in tops:
            for b in bottoms:
                combo = [t, b]
                if shoes:
                    combo.append(shoes[abs(hash(t.id + b.id)) % len(shoes)])
                if bags:
                    combo.append(bags[abs(hash(t.id + b.id)) % len(bags)])
                if accessories:
                    combo.append(accessories[abs(hash(t.id + b.id)) % len(accessories)])
                if outerwear and ((req.temperature_c and req.temperature_c < 20.0) or (abs(hash(t.id)) % 2 == 0)):
                    combo.append(outerwear[abs(hash(t.id)) % len(outerwear)])
                candidates.append(combo)

        for d in dresses:
            combo = [d]
            if shoes:
                combo.append(shoes[abs(hash(d.id)) % len(shoes)])
            if bags:
                combo.append(bags[abs(hash(d.id)) % len(bags)])
            if accessories:
                combo.append(accessories[abs(hash(d.id)) % len(accessories)])
            if outerwear and (req.temperature_c and req.temperature_c < 22.0):
                combo.append(outerwear[abs(hash(d.id)) % len(outerwear)])
            candidates.append(combo)

        if not candidates:
            return RecommendationResponse(
                status="empty_wardrobe",
                is_ml_accelerated=self.clip.is_loaded,
                total_candidates_generated=0,
                recommendations=[],
                message="Need a Top + Bottom or a Dress plus footwear-capable wardrobe to style an outfit.",
            )

        scored: List[Tuple[float, Dict[str, float], List[GarmentItem]]] = []
        for cand in candidates:
            combo_key = "|".join(sorted(i.id for i in cand))
            if combo_key in req.history_outfit_ids:
                score, breakdown = self._evaluate_candidate(cand, req, novelty=0.35)
            else:
                score, breakdown = self._evaluate_candidate(cand, req)
            scored.append((score, breakdown, cand))

        scored.sort(key=lambda x: x[0], reverse=True)

        results: List[OutfitComposition] = []
        seen_lead_ids = set()

        for idx, (score, breakdown, items) in enumerate(scored):
            lead_id = items[0].id
            if lead_id in seen_lead_ids and len(results) < max(1, req.max_recommendations - 1):
                continue
            seen_lead_ids.add(lead_id)

            results.append(
                OutfitComposition(
                    id=f"rec-{idx + 1}-{items[0].id[:8]}",
                    name=self._generate_outfit_title(items, req.occasion, req.moods),
                    occasion=req.occasion,
                    mood_compatibility=f"{int(breakdown['mood'] * 100)}% Match with {req.moods[0] if req.moods else 'Daily Vibe'}",
                    match_score=round(score * 100, 1),
                    score_breakdown={k: round(v * 100, 1) for k, v in breakdown.items()},
                    items=items,
                    explanation=self._build_explanation(items, req.occasion, req.moods, score),
                    styling_tips=[
                        f"Pair with {items[2].name if len(items) > 2 else 'clean accessories'} for balanced editorial proportions.",
                        f"Color harmony evaluated at {int(breakdown['color'] * 100)}% with soft neutral undertones.",
                    ],
                    hairstyle_suggestions=(
                        "Loose natural waves or slicked high bun."
                        if "Formal" in req.occasion or "Party" in req.occasion
                        else "Relaxed half-up or soft low pony."
                    ),
                    weather_suitability=f"Optimized for {req.weather} {req.temperature_c}°C",
                    is_laundry_safe=True,
                )
            )
            if len(results) >= req.max_recommendations:
                break

        return RecommendationResponse(
            status="success",
            is_ml_accelerated=self.clip.is_loaded,
            total_candidates_generated=len(candidates),
            recommendations=results,
        )

    def _evaluate_candidate(
        self, items: List[GarmentItem], req: OutfitRecommendationRequest, novelty=None
    ) -> Tuple[float, Dict[str, float]]:
        occ_matches = sum(1 for item in items if req.occasion.lower() in [o.lower() for o in item.occasion])
        s_occasion = min(1.0, 0.6 + (occ_matches / max(len(items), 1)) * 0.4)

        mood_matches = 0
        target_moods = [m.lower() for m in req.moods]
        for item in items:
            for s in item.style:
                if any(tm in s.lower() for tm in target_moods):
                    mood_matches += 1
        s_mood = min(1.0, 0.5 + (mood_matches * 0.2))

        colors = [item.color.lower() for item in items]
        has_avoided = any(c in [ac.lower() for ac in req.colors_to_avoid] for c in colors)
        has_preferred = any(c in [pc.lower() for pc in req.preferred_colors] for c in colors)
        s_color = 0.3 if has_avoided else (0.95 if has_preferred else 0.85)

        temp = req.temperature_c or 22.0
        has_outer = any(i.category.lower() in OUTER_CATS for i in items)
        if temp < 18.0:
            s_weather = 0.95 if has_outer else 0.70
        elif temp > 25.0:
            s_weather = 0.65 if has_outer else 0.95
        else:
            s_weather = 0.90

        cats = {i.category.lower() for i in items}
        has_tb = bool(cats & TOP_CATS) and bool(cats & BOTTOM_CATS)
        has_dress = bool(cats & DRESS_CATS)
        s_category = 1.0 if has_tb or has_dress else 0.4

        has_acc = any(i.category.lower() in ACC_CATS | BAG_CATS for i in items)
        s_accessory = 0.95 if has_acc else 0.75

        combo_key = "|".join(sorted(i.id for i in items))
        s_novelty = novelty if novelty is not None else (0.50 if combo_key in req.history_outfit_ids else 0.90)
        s_feedback = 0.85

        breakdown = {
            "occasion": s_occasion,
            "mood": s_mood,
            "color": s_color,
            "weather": s_weather,
            "category": s_category,
            "accessory": s_accessory,
            "novelty": s_novelty,
            "feedback": s_feedback,
        }
        total_score = sum(breakdown[k] * self.weights[k] for k in self.weights)
        return total_score, breakdown

    def _generate_outfit_title(self, items: List[GarmentItem], occasion: str, moods: List[str]) -> str:
        mood_str = moods[0] if moods else "Effortless"
        lead_piece = items[0].name.split()[0]
        return f"{mood_str} {lead_piece} Ensemble"

    def _build_explanation(self, items: List[GarmentItem], occasion: str, moods: List[str], score: float) -> str:
        primary = items[0]
        secondary = items[1] if len(items) > 1 else items[0]
        return (
            f"Curated for your '{occasion}' event with a '{moods[0] if moods else 'refined'}' mood. "
            f"Combines {primary.name} with {secondary.name} for an elegant, laundry-safe silhouette."
        )
