# Travel Savings Consolidation Report

Updated: August 31, 2026

## Existing Posts Before Consolidation

1. `Complete Travel Savings Guide for Nurses`
   - Source file: `src/posts/2026-06-09-travel-savings-for-nurses.html`
   - URL: `/2026/06/09/travel-savings-for-nurses/`
2. `Ways Nurses Can Get Free Hotel Perks`
   - Source file: `src/posts/2026-06-10-ways-nurses-can-get-free-hotel-perks.html`
   - URL: `/2026/06/10/ways-nurses-can-get-free-hotel-perks/`
3. `Best Hotel Deals and Reward Programs`
   - Source file: `src/posts/2026-06-23-best-hotel-deals-and-reward-programs.html`
   - URL: `/2026/06/23/best-hotel-deals-and-reward-programs/`
4. `Best Travel Reward Programs and Cashback Apps`
   - Source file: `src/posts/2026-06-23-best-travel-reward-programs-and-cashback-apps.html`
   - URL: `/2026/06/23/best-travel-reward-programs-and-cashback-apps/`
5. `How to Compare Rental Car Deals`
   - Source file: `src/posts/2026-06-23-how-to-compare-rental-car-deals.html`
   - URL: `/2026/06/23/how-to-compare-rental-car-deals/`
6. `How to Compare Travel Deals Before Booking`
   - Source file: `src/posts/2026-06-23-how-to-compare-travel-deals-before-booking.html`
   - URL: `/2026/06/23/how-to-compare-travel-deals-before-booking/`

## Retained Guide URLs

1. `/2026/06/09/travel-savings-for-nurses/`
   - New title: `Complete Travel Savings Guide for Nurses`
   - Role: Main hub for flights, hotels, rental cars, travel rewards, nurse perks, travel deal comparison, booking checklist, and travel resources.
2. `/2026/06/10/ways-nurses-can-get-free-hotel-perks/`
   - New title: `Nurse's Guide to Hotel Deals, Rewards & Free Perks`
   - Role: Detailed hotel hub for comparing rates, hotel reward programs, healthcare-worker discounts, free perks, fees, cashback, and scripts for asking at check-in.
3. `/resources/`
   - Role: High-end Travel Savings landing page with a compact editorial layout and links into the two retained guides.

## Retired URLs and Redirects

These posts were removed from active collections and are no longer generated as standalone pages.

| Old URL | Redirect Target |
| --- | --- |
| `/2026/06/23/best-hotel-deals-and-reward-programs/` | `/2026/06/10/ways-nurses-can-get-free-hotel-perks/` |
| `/2026/06/23/best-travel-reward-programs-and-cashback-apps/` | `/2026/06/09/travel-savings-for-nurses/#travel-rewards` |
| `/2026/06/23/how-to-compare-rental-car-deals/` | `/2026/06/09/travel-savings-for-nurses/#rental-cars` |
| `/2026/06/23/how-to-compare-travel-deals-before-booking/` | `/2026/06/09/travel-savings-for-nurses/#compare-travel-deals` |
| `/category/travel-savings/` | `/resources/` |

Redirect rules are stored in `src/_redirects` and copied to `_site/_redirects` during build.

## External and Affiliate Links Retained

| Resource | Link Type | Benefit Mentioned | Automated Status |
| --- | --- | --- | --- |
| Rakuten | Referral/cashback | Cashback portal for travel and everyday spending | OK, HTTP 200 |
| TopCashback | Referral/cashback | Cashback portal for travel and shopping | OK, HTTP 200 |
| ID.me | Verification resource | Healthcare-worker verification for possible discounts | Questionable, final response blocked with HTTP 403 |
| Travelocity | CJ affiliate | Compare hotels, flights, packages, and rental cars | Questionable, affiliate redirect did not complete cleanly in automated check |
| CheapTickets | CJ affiliate | Compare travel deals | Reachable path, but automated check hit HTTP 429 rate limiting |
| Hilton Honors Rewards | Affiliate | Hotel points, member rates, digital check-in, possible upgrades | OK, HTTP 200 |
| IHG Rewards Club - Points.com | Affiliate | Points purchase or rewards-related travel savings | Questionable, final response blocked with HTTP 403 |
| Choice Privileges | Affiliate | Affordable stays and points | Questionable, final response blocked with HTTP 403 |
| Fetch | Referral | Receipt rewards that can offset travel or everyday costs | Questionable, automated check failed or timed out |
| Southwest Rapid Rewards - Points.com | Affiliate | Points purchase, transfer, or rewards management | OK, HTTP 200 |
| Alaska Airlines ATMOS Rewards | Affiliate | Airline rewards and points | Questionable, final response blocked with HTTP 403 |
| Copa Airlines ConnectMiles | Affiliate | Airline rewards and points | Questionable, automated check failed |
| ROVE | Referral | Travel rewards account with referral code preserved | OK, HTTP 200 |
| FoundersCard | Affiliate/referral | Paid membership perks that may include travel benefits | OK, HTTP 200 |
| Upside | Referral/cashback | Gas or local cashback that can help offset trip costs | OK, HTTP 200 |
| Ibotta | Referral | Cashback/rebates with friend code preserved | OK, HTTP 200 |
| Carla Car Rental | CJ affiliate | Rental car comparison | OK, HTTP 200 |

## Questionable Links for Manual Review

The following links should be reviewed inside the original affiliate/referral dashboards or browser session before any paid traffic is sent to them:

- ID.me: automated check reached a blocked HTTP 403 page.
- Travelocity: CJ affiliate redirect path did not complete cleanly in automated curl testing.
- CheapTickets: automated check reached rate limiting. This may be temporary, but it should be verified.
- IHG Rewards Club - Points.com: automated check ended at HTTP 403.
- Choice Privileges: automated check ended at HTTP 403.
- Fetch: automated check failed or timed out.
- Alaska Airlines ATMOS Rewards: automated check ended at HTTP 403.
- Copa Airlines ConnectMiles: automated check failed.

## Reward and Offer Verification Notes

- Existing affiliate and referral URLs were preserved where possible.
- ROVE referral code `6XQOEYDI` was preserved.
- Ibotta friend code `xdjgdvx` was preserved.
- No fixed cashback rate, bonus amount, point value, free-night value, or membership perk is promised unless it was already safe to describe generally.
- Rewards, discounts, cashback, elite perks, breakfast, late checkout, upgrades, and healthcare-worker discounts are described as possible or variable because programs can change by date, location, account status, and availability.

## Internal Link and Build Testing

- `pnpm build` passed on August 31, 2026.
- Build output synchronized 67 affiliate links and 31 active posts.
- Retired Travel Savings URLs are not present in generated active HTML, `content-plan.md`, `sitemap.xml`, or `feed.xml`.
- `_site/_redirects` contains the redirect map above.
- All generated internal links and anchors resolve across 47 HTML files.
- All redirect destinations resolve, including fragment anchors.
- Travel guide jump menus were checked for the main guide, hotel guide, and Travel Savings landing page.

## Responsive Review Notes

- Travel Savings CSS includes desktop, tablet, and mobile responsive layouts for the landing page, guide cards, compact jump menus, resource rows, and booking check grids.
- Automated Playwright screenshot testing was not run because `npx` is not available in this local environment.
- Manual browser QA should be done after Cloudflare deployment for desktop, tablet, and mobile viewports.
