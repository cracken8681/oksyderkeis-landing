/**
 * ΚΕΝΤΡΙΚΟ CONFIG — άλλαξε ΜΟΝΟ εδώ.
 * Τα "TODO" είναι ό,τι λείπει ακόμα.
 */

export const SITE = {
  name: "Oksyderkeis",
  domain: process.env.SITE_DOMAIN || "oksyderkeis.vercel.app",
  url: process.env.SITE_URL || "https://oksyderkeis.vercel.app",
  defaultOgImage: "/og-image.png", // TODO: ανέβασε 1200x630 στο /public
  locale: "el_GR",
};

/** YouTube — για auto-embed τελευταίου βίντεο μέσω RSS (build-time). */
export const YOUTUBE = {
  channelId: "UCehFRZia1Ar0wuMMgNI4eSA", // ✓ DONE
  channelUrl: "https://www.youtube.com/@oksyderkeis",
};

/** AI Agents — ✓ έτοιμα (custom GPTs). */
export const AGENTS = {
  mini: "https://chatgpt.com/g/g-6a0201151c3481918f80399da8753f0e-ai-oikonomikos-organotes-mini",
  full: "https://chatgpt.com/g/g-6a02313df92c819186e9adb804bd87db-ai-oikonomikos-organotes-full",
  motivator: "https://chatgpt.com/g/g-6a0238c7b21c81919aa0ce4ba257bf7f-no-excuses-coach-truth-mode",
};

/** Lumi — ΔΕΝ τελείωσε ακόμα → waitlist προς το παρόν (Φάση 2 η πλήρης σελίδα). */
export const LUMI = {
  mode: "waitlist" as "waitlist" | "live",
  waitlistUrl: "#email", // προσωρινά: στέλνει στη φόρμα email
  appStoreUrl: "TODO_APP_STORE_URL",
  playStoreUrl: "TODO_PLAY_STORE_URL",
};

/**
 * Money OS Pro — το paid προϊόν (Βήμα 2 του funnel).
 * ΔΕΝ υπάρχει checkout ακόμα → "waitlist" mode: μαζεύει ενδιαφέρον (early access)
 * αντί για νεκρό κουμπί. Όταν στηθεί Gumroad/Lemon Squeezy:
 *   1) βάλε το checkoutUrl   2) άλλαξε mode σε "live".
 */
export const MONEY_OS = {
  mode: "live" as "waitlist" | "live",
  checkoutUrl: "https://buy.stripe.com/cNifZieVt09nfmC7Jy1wY01",
  launchPrice: "17€",
  futurePrice: "27€",
  features: [
    ["📊", "Google Sheets dashboard", "Έσοδα, έξοδα, savings rate & στόχοι — όλα σε ένα ζωντανό φύλλο."],
    ["🤖", "AI prompt pack", "Έτοιμα prompts για να δουλεύεις τα οικονομικά σου με AI."],
    ["📕", "PDF workbook", "Βήμα-βήμα οδηγός για να στήσεις το σύστημα από το μηδέν."],
    ["🗓️", "7ήμερο πλάνο setup", "Ένα μικρό βήμα τη μέρα — σε μία εβδομάδα είσαι έτοιμος."],
    ["✅", "Investing readiness checklist", "Δες αν είσαι πραγματικά έτοιμος να επενδύσεις — πριν βάλεις ευρώ."],
    ["🎬", "Mini video walkthroughs", "Σύντομα βίντεο που σε καθοδηγούν σε κάθε κομμάτι."],
  ],
} as const;

/** MailerLite — ✓ CONFIGURED */
export const MAILERLITE = {
  accountId: "2393657", // ✓ DONE
  waitlistFormId: "vmdwDz", // ✓ DONE
  newsletterFormId: "9wJj68", // ξεχωριστό form για το newsletter
  waitlistGroupId: "188976667270579857",
  newsletterGroupId: "190415310059209948",
  waitlistAutomationId: "189188257217513263",
  newsletterAutomationId: "190443484157576615",
  // Universal script handle-άρει τα πάντα (δεν χρειάζεται explicit actionUrl)
};

export const SOCIAL = {
  telegram: "https://t.me/Oksyderkeis",
  youtube: "https://www.youtube.com/@oksyderkeis",
  instagram: "https://instagram.com/oksyderkeis",
  tiktok: "https://tiktok.com/@oksyderkeis",
};

export const ANALYTICS = {
  plausibleDomain: "", // βάλε domain όταν υπάρχει (Φάση 2)
  ga4Id: "",
};

export const LEGAL = {
  privacyUrl: "/privacy", // ✓ σελίδα privacy (παραδίδω εγώ)
};

/**
 * Affiliate offers — ✓ links από την περιγραφή YouTube.
 * ΣΗΜΕΙΩΣΗ COMPLIANCE:
 *  - eToro: approval Lucia ΠΡΙΝ live (pending).
 *  - Scramble: approval Κασσιανή ΠΡΙΝ live (pending).
 *  - Freedom24: διατύπωση «έως 20 δωρεάν μετοχές, κλιμακωτά».
 */
export const AFFILIATES = [
  {
    name: "Freedom24",
    blurb: "Επενδύσεις σε ETFs, μετοχές & ομόλογα.",
    offer: "Έως 20 δωρεάν μετοχές, κλιμακωτά ανάλογα με την κατάθεση (έως 30.06.2026, μόνο ΕΕ). Υπόκειται σε όρους· κεφάλαιο σε κίνδυνο.",
    url: "https://tinyurl.com/3khcendc",
  },
  {
    name: "eToro",
    blurb: "Μετοχές, ETFs & crypto με copy trading.",
    offer: "Δωρεάν trading course αξίας $2,000 για νέους χρήστες. Κεφάλαιο σε κίνδυνο.",
    url: "https://med.etoro.com/B22184_A128888_TClick.aspx",
  },
  {
    name: "Scramble",
    blurb: "Επένδυση σε ευρωπαϊκά brands.",
    offer: "€10 bonus με εγγραφή · promo: oksyderkeis0426.",
    url: "https://bit.ly/oksyderkeis0426_scramble",
  },
  {
    name: "Wealthyhood",
    blurb: "Μετοχές & ETFs από το κινητό.",
    offer: "Δωρεάν μετοχή έως €200 με πρώτη επένδυση €100+ (και για τους δύο).",
    url: "https://wealthyhood.com?wlthd=UC518TCD",
  },
  {
    name: "Trading 212",
    blurb: "Μετοχές & ETFs χωρίς προμήθεια.",
    offer: "1,5% επιστροφή με την κάρτα Trading 212.",
    url: "https://www.trading212.com/invite/4DpLOo8Pyka",
  },
  {
    name: "Bybit",
    blurb: "Crypto exchange με εργαλεία trading & staking.",
    offer: "$25 bonus για νέους χρήστες · 2% επιστροφή με κάρτα Bybit.",
    url: "https://www.bybit.eu/invite?ref=JEP6QNW",
  },
  {
    name: "Revolut",
    blurb: "Budgeting, συναλλαγές & crypto σε μία εφαρμογή.",
    offer: "Δωρεάν εγγραφή μέσω του link μου.",
    url: "https://revolut.com/referral/?referral-code=davidmx!MAY1-25-AR-H1",
  },
] as const;
