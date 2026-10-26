# ✨ Closet Craft

> **Your Mood. Your Style. Your Outfit.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://bhoomi05jain-stack.github.io/Cloth-and-Craft/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/bhoomi05jain-stack/Cloth-and-Craft)

---

## 🚀 Live Deployment
- **Web App (GitHub Pages)**: [https://bhoomi05jain-stack.github.io/Cloth-and-Craft/](https://bhoomi05jain-stack.github.io/Cloth-and-Craft/)
- **API Health**: `https://api.closetcraft.app/api/health`

---

## 👗 Overview
Closet Craft is an intelligent personal styling and outfit-generation platform that generates customized outfits based on the user's mood, occasion, color preferences, personal style, weather, clothing availability, and laundry tracking.

### Architecture
- **Frontend**: Mobile-first luxury fashion app (Pinterest-inspired UI, flat-lay 2x2 collage cards, style spectrum sliders, calendar integration).
- **Backend API**: Node.js & Express API with JWT authentication, Zod validation, and Prisma ORM schemas.
- **ML Service**: Python FastAPI service utilizing CLIP ViT-B/32 visual embeddings and an 8-factor ranking engine with strict laundry constraints.
- **Database**: PostgreSQL with normalized schema for garments, outfits, accessories, and wear analytics.

---

## 🛠 Local Setup

### 1. Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
python -m pytest tests/ -v
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Backend API
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend App
Open `index.html` in your browser or run:
```bash
python server.py
# Open http://localhost:8080 in your browser
```

### 4. Docker Deployment
```bash
docker compose up --build
```

---

## 👤 Author
- **GitHub**: [@bhoomi05jain-stack](https://github.com/bhoomi05jain-stack)
- **Repository**: [Cloth-and-Craft](https://github.com/bhoomi05jain-stack/Cloth-and-Craft)
