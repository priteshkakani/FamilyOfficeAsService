# Family Office Frontend

## Supabase Environment Variables

- **Local Development:**
  - Create a `.env` file in the `frontend` directory with:
    - `VITE_SUPABASE_URL=your-supabase-url`
    - `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`
- **Production Deployment:**
  - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your deployment platform (Netlify, Vercel, etc).

## Build Output

- The Vite build output is in the `build` directory. Deploy this folder, not `public`.

## SPA Routing

- Uses `HashRouter` for client-side routing. No server-side configuration needed.
- If you switch to `BrowserRouter`, configure your server to redirect all routes to `index.html` (see `public/_redirects`).

## Homepage

- The `homepage` field in `package.json` should match your deployed URL.

---

For more, see the main project README.
