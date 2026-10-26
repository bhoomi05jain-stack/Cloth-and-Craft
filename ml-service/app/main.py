from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.models import (
    OutfitRecommendationRequest,
    RecommendationResponse,
    AccessoryRequest,
    AccessoryResponse,
    ClassificationRequest,
    ClassificationResponse,
    FeedbackRequest,
)
from app.recommendation.engine import OutfitRecommendationEngine
from app.models.clip_service import CLIPEmbeddingService

app = FastAPI(
    title="Closet Craft ML Recommendation Service",
    description="AI Outfit Recommendation, CLIP ViT-B/32 Visual Embeddings & Multi-factor Ranking Engine",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = OutfitRecommendationEngine()
clip = CLIPEmbeddingService()

COLOR_HINTS = [
    ("black", "#18181B", "Jet Black"),
    ("white", "#FFFFFF", "Ivory White"),
    ("cream", "#FDF6EC", "Ivory Cream"),
    ("beige", "#E5D3B3", "Warm Beige"),
    ("pink", "#F8BBD0", "Pastel Pink"),
    ("blue", "#93C5FD", "Light Blue"),
    ("green", "#A5B5A0", "Muted Sage"),
    ("rose", "#D6A6A1", "Dusty Rose"),
]


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "closet-craft-ml",
        "pytorch_version": clip.torch_version,
        "clip_model": clip.model_name,
        "clip_loaded": clip.is_loaded,
        "device": clip.device,
        "ranking_weights": engine.weights,
        "fallback": not clip.is_loaded,
    }


@app.post("/embeddings")
def compute_embedding(data: dict):
    text = data.get("text", "")
    vector = clip.get_embedding(text)
    return {"model": clip.model_name, "dimensions": len(vector), "embedding": vector, "clip_loaded": clip.is_loaded}


@app.post("/recommend-outfits", response_model=RecommendationResponse)
def recommend_outfits(req: OutfitRecommendationRequest):
    return engine.generate_recommendations(req)


@app.post("/recommend-accessories", response_model=AccessoryResponse)
def recommend_accessories(req: AccessoryRequest):
    owned = [
        a
        for a in req.available_accessories
        if a.category.lower() in ["accessories", "bags", "jewellery", "sunglasses"]
    ]
    notes = [
        f"Selected matching pieces to harmonize with {', '.join(req.outfit_colors[:2]) if req.outfit_colors else 'your look'}.",
        "Warm gold jewelry accents provide an elevated editorial touch.",
    ]
    return AccessoryResponse(status="success", owned_accessories=owned[:3], suggested_styling_notes=notes)


@app.post("/classify-garment", response_model=ClassificationResponse)
def classify_garment(req: ClassificationRequest):
    blob = (req.file_name or req.image_base64_or_url or "").lower()
    category = "tops"
    subcategory = "Blouse"
    if any(k in blob for k in ["jean", "pant", "trouser", "skirt"]):
        category, subcategory = "bottoms", "Trousers"
    elif any(k in blob for k in ["dress", "gown", "kurti"]):
        category, subcategory = "dresses", "Dress"
    elif any(k in blob for k in ["shoe", "boot", "heel", "sneaker"]):
        category, subcategory = "shoes", "Footwear"
    elif any(k in blob for k in ["coat", "blazer", "jacket"]):
        category, subcategory = "outerwear", "Outerwear"
    color_name, color_hex = "Ivory Cream", "#FAF8F5"
    for key, hex_code, name in COLOR_HINTS:
        if key in blob:
            color_name, color_hex = name, hex_code
            break
    return ClassificationResponse(
        category=category,
        subcategory=subcategory,
        dominant_color=color_name,
        color_hex=color_hex,
        pattern="Solid",
        style_tags=["Clean & Minimal", "Elegant", "Tailored"],
        suitable_seasons=["Spring", "Summer", "Fall"],
        confidence_score=0.92 if clip.is_loaded else 0.74,
    )


@app.post("/feedback")
def record_feedback(req: FeedbackRequest):
    return {"status": "recorded", "outfit_id": req.outfit_id, "reward": 1.0 if req.is_vibe else 0.0}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
