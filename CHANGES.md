# Gulzameen fixes: what changed

Search any file for `CHANGED:` / `NEW:` comments to jump to the edits. Full line-by-line view: `changes.diff`.

## 1. Lighthouse
| File | Change |
|---|---|
| `app/page.tsx` | Sections below the hero load lazily (`next/dynamic`), cutting first-load JS (Total Blocking Time, unused JS) |
| `components/AnalyticsSection.tsx`, `GamesSection.tsx`, `RegionExplorer.tsx` | Progress bars use `scaleX` instead of animating `width` (fixes "non-composited animations") |
| `app/api/media/[id]/route.js` | Images are served with a 1-year cache header (they used a 5-minute signed link that browsers couldn't cache). Audio/video still redirect |
| `public/images/*.jpg` | 980 KB each -> about 120 KB each (1000 px wide) |
| `RegionExplorer.tsx`, `ContributionHub.tsx` | Card images: `loading="lazy"`, `decoding="async"`, width/height |
| `package.json` | `browserslist` added to drop 14 KiB of legacy polyfills |
| 11 component files + `globals.css` | Low-contrast colours darkened (`#C05A3E`/`#C2593F` -> `#A8452C`, `#8C6D37` -> `#6B521F`) |
| `FeedbackSection.tsx`, `RegionExplorer.tsx` | `aria-label` on icon-only buttons (star rating, bookmark, report, remove, listen) |

## 2. Offline mode
- NEW `public/sw.js`: service worker caching pages, built assets, images and data
- NEW `components/OfflineSupport.tsx` + `app/layout.tsx`: registers it and shows a small "offline" note
- `public/_headers`: `/sw.js` is never cached

## 3. Recent Contributions
- `ContributionHub.tsx`: real status badge (Pending Review / Approved / Removed) instead of hardcoded "Verified"; delete button and delete popup removed; list scrolls horizontally
- `app/page.tsx`: saves the server id of each submission and refreshes its status
- NEW `app/api/contribution-status/route.js`: returns only id + status for ids the visitor sends
- `lib/types.ts`: `Contribution` gets `serverId` and `status`

## 4. Read Detail opens a page
- `RegionExplorer.tsx`: button is now a link to `/heritage/<id>`
- NEW `app/heritage/[id]/page.tsx`, `components/HeritageDetailActions.tsx`, `lib/heritage.ts`

## 5. Game timers: `GamesSection.tsx`, `GAME_SECONDS = 120` (quiz and word scramble)

## 6. Feedback email: `app/api/submit/route.js` sends via Resend after saving to Supabase

## 7. Success message
- `app/page.tsx`: both `alert()` popups removed on success
- `ContributionHub.tsx`: one card, "Thank You! Your contribution was sent and will appear on the site after review."; shown only if the upload succeeded; errors show inside the form; button says "Submit for Review"

## Do these yourself
1. Resend: create a free account, then `` and `npx wrangler secret put FEEDBACK_TO_EMAIL` (your email). Add the same two to `.dev.vars` for local testing. Until you own a domain, Resend only delivers to the email you signed up with.
2. `npm run build`, fix anything it reports, then `npm run deploy`.
3. Test offline on the deployed site: load it once online, then DevTools -> Application -> Service Workers -> Offline.
4. Old submissions in your browser (before this fix) have no server id; they are matched to approved items by title + name, otherwise shown as Pending Review.
