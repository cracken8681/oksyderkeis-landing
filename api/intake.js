const https = require("https");
const dns = require("dns").promises;

const SUBMISSION_HEADERS = [
  "timestamp", "source", "business", "website", "name", "role", "email", "phone", "industry",
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17", "q18",
  "consent", "raw_json"
];

const PIPELINE_HEADERS = ["timestamp", "business", "website", "name", "email", "status", "next_step", "raw_json"];

const ANALYTICS_EVENTS = new Set(["intake_submit_success"]);

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const payloadError = validatePayload(payload);
    if (payloadError) return res.status(400).json({ ok: false, error: payloadError });
    const emailError = await validateEmail(payload.contact || {});
    if (emailError) return res.status(400).json({ ok: false, error: emailError });
    const token = await getAccessToken();
    const sheetId = required("GOOGLE_SHEET_ID");
    await appendValues(token, sheetId, "submissions!A1", [submissionRow(payload)]);
    await appendValues(token, sheetId, "pipeline!A1", [pipelineRow(payload)]);
    await appendAnalyticsEvent(token, sheetId, {
      event: "intake_submit_success",
      source: payload.meta?.source || "",
      sessionId: payload.meta?.session_id || "",
      path: payload.meta?.path || "",
      referrer: payload.meta?.referrer || "",
      pageVersion: payload.meta?.version || "",
    });
    const notification = await trySendNotification(payload);
    return res.status(200).json({ ok: true, notification });
  } catch (error) {
    console.error("intake_submit_failed", error);
    return res.status(500).json({ ok: false, error: "submit_failed" });
  }
};

module.exports._test = {
  answerText,
  countAnsweredQuestions,
  validatePayload,
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function validateEmail(contact) {
  const email = normalizeEmail(contact.email);
  const emailConfirm = normalizeEmail(contact.emailConfirm);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "invalid_email";
  if (emailConfirm && emailConfirm !== email) return "email_mismatch";
  const domain = email.split("@")[1];
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) return "email_domain_unverified";
    return null;
  } catch (_) {
    return "email_domain_unverified";
  }
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function clean(value) {
  return String(value || "").trim();
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "invalid_payload";
  if (clean(payload.honey || payload.honeypot || payload.website_field)) return "spam_detected";

  const contact = payload.contact || {};
  const requiredFields = ["business", "website", "name", "email"];
  const missing = requiredFields.some((field) => !clean(contact[field]));
  if (missing) return "missing_required_fields";

  if (payload.consent !== true) return "consent_required";
  if (countAnsweredQuestions(payload) < 10) return "insufficient_answers";

  return null;
}

function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
}

function answerText(payload, key) {
  const answer = payload.answers && payload.answers[key];
  if (!answer) return "";
  const choices = Array.isArray(answer.choices) ? answer.choices : [];
  return [...choices, answer.other || ""].map(clean).filter(Boolean).join(" | ");
}

function countAnsweredQuestions(payload) {
  if (!payload.answers || typeof payload.answers !== "object") return 0;
  let count = 0;
  for (let i = 1; i <= 18; i += 1) {
    if (answerText(payload, `q${i}`)) count += 1;
  }
  return count;
}

function submissionRow(payload) {
  const contact = payload.contact || {};
  const row = [
    new Date().toISOString(),
    payload.meta?.source || "",
    contact.business || "",
    contact.website || "",
    contact.name || "",
    contact.role || "",
    contact.email || "",
    contact.phone || "",
    contact.industry || "",
  ];
  for (let i = 1; i <= 18; i += 1) row.push(answerText(payload, `q${i}`));
  row.push(payload.consent === true ? "TRUE" : "FALSE");
  row.push(JSON.stringify(payload));
  return row;
}

function pipelineRow(payload) {
  const contact = payload.contact || {};
  return [
    new Date().toISOString(),
    contact.business || "",
    contact.website || "",
    contact.name || "",
    contact.email || "",
    "new",
    "Review intake and prepare first diagnostic response",
    JSON.stringify(payload),
  ];
}

