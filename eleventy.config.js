import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

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
