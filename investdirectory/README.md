# InvestDirectory - Next.js Landing Page

A professional landing page for InvestDirectory, the contract intelligence platform built for asset managers.

## Features

- **Modern Next.js 15 App** - Built with the latest App Router and TypeScript
- **Contact Form** - Replaced "Get Early Access" with "Contact Us" form
- **Form Logging** - All submissions are clearly logged to the console with formatting
- **Responsive Design** - Professional design that looks great on all devices
- **Persona Selector** - Interactive role selection on landing
- **Smooth Animations** - Professional transitions and interactions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contact Form

The contact form collects:
- **Name** - User's full name
- **Email** - User's email address
- **Company** - User's company name

All form submissions are logged to the console in a clear, formatted style:

```
================================================================================
📧 NEW CONTACT FORM SUBMISSION
================================================================================
📅 Timestamp: 2026-01-29T...
👤 Name:      John Doe
📧 Email:     john@company.com
🏢 Company:   Acme Capital
================================================================================
```

## Project Structure

```
investdirectory/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # API endpoint for form submission
│   ├── components/
│   │   ├── ContactModal.tsx      # Contact form modal component
│   │   └── ContactModal.css      # Modal styles
│   ├── page.tsx                  # Main landing page
│   ├── styles.css                # Page-specific styles
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
└── public/
    └── app-screenshot.png        # Product screenshot
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **CSS** - Custom styling (no external CSS framework)
- **React** - UI components

## Development

The app uses:
- Server-side API routes for form handling
- Client-side components for interactivity
- Modern CSS with animations and transitions
- TypeScript for type safety

## Production

To build for production:

```bash
npm run build
npm start
```

## License

All rights reserved © 2026 InvestDirectory
