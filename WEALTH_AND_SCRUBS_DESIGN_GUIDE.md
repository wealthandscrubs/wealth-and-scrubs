# Wealth & Scrubs Design Guide

Codex instruction: before making any design, layout, navigation, visual, or CSS changes for Wealth & Scrubs, read this file and keep the changes aligned with it. If a request conflicts with this guide, explain the tradeoff before changing the design direction.

## Brand Positioning

Wealth & Scrubs is a practical lifestyle and savings brand for nurses, healthcare workers, and everyday readers who want to save more, earn more, travel for less, and make daily life easier.

The site should feel:

- Trustworthy, practical, and helpful.
- Warm, feminine, polished, and encouraging.
- Savings-focused without feeling cheap or cluttered.
- Nurse-aware without making every page feel clinical.
- Editorial and resource-driven, not pushy or overly salesy.

Core promise:

> Helping readers build wealth, save money, find useful deals, and live better beyond the bedside.

## Audience

Primary readers:

- Nurses and healthcare workers with busy schedules.
- Readers looking for discounts, side hustles, cashback apps, travel savings, freebies, and practical lifestyle guidance.
- People who want direct advice, clear links, and trustworthy recommendations.

Design choices should support scanning, quick decision-making, and confidence. Avoid layouts that make readers work hard to find the next useful action.

## Visual Personality

The current brand language is dark, warm, rose-toned, and a little handwritten. Keep that mood recognizable.

Use:

- Dark editorial backgrounds.
- Soft rose, blush, coral, and muted gold accents.
- Warm, high-contrast typography.
- Practical content blocks, grids, callouts, and article cards.
- Subtle sparkle or dotted background texture when it supports the brand.
- Real product, lifestyle, nursing, money, travel, planner, or home images when imagery is needed.

Avoid:

- Generic SaaS styling.
- Cold medical blues as the dominant palette.
- Heavy beige-only or plain white blog layouts.
- Loud neon colors.
- Overly corporate finance visuals.
- Cluttered coupon-site layouts with too many competing badges.
- Decorative graphics that do not help the reader understand the content.

## Color System

Use the existing CSS variables in `src/assets/css/site.css` as the source of truth.

Primary darks:

- `--paper: #090809` for the page background.
- `--surface: #141113` for cards and panels.
- `--soft: #1a1517` for softer content blocks.
- `--sage-dark: #070607` for deep contrast areas.

Text:

- `--ink: #fffaf7` for primary text on dark backgrounds.
- `--muted: #d7c9c4` for secondary text.
- `--white: #fff` for high-emphasis text.

Brand accents:

- `--rose-light: #f2c5bc` for headings and key brand moments.
- `--coral: #e4aaa0` for accent copy and supporting labels.
- `--gold: #c9877d` for borders, buttons, and warm emphasis.
- `--deep-rose: #d7928a` for subheadings and secondary emphasis.
- `--link-pink: #ffd8d2` for links.
- `--line: #5a4147` for borders.

Button gradient:

- Use the existing warm rose gradient: `linear-gradient(115deg, #f0bdb4, #bd746a 52%, #e3a39a)`.

Color rules:

- Keep contrast strong enough for readability.
- Use rose and gold accents to guide action, not as decoration everywhere.
- Do not introduce a new dominant palette unless the brand is intentionally being refreshed.
- If a new section needs variety, shift texture, layout, or imagery before adding unrelated colors.

## Typography

Current typefaces:

- Display and brand voice: `--font-hand`, using Noteworthy with handwriting-style fallbacks.
- Readable/system fallback: `--font-readable`, using Inter and system sans-serif.

Typography rules:

- Preserve the handwritten brand feel for major headings, brand text, and expressive labels.
- Keep body text generous, readable, and easy to scan.
- Use smaller, tighter headings inside compact cards, sidebars, tool panels, and article grids.
- Do not use negative letter spacing.
- Do not scale font size directly with viewport width outside established `clamp()` patterns.
- Long titles must wrap cleanly on mobile.

## Layout Principles

Design for quick scanning and useful paths.

Use:

- Full-width hero bands for major pages.
- Constrained inner content widths: approximately `1120px` for page shells and `780px` for article prose.
- Responsive grids for cards and topic links.
- Clear section headings and useful groupings.
- Content-first layouts with obvious next actions.
- Mobile layouts that collapse gracefully to one column.

Avoid:

