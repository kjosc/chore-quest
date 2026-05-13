# Chore Tracker

A family chore tracking app for you, Matt, and the kids. Deployed on Vercel, free forever.

## What you're deploying

- Next.js app with the Chore Chart UI you already saw
- 4-digit PIN gate (you set the PIN)
- Vercel KV (key-value database) for shared storage across both your phones
- Auto-syncs across devices, debounces writes so it's snappy

## Deploy (about 30 min, one-time)

### 1. Edit the two things you'll want to customize

Open `components/ChoreTracker.js` and find this line near the top (around line 47):

```js
const KIDS = ['Kid 1', 'Kid 2', 'Kid 3'];
```

Replace with your kids' real names:

```js
const KIDS = ['Eva', 'Liam', 'Avery'];  // example
```

### 2. Push to GitHub

```bash
cd chore-tracker
git init
git add .
git commit -m "Initial chore tracker"
gh repo create chore-tracker --private --source=. --push
```

(Or use the GitHub web UI to make a new private repo, then `git remote add origin` + `git push`.)

### 3. Create Vercel project

1. Go to https://vercel.com → log in with GitHub
2. Click **Add New → Project**
3. Pick your `chore-tracker` repo → **Import**
4. Click **Deploy** (don't add env vars yet — that comes next)

It'll deploy but the app won't work yet because there's no PIN set and no database. That's fine.

### 4. Add the database

1. In your Vercel project dashboard, click **Storage** tab
2. Click **Create Database** → pick **KV** (the Redis-compatible one)
3. Name it whatever (e.g. `chore-data`) → Create
4. When prompted, connect it to your `chore-tracker` project → click **Connect**

This automatically adds `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` to your project's environment variables.

### 5. Set the family PIN

1. Vercel project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key:** `FAMILY_PIN`
   - **Value:** your 4-digit PIN (e.g. `4827` — pick something only you and Matt know)
   - **Environments:** check all three (Production, Preview, Development)
3. Save

### 6. Redeploy

1. Vercel project → **Deployments** tab
2. Click the `...` menu on the latest deployment → **Redeploy**
3. Wait ~1 minute

### 7. You're live

Visit your URL (e.g. `https://chore-tracker-yourname.vercel.app`).
Enter the PIN. Bookmark it on your phone. Tell Matt the URL and PIN.

**Pro tip:** On iPhone, open the URL in Safari → tap the Share button → **Add to Home Screen**. It'll look and feel like a real app.

## Local testing (optional)

```bash
cp .env.local.example .env.local
# edit .env.local — set FAMILY_PIN to anything for local
npm install
npm run dev
```

Note: locally, KV won't work without setting up a Vercel CLI link. For day-to-day, just edit on Vercel directly via GitHub pushes.

## Making changes later

Edit code → `git push` → Vercel auto-deploys. Takes ~1 minute.

To change the PIN: Vercel project → Settings → Environment Variables → edit `FAMILY_PIN` → redeploy.

## Costs

$0/month. Vercel's free tier covers this easily — you'll use a tiny fraction of the limits.
