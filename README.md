# AI Keyboard site

Static GitHub Pages site for AI Keyboard (Android), written for app version 2.2. Plain HTML, CSS and a little JavaScript, no build step, no web fonts. The only third-party scripts are Google Analytics (tag `G-QLFWNZWDSS`, `content_group: 'ai-keyboard'`) and the shared helper `https://yck2024.github.io/oai-html/assets/analytics.js`, added right after `<head>` on every page, as in the oai-html publish-page skill. The app itself has no analytics; `privacy.html` says so and describes the website's analytics separately. Every link is relative, so it works under a project path such as `https://yck2024.github.io/ai-keyboard/`.

| Page | File |
|---|---|
| Home | `index.html` |
| Set up | `setup.html` |
| How to use | `usage.html` |
| AI providers | `api-keys.html` |
| Groq key guide | `groq-api-key.html` |
| Gemini key guide | `gemini-api-key.html` |
| Cost estimator | `gemini-cost-estimator.html` (logic in `assets/js/estimator.js`, prices at its top) |
| FAQ | `faq.html` |
| Privacy policy | `privacy.html` |
| Open-source licences | `licenses.html`, texts in `licenses/` |

Preview locally with any static server, for example `python3 -m http.server` in this folder.

## Content sources

- Feature copy and the privacy wording come from the app's v2.2 release notes and Google Play listing.
- Colours are the app's Sprout greens (`ui/theme/Sprout.kt`) lifted to a light mint and leaf palette with a butter accent. The site is light only.
- Icon, screenshots (`assets/img/screens/`) and the feature graphic are the approved Play store assets: marketing images only. Two of the screenshots (live dictation and dictation result) are staged renders with invented demo text, as noted in the app's store-asset README.
- `licenses/` is a copy of the notice files that ship inside the app.

## Keeping it current

- Google Play URL: `https://play.google.com/store/apps/details?id=com.kengblog.aikeyboard` (the app's `applicationId`). It appears in the header buttons on the home page and in the footer.
- Provider prices on the estimator and key guides were checked in October 2026. Update `PRICING` in `assets/js/estimator.js` and the figures in the key guides together.
- Social-preview tags (`og:url`, `og:image`) assume the site lives at `https://yck2024.github.io/ai-keyboard/`.
