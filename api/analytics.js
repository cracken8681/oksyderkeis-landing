const https = require("https");

const ALLOWED_EVENTS = new Set(["page_view", "quiz_start", "submit_success"]);

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const event = clean(payload.event, 48);
    if (!ALLOWED_EVENTS.has(event)) return res.status(400).json({ ok: false, error: "invalid_event" });

    const token = await getAccessToken();
    const sheetId = required("GOOGLE_SHEET_ID");
    await ensureSheet(token, sheetId, "analytics", [
      "timestamp", "event", "source", "session_id", "path", "referrer", "page_version", "note"
    ]);
    await appendValues(token, sheetId, "analytics!A1", [[
      new Date().toISOString(),
      event,
      clean(payload.source, 80),
      clean(payload.sessionId, 80),
      clean(payload.path, 240),
      clean(payload.referrer, 240),
      clean(payload.pageVersion, 40),
      clean(payload.note, 160),
    ]]);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("analytics_event_failed", error);
    return res.status(500).json({ ok: false, error: "analytics_failed" });
  }
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function clean(value, max) {
  return String(value || "").replace(/[\r\n\t]/g, " ").trim().slice(0, max);
}

function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
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
