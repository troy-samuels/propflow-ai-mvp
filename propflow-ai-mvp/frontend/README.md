# PropFlow AI Frontend
## "8-Year-Old Simple" React Dashboard

🎯 **Design Principle**: Kindergarten-simple interface for complex automation.

## Structure

```
frontend/
├── src/                          # React components
│   ├── components/
│   │   ├── Dashboard/           # Dashboard components
│   │   └── hooks/               # Custom React hooks
│   └── services/                # API services
├── MVP_PropFlowDashboard.tsx    # Main dashboard component (MVP)
├── MVP_PropFlow.css            # Simple styling system
└── package.json                # Dependencies
```

## Key Components

### Main Dashboard (`MVP_PropFlowDashboard.tsx`)
- **Single-screen interface** - Everything visible at once
- **Big green buttons** - "YES, DO IT!" for money opportunities
- **Visual status cards** - Property health at a glance
- **Zero configuration** - Works perfectly out of the box

### Styling (`MVP_PropFlow.css`)
- **4 colors only**: Green (good), Red (bad), Gold (money), Gray (neutral)
- **2 text sizes**: Big (24px) and Normal (16px) - nothing smaller
- **2 button types**: Big action and Help buttons
- **Mobile-first**: Perfect on any device

## Design System

### Colors
```css
--good: #22C55E     /* Green = Everything working */
--bad: #EF4444      /* Red = Needs attention */
--money: #F59E0B    /* Gold = Money opportunity */
--neutral: #6B7280  /* Gray = Normal info */
```

### Components
- **Property Cards**: Show all 4 core statuses (revenue, cleaning, guests, calendar)
- **Opportunity Alerts**: Big cards for revenue opportunities
- **Action Buttons**: Only show when human decision needed
- **Status Indicators**: Emojis + color coding for instant understanding

## User Experience Goals

- ⏱️ **Load time**: Under 1 second
- 🖱️ **Clicks per day**: Under 5 total
- 📱 **Mobile**: Perfect on any screen
- 👶 **Usability**: 8-year-old approved

## Run Locally

```bash
npm install
npm start
```

Connects to backend at `http://localhost:8000`

**Interface so simple, your grandma could manage Airbnb properties.** 🦅