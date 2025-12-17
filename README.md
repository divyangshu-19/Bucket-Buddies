# Bucket Buddies - MVP

A social web app where users create bucket lists and get matched with others who share similar bucket list items. Plan experiences together and make memories!

## 🎯 Features

- **Authentication**: Sign up/login with email/password or Google OAuth (via Supabase Auth)
- **Bucket List Management**: Create, edit, and delete bucket list items with categories and timeframes
- **Smart Matching**: Get matched with users who share similar bucket list items
- **Realtime Chat**: One-to-one chat with matched users using Supabase Realtime
- **Profile Management**: Update your name and city

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email + Google OAuth)
- **Realtime**: Supabase Realtime
- **Deployment**: Vercel-compatible

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works great!)

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details (name, database password, region)
4. Wait for the database to be provisioned (~2 minutes)

### Step 2: Run Database Migration (IMPORTANT!)

**What is a migration?** A migration is SQL code that creates your database structure (tables, indexes, security rules). You only need to run it **once** when setting up.

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy **ALL** the contents and paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates:
- `profiles` table (user profiles)
- `bucket_items` table (bucket list items)
- `matches` table (user matches)
- `messages` table (chat messages)
- All indexes for performance
- Row Level Security (RLS) policies for data protection
- Automatic triggers for profile creation

### Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

### Step 5: Enable Google OAuth (Optional)

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials:
   - Get Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and start using the app! 🎉

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Auth pages (signin/signup)
│   ├── bucket-list/        # Bucket list page
│   ├── matches/             # Match discovery page
│   ├── chat/                # Chat pages
│   └── profile/             # Profile page
├── components/              # React components
│   └── ui/                  # UI components
├── lib/                     # Utilities
│   ├── supabase-client.ts  # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client
│   └── matching.ts          # Matching algorithm
└── supabase/
    └── migrations/          # Database migration SQL
```

## 🗄️ Database Schema

The migration creates these tables:

- **profiles**: User profile information (linked to Supabase Auth)
- **bucket_items**: Bucket list items with title, category, location, timeframe
- **matches**: Matches between users with shared items
- **messages**: Chat messages between matched users

All tables have **Row Level Security (RLS)** enabled - users can only access their own data or data they're allowed to see.

## 🎨 Matching Logic

The matching algorithm finds users who share bucket list items based on:

1. **Exact Title Match**: Same bucket item title
2. **Category + Similar Keywords**: Same category with similar keywords (30%+ overlap)

The matching is designed to be extensible - you can later upgrade to AI/embeddings-based matching.

## 💬 Chat System

- Real-time messaging using Supabase Realtime subscriptions
- Messages stored in PostgreSQL
- One-to-one chat between matched users
- WhatsApp-like UI

## 🔐 Authentication

- Email/password authentication (handled by Supabase Auth)
- Google OAuth integration (via Supabase)
- Session management with Supabase Auth

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

**Important**: Make sure you've run the migration SQL in your Supabase project before deploying!

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check your `.env.local` file exists
- Verify all three variables are set correctly

### "RLS policy violation" or "permission denied"
- Make sure you ran the migration SQL (Step 2)
- Check that Row Level Security policies were created

### "Realtime not working"
- Supabase Realtime is enabled by default
- Check browser console for errors
- Verify you're subscribed to the correct channel

### "Cannot find module" errors
- Run `npm install` first
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## 📄 License

MIT

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Supabase
