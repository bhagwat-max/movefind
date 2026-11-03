# MoveFind 🎬

A clean, fast website that answers **“Where can I watch this movie?”** in a selected country.

Built with **Next.js 16 + React 19**, designed to deploy on **Vercel** without a database.

## What it does

- Search real movie titles using TMDB.
- Show movie posters, titles, years, runtime, genres, and descriptions.
- Check country-specific availability: subscription streaming, free, ad-supported, rental, and purchase.
- Switch between 30+ countries (India by default), including directly from a movie page.
- Link to TMDB's movie watch page for current watch links.
- Mobile-friendly layout, native HTML search, minimal client JavaScript.
- Protect your TMDB API token by using it only on the server.
- Cache movie search for 10 minutes, movie details for 6 hours, watch listings for 15 minutes.

**Important:** Streaming data comes from **JustWatch via TMDB**, and is not guaranteed real-time. TMDB does **not** supply direct links to individual streaming platforms in this API. Never assume a movie is available on a platform not listed in the response. See [TMDB's watch providers docs](https://developer.themoviedb.org/reference/movie-watch-providers).

## 1. Get a TMDB API token

1. Create a TMDB account at https://www.themoviedb.org/ .
2. Open your account **Settings → API** and request API credentials.
3. Copy your **API Read Access Token** (the long Bearer token), not a movie ID.

For non-commercial use TMDB provides a developer API with attribution. For a revenue-generating site, review TMDB's commercial licensing terms: https://developer.themoviedb.org/docs/faq .

## 2. Run locally (VS Code)

You need **Node.js 20.9+** (Node.js 22 or 24 recommended).

1. Unzip `movefind.zip` and open the **movefind** folder in VS Code.
2. Open the VS Code terminal and run:

   ```bash
   npm install
   ```

3. Duplicate `.env.example` as `.env.local` and replace the placeholder token:

   ```env
   TMDB_API_READ_ACCESS_TOKEN=your_actual_tmdb_read_access_token
   ```

   You may instead use `TMDB_API_KEY=your_v3_api_key` if you prefer. Do not put either key in a `NEXT_PUBLIC_` variable.

4. Start the site:

   ```bash
   npm run dev
   ```

5. Visit **http://localhost:3000**.

## 3. Deploy to Vercel

1. Create an empty GitHub repository and push the project from the **movefind** directory. Example commands (replace the URL):

   ```bash
   git init
   git add .
   git commit -m "Initial MoveFind launch"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/movefind.git
   git push -u origin main
   ```

   Keep `.env.local` private; `.gitignore` already excludes it.
2. Go to https://vercel.com/new and import the repository.
3. The framework should auto-detect as **Next.js**. Keep the root directory at the project root (where `package.json` is).
4. In **Environment Variables**, add:

   - **Name:** `TMDB_API_READ_ACCESS_TOKEN`
   - **Value:** your actual TMDB API Read Access Token
   - **Environments:** Production, Preview, and Development (as appropriate)

5. Click **Deploy**.
6. Search a movie on your new Vercel URL to confirm the integration works.

If you deploy the project before configuring TMDB, the homepage still loads, but movie searches will show a setup reminder until you add the token and redeploy.

### Important deployment reminders

- Do **not** publish `.env.local` or API credentials in Git.
- No database, background jobs, or paid hosting services are required by the code.
- TMDB/JustWatch data and availability vary by country. Listings can lag or be incomplete; always confirm with providers.
- Once you have your final custom domain, you can add `metadataBase` in `app/layout.jsx` for advanced social sharing metadata.
- Add your own terms/privacy pages before broad public promotion, if appropriate.

## Commands

```bash
npm run dev      # Local development
npm run build    # Production build
npm run start    # Start production server after build
npm test         # Input and availability mapping tests
```

## Structure

```
movefind/
  app/
    layout.jsx          # Shared header/footer + metadata
    page.jsx            # Home + movie search results
    globals.css         # Entire responsive design
    movie/[id]/page.jsx # Selected movie + streaming providers
  components/            # Small reusable UI parts
  lib/tmdb.js            # Server-only TMDB API client
  lib/utils.js           # Validation and provider transformation
  lib/constants.js       # Countries and watch categories
  tests/                 # No external testing packages needed
  .env.example           # Key setup template
  package.json
```

## API attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is powered by JustWatch via TMDB. The site includes these notices and the TMDB logo as required by TMDB's guidelines. Do not remove attribution.
