# PropFlow AI MVP
## "8-Year-Old Simple" Property Management

🎯 **Design Principle**: If an 8-year-old can't use it, it's too complex.

## Project Structure

```
propflow-ai-mvp/
├── frontend/           # React frontend - "8-year-old simple" UI
│   ├── src/           # React components and logic
│   ├── MVP_PropFlowDashboard.tsx  # Main dashboard component
│   ├── MVP_PropFlow.css          # Simple styling system
│   └── package.json              # Frontend dependencies
├── backend/            # Python FastAPI backend
│   ├── MVP_BackendService.py     # Auto-magic business logic
│   ├── mvp_main.py              # FastAPI server
│   ├── demo_mvp.py              # Complete demo script
│   └── requirements.txt         # Backend dependencies
├── docs/              # Complete documentation
│   ├── README_MVP.md           # Main project overview
│   ├── MVP_DESIGN_PRINCIPLES.md # "8-year-old simple" philosophy
│   ├── MVP_SETUP_GUIDE.md      # Setup instructions
│   └── CORE_4_FEATURES.md      # Core feature documentation
└── scripts/           # Deployment and utility scripts
```

## Quick Start

### Run the Demo
```bash
cd backend
python demo_mvp.py
```

### Full MVP
```bash
# Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python mvp_main.py

# Frontend (Terminal 2)
cd frontend
npm install && npm start

# Visit: http://localhost:3000
```

## Core Features

1. 💰 **Revenue Magic** - Auto-detect pricing opportunities (+$15K-50K/year)
2. 🧹 **Cleaner Magic** - Auto-assign cleaners + backup system (15+ hrs/week saved)
3. 💬 **Guest Magic** - 90% auto-response to common questions (8-12 hrs/week saved)
4. 📅 **Calendar Magic** - Sync all platforms, prevent double bookings

## Documentation

- **[Complete Overview](docs/README_MVP.md)** - Full project documentation
- **[Setup Guide](docs/MVP_SETUP_GUIDE.md)** - Installation and configuration
- **[Design Principles](docs/MVP_DESIGN_PRINCIPLES.md)** - "8-year-old simple" philosophy
- **[Core Features](docs/CORE_4_FEATURES.md)** - Detailed feature analysis

## Success Metrics

- ⏱️ **Time to value**: Under 2 minutes
- 🖱️ **Daily clicks**: Under 5 total
- 💰 **Revenue increase**: +25% per property
- ⏰ **Time saved**: 20+ hours/week

**Built for simplicity, designed for scale.** 🦅