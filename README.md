# YangiliklarUz

Modern Uzbek news website built with Next.js App Router, server-side rendering, ISR, and plain CSS modules.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Add your NewsAPI key and site URL in `.env.local`:

```bash
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the app locally:

```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser.

## Production deployment

Deploy to Vercel and add these environment variables:

- `NEWS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

Set `NEXT_PUBLIC_SITE_URL` to your production domain, such as `https://yangiliklaruz.vercel.app`.

## Notes

- NewsAPI works from localhost in browser-based testing, but the key is kept server-side and never exposed to the client bundle.
- The app uses `fetch(..., { next: { revalidate: 600 } })` for caching and quota protection.
- Server-rendered article and category pages are indexable and support metadata, JSON-LD, Open Graph, and sitemap generation.

## SEO checklist

- Add the live domain to Google Search Console and Bing Webmaster Tools
- Submit the generated sitemap at `/sitemap.xml`
- Validate metadata and rich snippets with Google Rich Results Test and Lighthouse
- Confirm canonical URLs and hreflang alternatives are correct before launch
