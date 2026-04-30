# fun-in-space-site

The new static home for `fun-in-space.com`.

Built with Astro and intended to replace the legacy WordPress.com site with a faster, simpler personal site that highlights:
- current projects
- companies and ventures
- career highlights
- archived writing from Fun in Space
- selected posts from X

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment target

Deploy on **Cloudflare Pages**.

Recommended initial settings:
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22` or newer

## Redirects

Legacy WordPress post URLs are mapped in `public/_redirects` so old links can forward to the new writing archive.

## Notes

- Writing content lives under `src/content/writing/`
- Featured homepage data is currently content-driven via Astro collections
- Newer essays should link out to Substack unless we later choose to ingest them locally
