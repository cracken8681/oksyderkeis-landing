const https = require("https");

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function getGmailToken() {
  const body = new URLSearchParams({
    client_id: required("GMAIL_CLIENT_ID"),
    client_secret: required("GMAIL_CLIENT_SECRET"),
    refresh_token: required("GMAIL_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: "oauth2.googleapis.com", path: "/token", method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          const parsed = JSON.parse(data);
          if (parsed.access_token) resolve(parsed.access_token);
          else reject(new Error("Token error: " + data));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function formatAnswers(payload) {
  const contact = payload.contact || {};
  const answers = payload.answers || {};
  const lines = [
    `📋 Νέο AI Revenue Διαγνωστικό`,
    ``,
    `━━━ ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ ━━━`,
    `Επιχείρηση: ${contact.business || "-"}`,
    `Website:    ${contact.website || "-"}`,
    `Όνομα:      ${contact.name || "-"}`,
    `Ρόλος:      ${contact.role || "-"}`,
    `Email:      ${contact.email || "-"}`,
    `Τηλέφωνο:  ${contact.phone || "-"}`,
    `Κλάδος:    ${contact.industry || "-"}`,
    ``,
    `━━━ ΑΠΑΝΤΗΣΕΙΣ ━━━`,
  ];

  const qLabels = {
    q1: "Β1. Κύρια υπηρεσία",
    q2: "Β2. Υπηρεσία 30-60 ημερών",
    q3: "Β3. Στόχος πελάτης",
    q4: "Γ4. Βασικό πρόβλημα",
    q5: "Γ5. Κεντρικό μήνυμα",
    q6: "Γ6. Επόμενη κίνηση επισκέπτη",
    q7: "Δ7. Πηγές πελατών",
    q8: "Δ8. Νέοι ενδιαφερόμενοι/μήνα",
    q9: "Δ9. Διαθέσιμα analytics",
    q10: "Δ10. Δοκιμασμένα κανάλια",
    q11: "Δ11. Πού χάνεται ο επισκέπτης",
    q12: "Ε12. Δυνατότερο proof",
    q13: "Ε13. Ανταγωνιστής",
    q14: "Ε14. Ιδανική αναζήτηση",
    q15: "ΣΤ15. Στόχος επιτυχίας",
    q16: "ΣΤ16. Ποιος αλλάζει το site",
    q17: "ΣΤ17. Χρονοδιάγραμμα",
    q18: "ΣΤ18. Περιορισμοί/σημειώσεις",
  };

  for (const [key, label] of Object.entries(qLabels)) {
    const val = answers[key] || "-";
    const other = answers[`${key}_other`];
    lines.push(`${label}: ${val}${other ? ` | Άλλο: ${other}` : ""}`);
  }

  lines.push(``, `━━━ META ━━━`);
  lines.push(`Source: ${(payload.meta || {}).source || "quiz"}`);
  lines.push(`Submitted: ${new Date().toISOString()}`);

  return lines.join("\n");
}

async function sendGmail(token, to, subject, text) {
  const raw = [
    `From: AI Revenue by Oksyderkeis <oksyderkeisbydavid@gmail.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    text,
  ].join("\r\n");

  const encoded = Buffer.from(raw).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ raw: encoded });
    const req = https.request(
      { hostname: "gmail.googleapis.com", path: "/gmail/v1/users/me/messages/send",
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(JSON.parse(data)));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const contact = payload.contact || {};

    if (!contact.email || !contact.business) {
      return res.status(400).json({ ok: false, error: "missing_required_fields" });
    }

    const token = await getGmailToken();
    const text = formatAnswers(payload);
    const subject = `[AI Revenue] Νέο Διαγνωστικό — ${contact.business} (${contact.email})`;

    await sendGmail(token, "oksyderkeisbydavid@gmail.com", subject, text);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("intake_error", err.message);
    return res.status(500).json({ ok: false, error: "submit_failed" });
  }
};
