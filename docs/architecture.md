# Closet Craft Architecture

Monorepo: React frontend (`:3000`), Express API (`:4000`), FastAPI ML (`:8000`), PostgreSQL (`:5432`).

Local development can run without Docker: the Express API uses an in-memory/SQLite store when `USE_PRISMA=false`, and the ML service falls back from CLIP ViT-B/32 to a metadata + color-theory ranker when PyTorch weights are unavailable.
