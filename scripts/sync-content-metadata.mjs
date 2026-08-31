import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const affiliatePath = path.join(root, "affiliate-links.csv");
const legacyAffiliatePath = path.join(root, "Affiliate_Database.csv");
const affiliateLinkMapPath = path.join(root, "src", "_data", "affiliate-links.json");
const contentPlanPath = path.join(root, "content-plan.md");
const postsDir = path.join(root, "src", "posts");
const autoLinkExcludedAdvertisers = new Set(["Coin", "PayPal", "Verizon"]);

const affiliateHeaders = [
  "advertiser",
  "network",
  "category",
  "payout",
  "tracking_url",
  "status",
  "source",
  "notes",
  "last_verified",
];

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted && character === '"' && input[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  const output = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${output}\n`);
}

function syncAffiliates() {
  const existing = fs.existsSync(affiliatePath)
    ? parseCsv(fs.readFileSync(affiliatePath, "utf8"))
    : [];
  const legacy = fs.existsSync(legacyAffiliatePath)
    ? parseCsv(fs.readFileSync(legacyAffiliatePath, "utf8"))
    : [];
  const rowsByKey = new Map(
    existing.map((row) => [
      `${row.advertiser.toLowerCase()}|${row.network.toLowerCase()}`,
      Object.fromEntries(affiliateHeaders.map((header) => [header, row[header] ?? ""])),
    ]),
  );
  const verifiedDate = new Date().toISOString().slice(0, 10);

  for (const row of legacy) {
    const trackingUrl = row["Affiliate Link"]?.trim();
    if (!trackingUrl) continue;
    const advertiser = row.Company.trim();
    const network = row.Network.trim();
    const key = `${advertiser.toLowerCase()}|${network.toLowerCase()}`;
    const current = rowsByKey.get(key) ?? {};
    rowsByKey.set(key, {
      advertiser,
      network,
      category: row.Category.trim(),
      payout: current.payout ?? "",
      tracking_url: trackingUrl,
      status: current.status || "approved",
      source: current.source || "Owner supplied",
      notes: row.Notes.trim(),
      last_verified: current.last_verified || verifiedDate,
    });
  }

  const rows = [...rowsByKey.values()].sort((a, b) =>
    a.advertiser.localeCompare(b.advertiser),
  );
  writeCsv(affiliatePath, affiliateHeaders, rows);
  const approvedLinks = Object.fromEntries(
    rows
      .filter((row) => row.status === "approved" && row.tracking_url)
      .filter((row) => !autoLinkExcludedAdvertisers.has(row.advertiser))
      .map((row) => [row.advertiser, row.tracking_url]),
  );
  fs.writeFileSync(affiliateLinkMapPath, `${JSON.stringify(approvedLinks, null, 2)}\n`);
  return rows.length;
}

function frontMatterValue(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value).join(", ");
    } catch {
      return value;
    }
  }
  return value.replace(/^['"]|['"]$/g, "");
}

function wordCount(source) {
  const body = source.replace(/^---[\s\S]*?---/, "");
  const text = body
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").length : 0;
}

function syncContentPlan() {
  const posts = fs
    .readdirSync(postsDir)
    .filter((file) => /\.(html|md)$/.test(file))
    .map((file) => {
      const source = fs.readFileSync(path.join(postsDir, file), "utf8");
      return {
        excluded: frontMatterValue(source, "eleventyExcludeFromCollections") === "true",
        title: frontMatterValue(source, "title"),
        date: frontMatterValue(source, "date"),
        categories: frontMatterValue(source, "categories"),
        url: frontMatterValue(source, "permalink").replace(/index\.html$/, ""),
        words: wordCount(source),
        faq: /<h[2-4][^>]*>[^<]*FAQs?/i.test(source) ? "Yes" : "No",
      };
    })
    .filter((post) => !post.excluded && post.url !== "false")
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

  const table = [
    "## Published Article Inventory",
    "",
    `**Total published posts:** ${posts.length}`,
    "",
    "| Date | Article | Category | Words | FAQ |",
    "| --- | --- | --- | ---: | :---: |",
    ...posts.map(
      (post) =>
        `| ${post.date} | [${post.title}](${post.url}) | ${post.categories} | ${post.words} | ${post.faq} |`,
    ),
  ].join("\n");

  const current = fs.readFileSync(contentPlanPath, "utf8");
  const start = "<!-- AUTO:START -->";
  const end = "<!-- AUTO:END -->";
  if (!current.includes(start) || !current.includes(end)) {
    throw new Error(`Missing synchronization markers in ${contentPlanPath}`);
  }
  const updated = current.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`),
    `${start}\n${table}\n${end}`,
  );
  fs.writeFileSync(contentPlanPath, updated);
  return posts.length;
}

const affiliateCount = syncAffiliates();
const postCount = syncContentPlan();
console.log(`Synchronized ${affiliateCount} affiliate links and ${postCount} posts.`);
