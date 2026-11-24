# JAMR

Arabic, right-to-left JAMR storefront built with React, TypeScript, Vite, and Tailwind CSS. Product catalog, cart, delivery scheduling, and WhatsApp order preparation run in the browser; no backend or Supabase connection is configured.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

The static site is generated in `dist/`.

## Caching

Cloudflare Pages reads `public/_headers`, which Vite copies into `dist/`. HTML and other stable URLs are not stored by the browser; Vite's content-hashed files under `/assets/` are cached for one year and invalidated automatically when their content changes. The asset rule explicitly replaces the broader no-store policy.

Product photos and fonts are loaded from third-party providers, so their caching is controlled by those providers. The app has no service worker, API cache, or persisted cart.

## Cloudflare Pages

The repository includes `wrangler.jsonc` with `dist/` as the Pages build output. In Cloudflare Pages, use:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 22 or newer

After authenticating Wrangler with a Cloudflare account, `npm run deploy` builds the site and deploys it to Cloudflare Pages. This command has not been run as part of the migration.

WhatsApp remains the order handoff. The current WhatsApp phone number is inherited from the original page and should be confirmed before accepting real orders.
