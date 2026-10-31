import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import * as cheerio from "cheerio";

// Run after pnpm build so coverage includes every generated public HTML page.
const id = "G-BBMW70ZFHE";
const htmlFiles = fs.readdirSync("_site", { recursive: true })
  .filter((file) => file.endsWith(".html"));
const source = cheerio.load(fs.readFileSync("_site/index.html", "utf8"))
  ("#wealth-and-scrubs-analytics").html();

function browser({ hostname = "wealthandscrubs.com", navigator = {}, window = {} } = {}) {
  const scripts = [];
  const context = vm.createContext({
    location: { hostname }, navigator, window,
    document: {
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) }
    }
  });
  const run = () => vm.runInContext(source, context);
  run();
  return { window, scripts, run, commands: () => Array.from(window.dataLayer || [], (args) => Array.from(args)) };
}

test("every generated page includes exactly one shared analytics initializer", () => {
  assert.ok(htmlFiles.length > 40, "Expected the complete site build");
  for (const file of htmlFiles) {
    const $ = cheerio.load(fs.readFileSync(path.join("_site", file), "utf8"));
    assert.equal($("head #wealth-and-scrubs-analytics").length, 1, file);
    assert.equal($("#wealth-and-scrubs-analytics").html(), source, file);
    assert.equal($("script").filter((_, el) => /googletagmanager|google-analytics|gtag\(/i.test($(el).text() + ($(el).attr("src") || ""))).length, 1, file);
  }
});

test("production loads GA4 once and leaves automatic page views to config", () => {
  for (const hostname of ["wealthandscrubs.com", "www.wealthandscrubs.com"]) {
    const result = browser({ hostname });
    result.run();
    assert.equal(result.scripts.length, 1);
    assert.equal(result.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${id}`);
    assert.equal(result.scripts[0].async, true);
    assert.equal(result.commands().length, 2);
    const [js, config] = result.commands();
    assert.equal(js[0], "js");
    assert.equal(config[0], "config");
    assert.equal(config[1], id);
    assert.equal(config[2].send_page_view, undefined);
    assert.equal(config[2].allow_google_signals, false);
    assert.equal(config[2].allow_ad_personalization_signals, false);
  }
});

test("local and deployment preview visits do not enter production Analytics", () => {
  for (const hostname of ["localhost", "127.0.0.1", "preview.workers.dev", "example.com"]) {
    assert.equal(browser({ hostname }).scripts.length, 0);
  }
});

test("browser privacy signals and the GA opt-out prevent loading and events", () => {
  for (const options of [
    { navigator: { globalPrivacyControl: true } },
    { navigator: { doNotTrack: "1" } },
    { navigator: { doNotTrack: "yes" } },
    { window: { doNotTrack: "1" } },
    { window: { [`ga-disable-${id}`]: true } }
  ]) {
    const result = browser(options);
    assert.equal(result.scripts.length, 0);
    assert.equal(result.commands().length, 0);
  }
});

test("existing consent commands and gtag are preserved without granting consent", () => {
  const consent = ["consent", "default", { analytics_storage: "denied" }];
  const dataLayer = [consent];
  const gtag = function () { dataLayer.push(arguments); };
  const result = browser({ window: { dataLayer, gtag } });
  assert.equal(result.window.dataLayer, dataLayer);
  assert.equal(result.window.gtag, gtag);
  assert.equal(dataLayer[0], consent);
  assert.equal(result.commands().filter((command) => command[0] === "consent").length, 1);
});
