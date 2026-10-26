from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GarmentItem(BaseModel):
    id: str
    name: str
    category: str # tops, bottoms, dresses, outerwear, shoes, bags, accessories, traditional
    subcategory: Optional[str] = None
    color: str
    color_hex: Optional[str] = '#FFFFFF'
    pattern: Optional[str] = 'Solid'
    material: Optional[str] = None
    season: List[str] = Field(default_factory=list)
    style: List[str] = Field(default_factory=list)
    occasion: List[str] = Field(default_factory=list)
    status: str = 'Clean' # Clean, Worn, InLaundry, Washing, Drying, ReadyToWear, Damaged
    wear_count: int = 0
    image: Optional[str] = None
    embedding: Optional[List[float]] = None

class OutfitRecommendationRequest(BaseModel):
    user_id: str
    moods: List[str] = Field(default_factory=list)
    occasion: str = 'Casual outing'
    style_preference: Optional[str] = None
    preferred_colors: List[str] = Field(default_factory=list)
    colors_to_avoid: List[str] = Field(default_factory=list)
    weather: Optional[str] = 'Sunny'
    temperature_c: Optional[float] = 22.0
    season: Optional[str] = 'Summer'
    available_garments: List[GarmentItem] = Field(default_factory=list)
    max_recommendations: int = 6
    history_outfit_ids: List[str] = Field(default_factory=list)

class OutfitComposition(BaseModel):
    id: str
    name: str
    occasion: str
    mood_compatibility: str
    match_score: float
    score_breakdown: Dict[str, float]
    items: List[GarmentItem]
    explanation: str
    styling_tips: List[str]
    hairstyle_suggestions: Optional[str] = None
    weather_suitability: str
    is_laundry_safe: bool = True

class RecommendationResponse(BaseModel):
    status: str = 'success'
    is_ml_accelerated: bool = True
    total_candidates_generated: int
    recommendations: List[OutfitComposition]
    message: Optional[str] = None

class AccessoryRequest(BaseModel):
    outfit_id: str
    outfit_colors: List[str]
    occasion: str
    mood: Optional[str] = None
    available_accessories: List[GarmentItem] = Field(default_factory=list)

class AccessoryResponse(BaseModel):
    status: str = 'success'
    owned_accessories: List[GarmentItem]
    suggested_styling_notes: List[str]

class ClassificationRequest(BaseModel):
    image_base64_or_url: str
    file_name: Optional[str] = None

class ClassificationResponse(BaseModel):
    category: str
    subcategory: str
    dominant_color: str
    color_hex: str
    pattern: str
    style_tags: List[str]
    suitable_seasons: List[str]
    confidence_score: float

class FeedbackRequest(BaseModel):
    user_id: str
    outfit_id: str
    rating: int # 1 to 5
    is_vibe: bool
    comments: Optional[str] = None
