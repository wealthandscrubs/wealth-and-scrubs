import fs from "node:fs";
import path from "node:path";

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
      if (row.some((value) => value.trim() !== "")) rows.push(row);
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

export default function () {
  const filePath = path.join(process.cwd(), "affiliate-links.csv");
  if (!fs.existsSync(filePath)) return [];

  return parseCsv(fs.readFileSync(filePath, "utf8"))
    .map((row) => ({
      advertiser: row.advertiser?.trim() || "",
      network: row.network?.trim() || "",
      category: row.category?.trim() || "",
      tracking_url: row.tracking_url?.trim() || "",
      status: row.status?.trim() || "",
      notes: row.notes?.trim() || "",
      last_verified: row.last_verified?.trim() || ""
    }))
    .filter((row) => row.advertiser && row.tracking_url);
}
