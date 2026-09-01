# Wealth & Scrubs Project File Manifest

Use this file when cleaning up the Wealth & Scrubs project so current work stays preserved and old run artifacts do not pile up.

## Keep as Active Project Files

- `src/`: live Eleventy source files, posts, pages, layouts, data, CSS, JavaScript, and uploaded site media.
- `assets/`: source media used outside the main `src/assets/uploads` pipeline.
- `products/`: Wealth & Scrubs product files, planner source HTML/CSS/scripts, generated product PDFs, and product documentation.
- `pinterest/`: Pinterest plan and finished Pinterest creative assets.
- `Affiliate_Database.csv`, `affiliate-links.csv`, and `advertiser-directory.csv`: affiliate and advertiser records.
- `MASTER_WEBSITE_REDESIGN_INSTRUCTIONS.md`, `PROJECT_INSTRUCTIONS.md`, `WEALTH_AND_SCRUBS_DESIGN_GUIDE.md`, `CATEGORY_COLOR_SYSTEM.md`, `TRAVEL_SAVINGS_CONSOLIDATION_REPORT.md`, and `NURSING_LIFE_REMODEL_REPORT.md`: active project instructions, redesign references, and consolidation reports.
- `PROJECT_FILE_MANIFEST.md`: current file-keeping and cleanup reference.
- `content-plan.md`: active editorial planning.
- `src/_redirects`: active redirect rules for consolidated or moved website URLs.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `eleventy.config.js`, `wrangler.jsonc`, `.node-version`, and `.gitignore`: build, deploy, and project configuration.

## Treat as Disposable Local Artifacts

These files and folders can be regenerated or are local machine clutter. They should stay out of git and can be removed during cleanup:

- `_site/`
- `node_modules/`
- `.cache/`
- `.wrangler/`
- `output/`
- `tmp/`
- `continue-export/`
- `$CODEX_HOME/`
- `.DS_Store`
- `*.dmg`
- `WealthandScrubs-Backups/`

## Backup Rule

Keep dated backup archives outside the active website repo in the separate `WealthandScrubs-Backups` folder. During cleanup, remove only duplicate in-repo backup copies after verifying the separate backup exists, and move any unique backup folder there before deleting the in-repo copy.

## Content Rule

Do not delete existing posts, pages, products, affiliate files, media assets, or SEO/linking data during cleanup unless the site owner explicitly approves the specific files.
