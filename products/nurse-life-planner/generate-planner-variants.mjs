import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productDir = path.join(root, "products", "nurse-life-planner");
const sourcePath = path.join(productDir, "sample-pages.html");
const source = fs.readFileSync(sourcePath, "utf8");

const loginTracker = (audience) => `
      <section class="planner-page">
        <header class="page-header">
          <p class="eyebrow">${audience} Organization</p>
          <h1>Login Tracker</h1>
          <p>Keep important work, renewal, education, payroll, and resource logins organized in one place.</p>
        </header>

        <p class="safety-note"><strong>Privacy tip:</strong> For security, use this page for usernames, websites, hints, and renewal notes. Avoid writing full passwords if this planner leaves home.</p>

        <table class="tracker-table login-table">
          <thead>
            <tr><th>Website / app</th><th>Username / email</th><th>Password hint</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>

        <div class="prompt-box">Important accounts to remember: scheduling, payroll, education, license/certification renewal, email, and benefits.</div>
        <footer class="page-footer">Stay organized. Stay prepared.</footer>
      </section>
`;

const credentialTracker = ({ audience, title, subtitle, items }) => `
      <section class="planner-page">
        <header class="page-header">
          <p class="eyebrow">${audience} Career Tracker</p>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </header>

        <table class="tracker-table credential-table">
          <thead>
            <tr><th>License / certification</th><th>Renewal date</th><th>Required hours</th><th>Completed</th><th>Submitted?</th></tr>
          </thead>
          <tbody>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>

        <div class="checklist-grid credential-checklist">
${items.map((item) => `          <label><span></span> ${item}</label>`).join("\n")}
        </div>

        <footer class="page-footer">Keep your credentials current and easy to find.</footer>
      </section>
`;

const cnaAssignmentTracker = `
      <section class="planner-page">
        <header class="page-header">
          <p class="eyebrow">CNA Shift Support</p>
          <h1>Assignment Tracker</h1>
          <p>Use this page to organize your hall, assignment, resident-care reminders, and shift priorities.</p>
        </header>

        <div class="top-fields four">
          <label>Date <span></span></label>
          <label>Facility / unit <span></span></label>
          <label>Hall / assignment <span></span></label>
          <label>Shift <span></span></label>
        </div>

        <table class="tracker-table assignment-table">
          <thead>
            <tr><th>Resident / room</th><th>ADLs</th><th>Vitals / rounds</th><th>Notes / follow-up</th></tr>
          </thead>
          <tbody>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>

        <div class="prompt-box">Remember to follow facility policy and protect resident privacy.</div>
        <footer class="page-footer">Care work matters.</footer>
      </section>
`;

const lpnShiftPriorities = `
      <section class="planner-page">
        <header class="page-header">
          <p class="eyebrow">LPN Shift Support</p>
          <h1>Shift Priorities</h1>
          <p>Keep your shift organized with space for priorities, follow-ups, care notes, and reminders.</p>
        </header>

        <div class="top-fields four">
          <label>Date <span></span></label>
          <label>Facility / unit <span></span></label>
          <label>Assignment <span></span></label>
          <label>Shift <span></span></label>
        </div>

        <div class="reflection-grid">
          <section><h2>Top Care Priorities</h2><div class="lined"></div></section>
          <section><h2>Provider / Nurse Follow-Up</h2><div class="lined"></div></section>
          <section><h2>Charting Reminders</h2><div class="lined"></div></section>
          <section><h2>End-of-Shift Report Notes</h2><div class="lined"></div></section>
        </div>

        <footer class="page-footer">Organized notes make a smoother handoff.</footer>
      </section>
`;

const insertBeforeReflection = (html, insert) =>
  html.replace("      <section class=\"planner-page\">\n        <header class=\"page-header\">\n          <p class=\"eyebrow\">Month-End Reset</p>", `${insert}\n      <section class=\"planner-page\">\n        <header class=\"page-header\">\n          <p class=\"eyebrow\">Month-End Reset</p>`);

const variants = [
  {
    file: "cna-monthly-planner.html",
    title: "Wealth & Scrubs CNA Life Monthly Planner",
    replacements: [
      [/Wealth & Scrubs Nurse Life Planner Sample Pages/g, "Wealth & Scrubs CNA Life Monthly Planner"],
      [/Nurse Life Monthly Planner/g, "CNA Life Monthly Planner"],
      [/Monthly Shift \+ Money Planner/g, "Monthly Shift + Care Planner"],
      [/Plan your shifts\. Track your money\. Protect your peace\./g, "Plan your shifts. Track your care. Protect your peace."],
      [/Wealth & Scrubs Nurse Life Planner/g, "Wealth & Scrubs CNA Life Planner"],
      [/nurses/gi, "CNAs"],
      [/nurse/gi, "CNA"],
      [/Nurses/g, "CNAs"],
      [/Nurse/g, "CNA"],
      [/Manage Your Shifts/g, "Manage Your Assignments"],
      [/Weekly shift planning, shift logs, sleep goals, meals, and post-shift reset space\./g, "Weekly shift planning, assignment notes, sleep goals, meals, and post-shift reset space."],
    ],
    insert: `${cnaAssignmentTracker}${loginTracker("CNA")}${credentialTracker({
      audience: "CNA",
      title: "Certification + In-Service Tracker",
      subtitle: "Track certification renewal, in-service hours, required education, and important work training.",
      items: [
        "CNA certification renewal checked",
        "Required in-service hours completed",
        "CPR/BLS date reviewed",
        "Employer training completed",
        "Certificates saved",
        "Renewal login updated",
      ],
    })}`,
  },
  {
    file: "lpn-monthly-planner.html",
    title: "Wealth & Scrubs LPN Life Monthly Planner",
    replacements: [
      [/Wealth & Scrubs Nurse Life Planner Sample Pages/g, "Wealth & Scrubs LPN Life Monthly Planner"],
      [/Nurse Life Monthly Planner/g, "LPN Life Monthly Planner"],
      [/Monthly Shift \+ Money Planner/g, "Monthly Shift + License Planner"],
      [/Wealth & Scrubs Nurse Life Planner/g, "Wealth & Scrubs LPN Life Planner"],
      [/nurses/gi, "LPNs"],
      [/nurse/gi, "LPN"],
      [/Nurses/g, "LPNs"],
      [/Nurse/g, "LPN"],
    ],
    insert: `${lpnShiftPriorities}${loginTracker("LPN")}${credentialTracker({
      audience: "LPN",
      title: "License + CEU Tracker",
      subtitle: "Track license renewal, CEUs, certifications, employer education, and submitted certificates.",
      items: [
        "LPN license renewal date checked",
        "Required CEUs reviewed",
        "BLS/CPR date reviewed",
        "Employer education completed",
        "Certificates saved",
        "Renewal fees planned",
      ],
    })}`,
  },
];

for (const variant of variants) {
  let html = source;
  for (const [pattern, replacement] of variant.replacements) {
    html = html.replace(pattern, replacement);
  }
  html = insertBeforeReflection(html, variant.insert);
  html = html.replace(/<title>.*?<\/title>/, `<title>${variant.title}</title>`);
  fs.writeFileSync(path.join(productDir, variant.file), html);
  console.log(`Wrote ${variant.file}`);
}
