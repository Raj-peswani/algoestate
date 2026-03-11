# Deploy AlgoEstate (`algo-ui`) to Vercel

## 1) Push project to GitHub

1. Commit your latest changes.
2. Push the repository (or the `algo-ui` project folder) to GitHub.

## 2) Import project in Vercel

1. Open [Vercel](https://vercel.com) and click **Add New... > Project**.
2. Import your GitHub repository.
3. If your repo contains multiple folders, set the **Root Directory** to `algo-ui`.

## 3) Configure build settings

Use these settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## 4) Set environment variables

In Vercel Project Settings > Environment Variables, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use your Supabase project values.  
Do **not** add service role keys to frontend env vars.

## 5) Deploy

1. Click **Deploy**.
2. Wait for build to complete.
3. Open the deployment URL and verify:
   - app loads
   - Supabase-backed data fetch works

## 6) Future updates

Every push to the connected branch triggers a new Vercel deployment automatically.
