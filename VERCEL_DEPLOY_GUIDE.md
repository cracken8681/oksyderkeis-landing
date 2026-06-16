# Vercel Deploy — ΦΑΣΗ 1 ΒΗΜΑ 6

---

## **ΤΙ ΚΑΝΟΥΜΕ**
Uploading σου το site στο Vercel → live σε `oksyderkeis.vercel.app` (5 λεπτά).

---

## **OPTION A: GitHub + Vercel (Recommended — ευκολότερο)**

### 1. Push code στο GitHub
```bash
# Terminal / Command Prompt — στο project folder

git init
git add .
git commit -m "Initial Oksyderkeis landing"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oksyderkeis-landing.git
git push -u origin main
```
(Αν δεν έχεις Git → install από https://git-scm.com)

### 2. Vercel Deploy
1. Άνοιξε https://vercel.com
2. Sign up / Login (με GitHub account).
3. Κάνε κλικ **"Add New..." → "Project"**.
4. **Import Git Repo** → authorize GitHub.
5. Ψάξε `oksyderkeis-landing` → Select.
6. **Framework**: Vercel auto-detects Astro ✓
7. **Environment Variables**: 
   - Name: `SITE_URL`
   - Value: `https://oksyderkeis.vercel.app`
8. Κάνε κλικ **"Deploy"** (πράσινο).
9. Περιμένει ~1-2 λεπτά → **"Congratulations! Your site is live!"**
10. Link: `https://oksyderkeis.vercel.app` ✓

---

## **OPTION B: Upload ZIP (No GitHub)**

### 1. Download ZIP από εμένα
```
Oksyderkeis-landing.zip (από /outputs)
```

### 2. Extract locally
```bash
unzip oksyderkeis-landing.zip
cd oksyderkeis-landing
```

### 3. Install Vercel CLI
```bash
npm install -g vercel
```

### 4. Deploy
```bash
vercel
# Follow prompts:
# ✓ Link to existing project? NO
# ✓ Project name: oksyderkeis
# ✓ Directory: ./
# ✓ Deploy? YES
```

5. Link: `https://oksyderkeis.vercel.app` ✓

---

## **ΜΕΤΑ ΤΟ DEPLOY**

### ✓ Test τα πάντα
- [ ] Mobile + Desktop view
- [ ] Email form (enter email + see redirect /tools)
- [ ] YouTube video loads
- [ ] CTAs δουλεύουν (links, affiliate, Telegram)
- [ ] Privacy policy accessible

### ✓ Custom Domain (Φάση 2)
Vercel Dashboard → Project Settings → Domains → add custom domain (αν έχεις).

### ✓ Monitoring
Vercel Dashboard → Deployments = ιστορία, logs, status.

---

## **ΑΡΙΘΜΟΣ ΛΆΘΟΥΣ?**

**Error: "Cannot find module..."**
→ `npm install` locally, commit, re-deploy.

**Form δεν submit?**
→ Check MailerLite script loaded (DevTools → Network → assets.mailerlite.com).

**YouTube video δεν φαίνεται?**
→ Check config.ts: channelId σωστό;

---

## **ΤΕΛΟΣ ΦΑΣΗ 1**
Site LIVE σε `oksyderkeis.vercel.app` ✓

Τώρα: eToro/Scramble approvals + Φάση 2 (domain, Plausible, Lumi).

---

**Στείλε μου:**
1. Vercel URL όταν είναι live.
2. Screenshot welcome page.
3. Test email form — στείλε test email, πες μου αν πήρες welcome email από MailerLite.

Μόλις επιβεβαιωθεί → ✓ ΦΑΣΗ 1 DONE.
