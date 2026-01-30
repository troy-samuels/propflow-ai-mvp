# PropFlow AI Backend
## Auto-Magic Property Management Service

🤖 **Philosophy**: Complex automation, zero configuration, pure magic.

## Structure

```
backend/
├── MVP_BackendService.py    # Core business logic with smart automation
├── mvp_main.py             # FastAPI server with simple endpoints
├── demo_mvp.py             # Complete functionality demo
└── requirements.txt        # Python dependencies
```

## Core Service (`MVP_BackendService.py`)

### Auto-Magic Features
```python
# Revenue optimization - runs automatically
async def detect_money_opportunities():
    events = detect_local_events()          # Formula 1, concerts, etc.
    competitors = scrape_competitor_prices() 
    demand = analyze_booking_patterns()
    return big_opportunities_only()

# Cleaner coordination - zero manual work
async def auto_book_cleaner(checkout_event):
    best = find_top_rated_cleaner()
    backups = book_two_backup_cleaners()
    send_property_access_details()

# Guest communication - 90% auto-handled  
async def handle_guest_message(message):
    if is_common_question(): respond_instantly()
    else: escalate_with_suggested_response()
```

### Smart Defaults
- **Revenue**: Auto-apply changes under $50, ask for $50+
- **Cleaning**: Always book top cleaner + 2 backups
- **Guests**: Auto-respond to WiFi, check-in, amenities
- **Calendar**: Auto-sync every 15 minutes, resolve conflicts

## API Server (`mvp_main.py`)

### Core Endpoints
```bash
GET  /api/dashboard/{host_id}        # Everything in one call
POST /api/apply-pricing              # One-click revenue optimization
POST /api/guest-message              # Auto-handle guest messages
GET  /api/magic-stats                # Show automation statistics
```

### Demo Endpoints
```bash
POST /api/demo/trigger-opportunity   # Simulate money opportunity
POST /api/demo/simulate-guest-message # Show auto-response
GET  /api/demo/reset                 # Reset demo state
```

### Auto-Webhooks
```bash
POST /api/webhooks/airbnb-message    # Auto-process Airbnb messages
POST /api/webhooks/booking-update    # Trigger cleaner booking
```

## Demo Script (`demo_mvp.py`)

Complete demonstration of all MVP functionality:
- Revenue opportunity detection
- Cleaner booking automation  
- Guest message handling
- Calendar sync magic

```bash
python demo_mvp.py
```

## Installation & Running

```bash
# Install dependencies
pip install -r requirements.txt

# Run the magic server
python mvp_main.py

# Or run the demo
python demo_mvp.py
```

## Technical Features

### Zero Configuration
- **Smart defaults** for everything
- **Works out of the box** - no setup required
- **Intelligent automation** - learns and improves

### Error Handling
- **Graceful degradation** - never breaks the experience
- **Automatic retries** with exponential backoff
- **Human fallbacks** for edge cases

### Performance
- **Sub-second response times** for all endpoints
- **Async processing** for heavy operations
- **Efficient caching** of frequently accessed data

**Backend so smart, it runs your business while you sleep.** 🦅