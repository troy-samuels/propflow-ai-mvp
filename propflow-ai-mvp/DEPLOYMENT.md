# PropFlow AI MVP Deployment Guide
## Production-Ready in 5 Minutes

🚀 **Quick Deploy**: Frontend → Vercel, Backend → Railway

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)

## 🎯 Option 1: One-Click Deploy (Recommended)

### Frontend Deployment (Vercel)

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project" → "Import Git Repository"
   - Select: `troy-samuels/propflow-ai-mvp`

2. **Configure Project**
   - **Root Directory**: `propflow-ai-mvp/frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

4. **Deploy** → Click "Deploy"
   - ✅ Live in ~2 minutes
   - 🌐 URL: `https://propflow-ai-mvp-frontend.vercel.app`

### Backend Deployment (Railway)

1. **Connect GitHub to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select: `troy-samuels/propflow-ai-mvp`

2. **Configure Service**
   - **Root Directory**: `propflow-ai-mvp/backend`
   - **Start Command**: `uvicorn mvp_main:app --host 0.0.0.0 --port $PORT`
   - Railway auto-detects Python and installs requirements.txt

3. **Environment Variables** (Optional)
   ```
   PORT=8000
   PYTHONPATH=/app
   ```

4. **Deploy** → Automatic deployment starts
   - ✅ Live in ~3 minutes
   - 🌐 URL: `https://propflow-ai-mvp-backend.railway.app`

5. **Update Frontend**
   - Copy Railway backend URL
   - Update Vercel environment variable: `REACT_APP_API_URL`
   - Redeploy frontend

## 🎯 Option 2: Manual Deployment

### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI
npm install -g @railway/cli
```

### Frontend (Vercel)
```bash
cd propflow-ai-mvp/frontend

# Build the project
npm install
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend.railway.app

# Redeploy with environment
vercel --prod
```

### Backend (Railway)
```bash
cd propflow-ai-mvp/backend

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Get URL
railway status
```

## 🌐 Expected URLs

After successful deployment:

- **Frontend**: `https://propflow-ai-mvp-frontend.vercel.app`
- **Backend**: `https://propflow-ai-mvp-backend.railway.app`
- **API Docs**: `https://propflow-ai-mvp-backend.railway.app/docs`

## ✅ Testing Deployment

### Backend Health Check
```bash
curl https://propflow-ai-mvp-backend.railway.app/
# Should return: {"status": "🤖 PropFlow AI MVP is running!"}
```

### Frontend Demo
1. Visit frontend URL
2. Should see "8-year-old simple" dashboard
3. Revenue opportunities should load
4. Property cards should display

### Full Integration Test
```bash
# Test dashboard API
curl https://propflow-ai-mvp-backend.railway.app/api/dashboard/demo_host_123
# Should return complete dashboard data
```

## 🔧 Troubleshooting

### Common Issues

**Vercel Build Fails**:
- Check `propflow-ai-mvp/frontend/package.json` has correct dependencies
- Verify React TypeScript setup
- Check build logs in Vercel dashboard

**Railway Deployment Fails**:
- Verify `requirements.txt` includes all dependencies
- Check Python version compatibility (3.11+ recommended)
- Review Railway logs for specific error

**CORS Issues**:
- Backend already configured for CORS with frontend domains
- Check `mvp_main.py` CORS middleware settings

**API Connection Failed**:
- Verify `REACT_APP_API_URL` environment variable
- Check backend is running: visit `/docs` endpoint
- Ensure Railway service is not sleeping (free tier sleeps after 30min)

## 🚀 Production Optimizations

### Vercel (Frontend)
- **Custom Domain**: Add your domain in Vercel settings
- **Analytics**: Enable Vercel Analytics for usage insights
- **Performance**: Vercel Edge Functions for global speed

### Railway (Backend)
- **Custom Domain**: Add your domain in Railway settings  
- **Database**: Add PostgreSQL service for persistence
- **Monitoring**: Railway provides built-in metrics
- **Scaling**: Auto-scales based on traffic

## 🎯 Next Steps

1. **Custom Domain**: Set up `app.propflow.ai`
2. **SSL Certificate**: Automatic with Vercel/Railway
3. **Monitoring**: Set up error tracking (Sentry)
4. **Analytics**: Add user behavior tracking
5. **Database**: Connect PostgreSQL for data persistence

## 📊 Deployment Costs

### Free Tier (Perfect for MVP)
- **Vercel**: 100GB bandwidth, unlimited static sites
- **Railway**: 500 hours/month, $0.02/hour after

### Estimated Monthly Costs
- **MVP Stage**: $0-5/month (within free tiers)
- **Growth Stage**: $20-50/month (custom domains, more resources)
- **Scale Stage**: $100-300/month (dedicated resources, multiple regions)

**Total deployment time: ~5 minutes for full-stack application** 🚀

## 🎉 Success Confirmation

When deployment is complete, you should have:

✅ Frontend live on Vercel with "8-year-old simple" interface  
✅ Backend live on Railway with auto-magic API endpoints  
✅ Full integration working between frontend and backend  
✅ Demo functionality accessible to show investors/users  
✅ Production URLs ready for sharing and testing  

**PropFlow AI MVP is now live and ready to revolutionize property management!** 🦅