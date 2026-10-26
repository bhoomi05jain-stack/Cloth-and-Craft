import math
from typing import List, Optional

CLIP_CHECKPOINT = "openai/clip-vit-base-patch32"


class CLIPEmbeddingService:
    """CLIP ViT-B/32 with deterministic fallback when weights or GPU are absent."""

    def __init__(self):
        self.model_name = CLIP_CHECKPOINT
        self.is_loaded = False
        self.torch_version: Optional[str] = None
        self.device = "cpu"
        self._model = None
        self._processor = None
        try:
            import torch

            self.torch_version = torch.__version__
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            try:
                from transformers import CLIPModel, CLIPProcessor

                self._processor = CLIPProcessor.from_pretrained(CLIP_CHECKPOINT)
                self._model = CLIPModel.from_pretrained(CLIP_CHECKPOINT)
                self._model.eval()
                self.is_loaded = True
            except Exception:
                self.is_loaded = False
        except ImportError:
            self.torch_version = None
            self.is_loaded = False

    def get_embedding(self, text_or_tags: str) -> List[float]:
        if self.is_loaded and self._model is not None and self._processor is not None:
            try:
                import torch

                inputs = self._processor(text=[text_or_tags], return_tensors="pt", padding=True)
                with torch.no_grad():
                    feats = self._model.get_text_features(**inputs)[0]
                    feats = feats / feats.norm()
                    return [round(float(x), 5) for x in feats.tolist()]
            except Exception:
                pass
        return self._fallback_embedding(text_or_tags)

    def _fallback_embedding(self, text_or_tags: str) -> List[float]:
        vector = []
        seed = sum(ord(c) for c in text_or_tags) or 1
        for i in range(512):
            val = math.sin(seed * (i + 1) * 0.1337) * math.cos((seed + i) * 0.042)
            vector.append(val)
        norm = math.sqrt(sum(x * x for x in vector)) or 1.0
        return [round(x / norm, 5) for x in vector]

    def cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        if not v1 or not v2 or len(v1) != len(v2):
            return 0.5
        dot = sum(a * b for a, b in zip(v1, v2))
        return max(0.0, min(1.0, (dot + 1.0) / 2.0))
