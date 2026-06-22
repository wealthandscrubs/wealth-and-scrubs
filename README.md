# Wealth & Scrubs Static Site

This is the WordPress-free version of Wealth & Scrubs. It uses Eleventy to turn simple content files into a fast static website.

## What Was Migrated

- 16 published posts
- 9 published pages
- 30 original media files
- Existing post URLs, categories, links, and affiliate disclosures
- Responsive image optimization, RSS, sitemap, and mobile navigation

The WordPress export is not copied into the public site. Drafts, trashed content, editor templates, account details, and author email metadata are excluded.

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

## Deploy on Cloudflare Workers

Connect this repository to a Cloudflare Workers project and use:

- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`

The `wrangler.jsonc` file deploys the generated `_site` directory as static assets. After connecting a custom domain, update `url` in `src/_data/site.json` and the sitemap address in `src/robots.txt`.

## Re-import WordPress

The migration script is repeatable:

```bash
ruby scripts/import_wordpress.rb /path/to/wordpress-export.xml
```

It replaces generated files in `src/posts/` and `src/pages/`, so only run it when intentionally refreshing the migration from a newer WordPress export.

## Important Launch Notes

- Keep the WordPress site public until the replacement has been deployed and checked.
- The WordPress contact form cannot run on a static site. A form service or email delivery function should be connected before launch.
- Noteworthy is a system font and is not installed on every device. Visitors without it receive the handwriting-style fallbacks defined in `src/assets/css/site.css`.
