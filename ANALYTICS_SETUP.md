# Oksyderkeis Landing Analytics Setup

Status: deployed live, weekly cron configured.

## What Is Already Implemented

- Vercel Web Analytics script is loaded in `src/layouts/Base.astro`.
- Vercel custom events are sent through `@vercel/analytics` with compact `{ cta, page }` data. Note: Vercel custom events may require Pro/Enterprise/Web Analytics Plus depending the account plan.
- Plausible is supported through `ANALYTICS.plausibleDomain` in `src/config.ts`.
- GA4 is supported through `ANALYTICS.ga4Id` in `src/config.ts`.
- CTA/event tracking is implemented in `src/components/AnalyticsTracker.astro`.

Tracked events:

- `CTA Click`: every link/button with `data-cta`, plus links/buttons generally.
- `Email Signup Attempt`: MailerLite form submit attempts.
- `Form Submit`: other forms.

Event props:

- `cta`
- `text`
- `href`
- `outbound`
- `page`
- `url`
- stored UTM fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `first_referrer`

## Recommended First Setup

1. Keep Vercel Web Analytics enabled for pageviews.
2. Add Plausible if David wants a cleaner simple dashboard:
   - Create site in Plausible.
   - Set `ANALYTICS.plausibleDomain = "oksyderkeis.vercel.app"` in `src/config.ts`.
3. Add GA4 only if we need Google Ads/search-style reporting later.

## UTM Templates

Use one unique link per platform/post.

Threads:

```text
https://oksyderkeis.vercel.app/?utm_source=threads&utm_medium=social&utm_campaign=money_os_july&utm_content=post_YYYY_MM_DD
```

Telegram:

```text
https://oksyderkeis.vercel.app/?utm_source=telegram&utm_medium=community&utm_campaign=money_os_july&utm_content=post_YYYY_MM_DD
```

YouTube Community:

```text
https://oksyderkeis.vercel.app/?utm_source=youtube_community&utm_medium=social&utm_campaign=money_os_july&utm_content=post_YYYY_MM_DD
```

LinkedIn:

```text
https://oksyderkeis.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=money_os_july&utm_content=post_YYYY_MM_DD
```

## Weekly Report

OpenClaw cron:

- Standalone job `Oksyderkeis landing weekly analytics report` (`8d6bb005-c502-4eef-9349-e304caaa9e79`) is disabled, so David does not get a separate 09:00 report.
- The analytics layer is folded into the daily morning/product brief job (`david-daily-morning-work-brief-0800`) every Monday.
- Output: one combined Telegram brief plus saved markdown under `out/oksyderkeis/analytics/weekly/`.

Important: Vercel API check on 2026-06-30 returned `Web Analytics is not enabled for this project`. The tracking code is live, but the Vercel dashboard toggle may still need to be enabled before API reports return data.

Track:

- Visits by source/platform.
- CTA clicks by `data-cta`.
- Email signup attempts.
- Money OS checkout clicks.
- AI Follow-Up checkout clicks.
- Affiliate clicks.
- Top post by visits and CTA click rate.

## Decision Rule

Do not judge a post only by likes. Judge by:

```text
platform post -> landing visit -> CTA click -> email/signup/buy intent
```

If a post has low likes but high landing clicks, it is still useful.
If a post has likes but no clicks, rewrite CTA or positioning.