async function appendAnalyticsEvent(token, sheetId, event) {
  if (!ANALYTICS_EVENTS.has(event.event)) return;
  await ensureSheet(token, sheetId, "analytics", [
    "timestamp", "event", "source", "session_id", "path", "referrer", "page_version", "note"
  ]);
  await appendValues(token, sheetId, "analytics!A1", [[
    new Date().toISOString(),
    event.event,
    event.source || "",
    event.sessionId || "",
    event.path || "",
    event.referrer || "",
    event.pageVersion || "",
    "",
  ]]);
}

async function ensureSheet(token, sheetId, title, headers) {
  const meta = await requestJson("GET", `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`, {
    authorization: `Bearer ${token}`,
  });
  const exists = (meta.sheets || []).some((sheet) => sheet.properties && sheet.properties.title === title);
  if (!exists) {
    await requestJson("POST", `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }, JSON.stringify({ requests: [{ addSheet: { properties: { title } } }] }));
    await appendValues(token, sheetId, `${title}!A1`, [headers]);
  }
}

async function trySendNotification(payload) {
  const requiredKeys = ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN", "NOTIFY_EMAIL"];
  if (requiredKeys.some((key) => !process.env[key])) return "not_configured";
  try {
    const token = await getGmailAccessToken();
    await sendGmail(token, process.env.NOTIFY_EMAIL, notificationSubject(payload), notificationBody(payload));
    return "sent";
  } catch (error) {
    console.error("intake_notification_failed", error);
    return "failed";
  }
}

async function getGmailAccessToken() {
  const body = new URLSearchParams({
    client_id: required("GMAIL_CLIENT_ID"),
    client_secret: required("GMAIL_CLIENT_SECRET"),
    refresh_token: required("GMAIL_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  }).toString();
  const result = await requestJson("POST", "https://oauth2.googleapis.com/token", {
    "content-type": "application/x-www-form-urlencoded",
  }, body);
  if (!result.access_token) throw new Error("No Gmail access token from Google");
  return result.access_token;
}

async function sendGmail(token, to, subject, body) {
  const raw = [
    `To: ${to}`,
    "From: oksyderkeisbydavid@gmail.com",
    `Subject: ${encodeMimeHeader(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(body, "utf8").toString("base64"),
  ].join("\r\n");
  const encoded = Buffer.from(raw, "utf8").toString("base64url");
  return requestJson("POST", "https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  }, JSON.stringify({ raw: encoded }));
}

function encodeMimeHeader(value) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function notificationSubject(payload) {
  const business = payload.contact?.business || "unknown business";
  return `New AI Revenue intake: ${business}`;
}

function notificationBody(payload) {
  const contact = payload.contact || {};
  return [
    "New AI Revenue intake submission",
    "",
    `Business: ${contact.business || ""}`,
    `Website: ${contact.website || ""}`,
    `Name: ${contact.name || ""}`,
    `Email: ${contact.email || ""}`,
    `Leads/month (q8): ${answerText(payload, "q8")}`,
    `Urgency (q17): ${answerText(payload, "q17")}`,
  ].join("\n");
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: required("GOOGLE_CLIENT_ID"),
    client_secret: required("GOOGLE_CLIENT_SECRET"),
    refresh_token: required("GOOGLE_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  }).toString();
  const result = await requestJson("POST", "https://oauth2.googleapis.com/token", {
    "content-type": "application/x-www-form-urlencoded",
  }, body);
  if (!result.access_token) throw new Error("No access token from Google");
  return result.access_token;
}

async function appendValues(token, sheetId, range, values) {
  const path = `/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  return requestJson("POST", `https://sheets.googleapis.com${path}`, {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  }, JSON.stringify({ values }));
}

function requestJson(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        let parsed = {};
        try { parsed = data ? JSON.parse(data) : {}; } catch (_) { parsed = { raw: data }; }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`${method} ${url} failed ${res.statusCode}: ${JSON.stringify(parsed)}`));
          return;
        }
        resolve(parsed);
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}
