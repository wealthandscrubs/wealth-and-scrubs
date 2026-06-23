import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.ignores.add("src/assets/uploads/**");

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    widths: [480, 960, 1600],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async"
      }
    }
  });

  // Affiliate linkify transform
  // Loads src/_data/affiliate-links.json and replaces plain text occurrences
  // of advertiser names with affiliate anchor tags in generated HTML.
  const affiliateFile = path.join(process.cwd(), "src", "_data", "affiliate-links.json");
  let affiliates = {};
  try {
    const raw = fs.readFileSync(affiliateFile, "utf8");
    affiliates = JSON.parse(raw);
  } catch (e) {
    // file may not exist yet; continue without affiliate replacements
    affiliates = {};
  }

  const advertisers = Object.keys(affiliates).sort((a, b) => b.length - a.length);

  eleventyConfig.addTransform("affiliate-linkify", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    if (!advertisers.length) return content;

    const $ = cheerio.load(content, { decodeEntities: false });

    const skipTags = new Set(["a", "script", "style", "code", "pre", "noscript"]);

    const pageReplacements = Object.fromEntries(advertisers.map((a) => [a, 0]));
    const maxPerAdvertiserPerPage = 1;

    $("body")
      .find("*")
      .each((i, el) => {
        if (!el || !el.type) return;
        if (skipTags.has(el.tagName)) return;

        $(el)
          .contents()
          .filter(function () {
            return this.type === "text";
          })
          .each((ti, node) => {
            let text = node.data;
            if (!text || !text.trim()) return;

            for (const name of advertisers) {
              if (pageReplacements[name] >= maxPerAdvertiserPerPage) continue;
              const url = affiliates[name];
              if (!url) continue;

              const regex = new RegExp("\\b" + escapeRegExp(name) + "\\b", "gi");
              if (!regex.test(text)) continue;

              text = text.replace(regex, (match) => {
                pageReplacements[name] += 1;
                return `<a href="${url}" rel="nofollow noopener noreferrer" target="_blank">${match}</a>`;
              });

              if (pageReplacements[name] >= maxPerAdvertiserPerPage) {
                // stop replacing this advertiser further on this page
              }
            }

            if (text !== node.data) {
              $(node).replaceWith(text);
            }
          });
      });

    return $.html();
  });

  eleventyConfig.addFilter("readableDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString();
  });

  eleventyConfig.addFilter("categorySlug", (value = "") => {
    const knownSlugs = {
      "Deals & Discounts": "deals-discounts",
      "Money & Side Hustles": "money-side-hustles",
      "Nursing Life": "nursing-life",
      "Travel Savings": "travel-savings",
      "Lifestyle & Self-Care": "lifestyle-self-care"
    };
    if (knownSlugs[value]) return knownSlugs[value];
    return value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addFilter("postsByCategory", (posts = [], category = "") =>
    posts.filter((post) => (post.data.categories || []).includes(category))
  );

  eleventyConfig.addFilter("limit", (items = [], count = 3) =>
    items.slice(0, count)
  );

  eleventyConfig.addFilter("excludeUrl", (items = [], url = "") =>
    items.filter((item) => item.url !== url)
  );

  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
