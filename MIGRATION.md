# Migrating the kengblog AI Keyboard pages

Input for the later kengblog task. Source: `github.com/EthanKeng/kengblog.com` (kengblog.com). Target: this site, expected at `https://yck2024.github.io/ai-keyboard/` once the repo and Pages are enabled. Do this only after the new site is live and checked.

## Page by page

| kengblog page | What it should become | Notes |
|---|---|---|
| `aikb-privacy.html` | **Keep live at the same URL.** Replace the body with the updated policy (copy of the new `privacy.html` text) and add a link to the new site's privacy page. Do not turn it into a bare redirect. | Google Play Console's privacy-policy field almost certainly points here (check it). Google needs the policy to stay reachable and readable at that exact URL. Once the Play Console URL is changed to the new page and has been live for a while, this can become a redirect stub. Old text mentions Firebase Analytics, a Gemini-only flow and "version 1.0"; all outdated. |
| `aikeyboard.html` (guide, features, what's new, setup) | Redirect stub to the new home page (`index.html`), with `<link rel="canonical">` and a visible "moved" link. | Content is split across the new `index.html` (features), `setup.html` and `usage.html`. v1.4 to v1.6 "what's new" history is dropped on purpose. Deep-link anchors (`#setup`, `#features`) will not map one to one. |
| `app-introduction.html` | Redirect stub to the new home page. | Linked from the "Learn more" button on the kengblog home page; repoint that button first. |
| `groq-api-key.html` | Redirect stub to `groq-api-key.html` on the new site. | Same file name on both sites. The old Groq console screenshots (`asset/groq/*`) are not reused. |
| `gemini-api-key.html` | Redirect stub to `gemini-api-key.html` on the new site. | The zh-TW, zh-CN and ja translations are dropped (new site is English only). |
| `gemini-cost-estimator.html` | Redirect stub to `gemini-cost-estimator.html` on the new site. | Same file name kept. It now also prices Groq and uses the current default models (the old one priced Gemini 2.5). |
| `closed-testing.html` | **Keep** while the app is in Google Play closed testing (it links the tester Google Group and the Play URL). Retire (redirect to the new home page) once the app is public. | The new site has no closed-testing page. If it should, it is a small addition. |
| `asset/playstore/*`, `asset/aikb-palette-preview.png`, `asset/groq/*` | Delete once no kengblog page references them. | `asset/aikb-palette-preview.png` is used by the AI Keyboard project card on `index.html`. Replace it with the new icon or feature graphic first. |
| `index.html` (AI Keyboard project card) | Edit, not delete. | Update the card copy to v2.2 (no longer "Groq Whisper first"), point "Learn more" and the resource links at the new site, keep the Google Play button. Drop "Closed testing" from the resource links when that page is retired. |

## URLs that must keep working

1. `https://kengblog.com/aikb-privacy.html`: keep a real policy page there (see above). Confirm in Play Console and in any store listing which URL is registered.
2. `https://kengblog.com/closed-testing.html`: for as long as testers have been sent that link.
3. `https://play.google.com/store/apps/details?id=com.kengblog.aikeyboard`: not a kengblog URL, but it is the app's package id; keep it in the home page card.

## How to do the stubs

GitHub Pages cannot send HTTP 301s. Use a minimal HTML stub:

```html
<!doctype html>
<meta charset="utf-8">
<title>AI Keyboard has moved</title>
<link rel="canonical" href="https://yck2024.github.io/ai-keyboard/">
<meta http-equiv="refresh" content="0; url=https://yck2024.github.io/ai-keyboard/">
<p>AI Keyboard now lives at <a href="https://yck2024.github.io/ai-keyboard/">yck2024.github.io/ai-keyboard</a>.</p>
```

Keep the Google Analytics snippet from `myGA.html` on stubs if the kengblog style rule is still wanted. The new site uses the shared oai-html Google tag (`G-QLFWNZWDSS`, content group `ai-keyboard`), not the old kengblog tag.

## Open items for the captain

- Confirm the Google Play listing is public before the new site goes live (the Play button currently points at the closed-testing URL).
- Privacy policy: the new text says the app has no analytics or advertising SDK and sends no log data to the developer. That matches the v2.2 build dependencies, but confirm before the Play Console URL is switched.
- Licences: the app's Rime Luna Pinyin and Essay data are LGPL v3. The app's store-asset notes say that screen is still in progress; the site only lists them with upstream links.
