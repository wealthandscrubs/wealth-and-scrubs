import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const title = (await rl.question("Post title: ")).trim();
const category = (await rl.question("Category: ")).trim() || "Money & Side Hustles";
const description = (await rl.question("Short description: ")).trim();
rl.close();

if (!title) {
  console.error("A title is required.");
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");
const now = new Date();
const date = now.toISOString().slice(0, 10);
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const file = path.join("src", "posts", `${date}-${slug}.md`);
const frontMatter = `---
layout: layouts/post.njk
title: ${JSON.stringify(title)}
date: ${date}
permalink: /${year}/${month}/${day}/${slug}/index.html
categories: [${JSON.stringify(category)}]
tags: [post]
excerpt: ${JSON.stringify(description)}
author: "Brooke | Wealth & Scrubs"
---

Write your introduction here.

## First Helpful Section

Add practical information, bullet points, and links here.

## Short Recap

End with a concise summary and a clear next step for the reader.
`;

fs.mkdirSync(path.dirname(file), { recursive: true });
if (fs.existsSync(file)) {
  console.error(`Post already exists: ${file}`);
  process.exit(1);
}
fs.writeFileSync(file, frontMatter);
console.log(`Created ${file}`);
