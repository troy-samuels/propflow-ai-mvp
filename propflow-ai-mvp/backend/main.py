"""
PropFlow AI MVP - Railway Deployment Version
Simplified for reliable deployment
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

app = FastAPI(
    title="PropFlow AI MVP",
    description="8-Year-Old Simple Property Management",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple data models
class Property(BaseModel):
    id: str
    name: str
    weekly_revenue: float
    status: str
    cleaner_name: Optional[str] = None
    cleaning_time: Optional[str] = None
    next_guest: Optional[str] = None
    guest_arrival_time: Optional[str] = None
    unhandled_messages: int = 0
    is_clean: bool = True

class MoneyOpportunity(BaseModel):
    id: str
    event: str
    extra_money: float
    confidence: float

@app.get("/")
async def root():
    """Health check - confirms the magic is working"""
    return {
        "status": "🤖 PropFlow AI MVP is running!",
        "magic_level": "Maximum",
        "configuration_required": "Zero",
        "simplicity_score": "8-year-old approved ✅"
    }

@app.get("/api/dashboard/{host_id}")
async def get_dashboard(host_id: str):
    """
    Get all dashboard data in one call
    Zero configuration required - just pure magic
    """
    # Mock data for MVP demonstration
    properties = [
        {
            "id": "1",
            "name": "Manhattan Loft",
            "weekly_revenue": 2847.0,
            "status": "good",
            "cleaner_name": "Maria",
            "cleaning_time": "3:00 PM",
            "next_guest": "Jake & Sarah",
            "guest_arrival_time": "3:00 PM",
            "unhandled_messages": 0,
            "is_clean": False
        },
        {
            "id": "2",
            "name": "Brooklyn House",
            "weekly_revenue": 1923.0,
            "status": "needs-attention",
            "cleaner_name": "Carlos",
            "cleaning_time": "Friday 2:00 PM",
            "next_guest": "Ready for guests",
            "guest_arrival_time": "",
            "unhandled_messages": 1,
            "is_clean": True
        }
    ]
    
    money_opportunity = {
        "id": "1",
        "event": "🏎️ Formula 1 Race This Weekend!",
        "extra_money": 2847.0,
        "confidence": 0.94
    }
    
    return {
        "properties": properties,
        "money_opportunity": money_opportunity,
        "overall_status": "good",
        "total_weekly_revenue": sum(p["weekly_revenue"] for p in properties),
        "magic_stats": {
            "auto_handled_messages": 47,
            "revenue_optimizations": 3,
            "bookings_synced": 12
        }
    }

@app.post("/api/apply-pricing")
async def apply_pricing():
    """One-click revenue optimization"""
    return {
        "success": True,
        "properties_updated": 2,
        "estimated_extra_revenue": 2847.0,
        "auto_applied": True,
        "celebration": "🎉 You just made extra money!",
        "magic_applied": True
    }

@app.get("/api/magic-stats")
async def get_magic_stats():
    """Show how much work the AI is doing automatically"""
    return {
        "today_stats": {
            "messages_auto_handled": 47,
            "revenue_optimizations": 3,
            "cleaners_auto_booked": 5,
            "calendar_conflicts_resolved": 2,
            "total_time_saved_hours": 8.5
        },
        "this_week_stats": {
            "extra_revenue_generated": 4247.50,
            "guest_satisfaction_score": 4.9,
            "cleaning_reliability": "99.2%",
            "response_time_average": "28 seconds"
        },
        "magic_level": {
            "automation_percentage": 94,
            "manual_tasks_eliminated": 156,
            "host_stress_reduction": "87%",
            "8_year_old_usability": "✅ Approved"
        }
    }

@app.post("/api/demo/trigger-opportunity")
async def trigger_demo_opportunity():
    """Demo endpoint to simulate a money opportunity appearing"""
    return {
        "demo_triggered": True,
        "opportunity": {
            "event": "🎪 Music Festival This Weekend!",
            "extra_money": 1250,
            "confidence": 0.91,
            "user_message": "💰 New money opportunity detected!"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)