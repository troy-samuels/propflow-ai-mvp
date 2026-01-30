# 🤖 PropFlow AI MVP

**"8-Year-Old Simple" Property Management Platform**

Zero configuration, maximum automation, pure magic.

![PropFlow AI MVP](https://img.shields.io/badge/PropFlow-AI%20MVP-blue) ![Python](https://img.shields.io/badge/Python-3.11-green) ![React](https://img.shields.io/badge/React-18.2-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-red)

---

## 🚀 **What is PropFlow AI?**

PropFlow AI MVP is an intelligent property management platform that automates the tedious parts of running vacation rentals, Airbnbs, and rental properties. It's designed to be so simple that an 8-year-old could use it, yet powerful enough to save property managers 15+ hours per week.

### ✨ **Core Magic**

- **💰 Revenue Magic:** Auto-detect pricing opportunities (+$15K-50K/year)
- **🧹 Cleaner Magic:** Auto-assign cleaners + backup system (15+ hrs/week saved)
- **💬 Guest Magic:** 90% auto-response rate (8-12 hrs/week saved)
- **📅 Calendar Magic:** Sync all platforms, prevent double bookings

---

## 🎯 **Features**

### 🤖 **Automation First**
- **Smart Revenue Optimization:** Automatically detects events (Formula 1, concerts, festivals) and suggests optimal pricing
- **Cleaner Management:** Auto-schedules cleaners, manages backups, tracks completion
- **Guest Communication:** AI handles 90% of guest messages automatically
- **Calendar Synchronization:** Prevents double-bookings across all platforms

### 📊 **Real-Time Dashboard**
- **Property Overview:** Live status of all properties
- **Revenue Insights:** Track weekly revenue and optimization opportunities
- **Cleaning Status:** Real-time cleaner schedules and completion tracking
- **Guest Timeline:** Upcoming arrivals, departures, and special requests

### 🎮 **8-Year-Old Simple Interface**
- One-click revenue optimization
- Visual property cards with emoji status
- Zero configuration required
- Magic happens automatically

---

## 🏃‍♂️ **Quick Start**

### **Prerequisites**
- Node.js 16+ 
- Python 3.11+
- Git

### **1. Clone & Setup**
```bash
git clone https://github.com/troy-samuels/propflow-ai-mvp.git
cd propflow-ai-mvp
```

### **2. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

### **4. Open & Experience the Magic**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📁 **Project Structure**

```
propflow-ai-mvp/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # Railway-optimized entry point
│   ├── MVP_BackendService.py  # Core business logic
│   ├── mvp_main.py           # Full-featured FastAPI server
│   ├── requirements.txt      # Python dependencies
│   ├── railway.json          # Railway deployment config
│   └── nixpacks.toml         # Build configuration
├── frontend/                  # React TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── MVP_PropFlowDashboard.tsx  # Main dashboard
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API integration
│   │   └── models/           # TypeScript interfaces
│   ├── public/
│   └── package.json
├── docs/                     # Documentation
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

---

## 🛠 **Technology Stack**

### **Backend**
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python 3.11** - Latest Python features

### **Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Custom styling
- **React Scripts** - Build tooling

### **Deployment**
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting
- **Nixpacks** - Smart build system

---

## 📡 **API Endpoints**

### **Core Endpoints**
```http
GET /                           # Health check
GET /api/dashboard/{host_id}    # Complete dashboard data
GET /api/magic-stats           # Automation statistics
POST /api/apply-pricing        # One-click revenue optimization
POST /api/demo/trigger-opportunity  # Demo money opportunity
```

### **Example Response**
```json
{
  "properties": [
    {
      "id": "1",
      "name": "Manhattan Loft",
      "weekly_revenue": 2847.0,
      "status": "good",
      "cleaner_name": "Maria",
      "next_guest": "Jake & Sarah"
    }
  ],
  "money_opportunity": {
    "event": "🏎️ Formula 1 Race This Weekend!",
    "extra_money": 2847.0,
    "confidence": 0.94
  },
  "magic_stats": {
    "auto_handled_messages": 47,
    "revenue_optimizations": 3,
    "total_time_saved_hours": 8.5
  }
}
```

---

## 🚀 **Deployment**

### **Railway (Backend)**
1. Connect GitHub to Railway
2. Select: `troy-samuels/propflow-ai-mvp`
3. **Root Directory:** `backend`
4. Deploy automatically

### **Vercel (Frontend)**
1. Connect GitHub to Vercel
2. Select: `troy-samuels/propflow-ai-mvp`
3. **Root Directory:** `frontend`
4. Deploy automatically

### **Environment Variables**
```bash
# Backend (Optional)
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
WEBHOOK_SECRET=your-secret

# Frontend
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## 🎮 **Usage Examples**

### **1. Revenue Optimization**
```bash
# Check for opportunities
curl http://localhost:8000/api/dashboard/your-id

# Apply Formula 1 weekend pricing
curl -X POST http://localhost:8000/api/apply-pricing
```

### **2. Magic Statistics**
```javascript
// Get automation stats
fetch('/api/magic-stats')
  .then(res => res.json())
  .then(stats => {
    console.log(`Saved ${stats.magic_level.total_time_saved_hours} hours!`);
  });
```

---

## 🎯 **Demo Features**

### **Properties**
- **Manhattan Loft:** High-end property with Maria as cleaner
- **Brooklyn House:** Family-friendly with Carlos as cleaner

### **Live Opportunities**
- Formula 1 Race Weekend: +$2,847 potential
- Concert Events: Dynamic pricing suggestions
- Local Festivals: Auto-detection and optimization

### **Automation Stats**
- 47 messages auto-handled today
- 8.5 hours saved this week
- 94% automation rate
- 99.2% cleaning reliability

---

## 🛡 **Security & Production**

### **Security Features**
- CORS protection for API access
- Input validation with Pydantic
- Environment-based configuration
- Safe error handling

### **Production Considerations**
- Rate limiting (coming soon)
- Database integration (PostgreSQL ready)
- Monitoring and logging
- Backup and recovery

---

## 🤝 **Contributing**

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin amazing-feature`
5. Open a Pull Request

---

## 📝 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

- **Issues:** https://github.com/troy-samuels/propflow-ai-mvp/issues
- **Discussions:** https://github.com/troy-samuels/propflow-ai-mvp/discussions
- **Email:** support@propflow.ai

---

## 🎉 **Acknowledgments**

Built with ❤️ using:
- FastAPI for the blazing-fast backend
- React for the smooth frontend
- Railway & Vercel for seamless deployment
- The amazing open-source community

---

**PropFlow AI MVP - Making property management magically simple since 2026! 🦅**

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/link-to-template)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftroy-samuels%2Fpropflow-ai-mvp)