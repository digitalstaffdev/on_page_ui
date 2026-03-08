# On-Page Optimization Agent — UI

Next.js 14 frontend for the On-Page SEO Optimization Agent. Provides a dashboard for managing SEO analysis projects, running tools, viewing reports, and managing user settings.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Auth.js v5 (NextAuth.js beta) with credentials + Google OAuth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- The API service running (see `/api` folder)

### Install

```bash
cd UI
npm install
```

### Configure Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the API service (e.g. `http://localhost:3001` or your Vercel deployment) |
| `NEXTAUTH_URL` | URL of this UI app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | A random secret for encrypting session tokens. Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional, for Google sign-in) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional, for Google sign-in) |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a Git repository
2. Import the repository in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `UI`
4. Add all environment variables from `.env.example` in the Vercel project settings
5. Deploy

Vercel will automatically detect Next.js and configure the build.

### Required Vercel Environment Variables

- `NEXT_PUBLIC_API_URL` — Your deployed API URL
- `NEXTAUTH_URL` — Your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` — Generate a secure random string
- `GOOGLE_CLIENT_ID` — (Optional) For Google OAuth
- `GOOGLE_CLIENT_SECRET` — (Optional) For Google OAuth

## Project Structure

```
UI/
├── app/                    # Next.js App Router pages
│   ├── api/auth/           # Auth.js API route
│   ├── admin/              # Admin panel
│   ├── dashboard/          # Project dashboard
│   ├── login/              # Login / registration
│   ├── new/                # New project creation
│   ├── pricing/            # Pricing plans
│   ├── profile/            # Profile & API keys
│   ├── project/[id]/       # Project detail & sub-pages
│   ├── settings/           # App settings
│   └── tools/              # Global tools listing
├── components/ui/          # shadcn/ui components
├── lib/                    # Utilities, API client, hooks, auth config
└── public/                 # Static assets
```

## Authentication

This UI uses Auth.js v5 with two providers:

- **Credentials**: Email/password validated against the API service
- **Google OAuth**: Direct Google sign-in (requires Google Cloud Console setup)

Sessions are managed via JWT tokens stored in HTTP-only cookies. No localStorage is used for auth.

## API Integration

All API calls go through `lib/api.ts` which provides typed functions for every endpoint. The API client uses `fetch` with `credentials: "include"` for cookie-based session handling.

Progress polling for long-running analysis pipelines uses `useProjectProgress` hook with configurable intervals (default 3s).
