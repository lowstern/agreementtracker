# Agreement Tracker - Frontend

React + TypeScript frontend built with Vite.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment (optional)

```bash
cp .env.example .env
# Edit .env to set VITE_API_URL if not using the proxy
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components (one per tab)
│   ├── services/    # API client
│   ├── types/       # TypeScript type definitions
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Entry point
│   └── index.css    # Global styles & design system
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Demo Credentials

- Email: `demo@agreement-tracker.com`
- Password: `Demo123!`

## Features (Phase 1)

- Login page with demo authentication
- Three-tab navigation:
  - Investor Directory (empty)
  - Agreements & Documents (empty)
  - Fee Logic View (empty)
- Basic design system with consistent styling