- Landing-page fluff before the actual content.
- Overly large empty hero areas that hide the useful content.
- Nested cards inside cards.
- Layouts where text, buttons, or images overlap.
- Components that resize or shift when hovered.
- Hidden navigation or unclear next steps.

## Components

### Header and Navigation

- Keep the header sticky, simple, and high contrast.
- Preserve the Wealth & Scrubs brand mark and rose-toned brand text.
- Navigation should remain easy to scan on mobile and desktop.
- Keep category and resource paths obvious.

### Heroes

- Heroes should establish the page topic quickly.
- Home and important landing pages may use the brand banner or strong relevant imagery.
- Page heroes should not bury content too far below the fold.
- Avoid generic abstract hero art when a real brand, product, planner, nurse-life, travel, home, or money image would be more useful.

### Cards

- Use cards for repeated items such as posts, affiliate offers, resources, and product recommendations.
- Keep card content clear: category, title, short summary, image when useful, and a clear click target.
- Existing cards use dark surfaces, rose borders, and soft shadows. Match that style.
- Card radius may follow the existing `--radius` unless a tighter utility card already uses `8px`.

### Buttons and Links

- Primary buttons should use the established warm rose gradient.
- Secondary actions can use outline or text-link styling.
- Button copy should be direct and benefit-oriented.
- Affiliate buttons must feel editorially natural, not aggressive.
- Links should remain visibly distinct and accessible.

### Callouts and Disclosure Blocks

- Use callouts for helpful summaries, affiliate notes, travel savings tips, comparison notes, and important reader guidance.
- Use `--soft` or `--surface` backgrounds with `--line` borders.
- Affiliate disclosures should stay visible and trustworthy.

### Tables

- Tables are useful for comparisons, discounts, apps, costs, and pros/cons.
- Keep tables readable on mobile with horizontal overflow when needed.
- Use concise headings and avoid cramming too much text into narrow columns.

## Imagery

Use imagery that makes the topic more concrete:

- Nurses, scrubs, shift work, meal prep, wellness, planners, budgeting, travel, home organization, products, and app screenshots.
- Existing Wealth & Scrubs logo/banner assets in `src/assets/uploads/`.
- Clear, bright, trustworthy images that support the page topic.

Avoid:

- Dark, blurry, cropped, or purely atmospheric stock images.
- Random decorative imagery unrelated to the article.
- Images that make affiliate content look spammy.

Every meaningful image needs descriptive alt text.

## Content and UX Rules

The design should reinforce the editorial rules in `PROJECT_INSTRUCTIONS.md`.

Prioritize:

- Reader value over link volume.
- Clear category paths.
- Internal links to related articles.
- SEO-friendly headings.
- Helpful FAQ and comparison sections for long-form posts.
- Affiliate links only where relevant and verified.

Common page goals:

- Home: quickly explain the brand, show major categories, and lead readers to useful articles/resources.
- Category pages: help readers pick a topic and discover related articles.
- Blog archive: make recent and relevant posts easy to scan.
- Posts: keep reading comfortable, add helpful links, and place affiliate offers only where they support the article.
- Resources: organize trusted tools, deals, and guides without overwhelming the reader.

## Accessibility and Responsiveness

Required checks for design/layout changes:

- Text remains readable on dark backgrounds.
- Interactive elements have clear hover/focus states.
- Buttons and tap targets are large enough on mobile.
- Layout works at mobile, tablet, and desktop widths.
- No text overlaps, spills out of buttons, or becomes unreadably small.
- Images have useful alt text.
- Tables and grids do not break the mobile viewport.
- Motion respects `prefers-reduced-motion`.

## Implementation Notes for Codex

Before design or layout edits:

1. Read this guide.
2. Check the existing patterns in `src/assets/css/site.css`.
3. Reuse current CSS variables and component classes where practical.
4. Preserve existing content, affiliate disclosures, internal links, SEO metadata, images, and brand assets unless the request explicitly asks to change them.
5. Keep edits scoped to the requested page, component, or CSS area.
6. Verify the page at mobile and desktop sizes when layout changes are significant.

Preferred prompt for future work:

> Redesign the Home page following the Wealth & Scrubs Design Guide.

Codex should interpret that as: read `WEALTH_AND_SCRUBS_DESIGN_GUIDE.md`, inspect current site patterns, then make a design that feels native to Wealth & Scrubs.
