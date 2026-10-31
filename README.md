# Wealth & Scrubs Static Site

This is the static version of Wealth & Scrubs. It uses Eleventy to turn simple content files into a fast website.

## Site Contents

- 35 published posts
- 9 published pages
- 36 site upload media files, plus product and Pinterest creative assets
- Existing post URLs, categories, links, and affiliate disclosures
- Responsive image optimization, RSS, sitemap, and mobile navigation

## Current Project References

- `MASTER_WEBSITE_REDESIGN_INSTRUCTIONS.md` is the governing redesign standard.
- `WEALTH_AND_SCRUBS_DESIGN_GUIDE.md` defines the overall visual system.
- `CATEGORY_COLOR_SYSTEM.md` defines category-based palettes and inheritance rules for future redesign work.
- `PROJECT_FILE_MANIFEST.md` identifies active project assets and cleanup rules.

## Create a Post

Run:

```bash
pnpm new-post
```

Answer the three prompts. The command creates a Markdown file in `src/posts/` with the title, date, category, URL, and starter headings already filled in.

Open that file and write normally:

```markdown
## A Helpful Heading

Write the post here.

- Add bullet points
- Add another useful tip

[Add a link](https://example.com)
```

Put new images in `src/assets/uploads/` and add them to a post with:

```markdown
![Helpful description for the image](/assets/uploads/image-name.png)
```

Eleventy automatically creates smaller WebP versions when the site builds.

## Preview Locally

Install Node.js 22 or newer and pnpm, then run:

```bash
pnpm install
pnpm dev
```

Open the local address printed in the terminal. Changes refresh while the server is running.

## Build the Site

```bash
pnpm build
```

The deployable site is generated in `_site/`.

## Google Analytics

The shared `src/_includes/layouts/base.njk` head initializes GA4 measurement ID
`G-BBMW70ZFHE` once per document on `wealthandscrubs.com` and
`www.wealthandscrubs.com`. All public HTML pages inherit this layout. Navigation
loads full documents, so GA4's automatic `page_view` handles both landing visits
and page-to-page navigation; do not add manual page-view or link-click handlers.
Local and preview hosts do not send production traffic.

Tracking skips visitors with Global Privacy Control, Do Not Track, or
`window['ga-disable-G-BBMW70ZFHE'] === true`. Google signals and advertising
personalization are disabled. The site currently has no consent manager; this
initializer preserves any queued consent settings and does not grant consent.
If a consent manager is introduced, set its defaults before this script and
connect its consent updates to `gtag`.

Validate after building:

```bash
node --test scripts/test-analytics.mjs
```

After deployment, use Google Tag Assistant and GA4 Realtime to verify a visit
and navigation to another page. Use a browser without tracking blockers and with
privacy opt-out signals disabled for this test. Check that each page load sends
one `page_view` to `G-BBMW70ZFHE`; anchor jumps must not send extra page views.
Standard reports can take 24–48 hours to populate.

## Deploy on Cloudflare Workers

Connect this repository to a Cloudflare Workers project and use:

- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`

The `wrangler.jsonc` file deploys the generated `_site` directory as static assets. After connecting a custom domain, update `url` in `src/_data/site.json` and the sitemap address in `src/robots.txt`.

## Important Launch Notes

- The contact form needs a form service or email delivery function before launch.
- Noteworthy is a system font and is not installed on every device. Visitors without it receive the handwriting-style fallbacks defined in `src/assets/css/site.css`.
