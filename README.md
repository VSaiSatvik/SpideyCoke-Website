# Crimson Cola — Web-Slinger Edition

A single-page, interactive concept site for a fictional soda brand, "Crimson Cola." A web-slinging mascot hangs from the top navigation and descends down the page as you scroll, trailing an animated web thread behind him.

This is an original mascot and an original brand (not the real Coca-Cola, and not Marvel's Spider-Man) — built to capture that hero-swinging-through-the-city energy without using anyone else's trademarked logo or copyrighted character design.

## Files

```
index.html          the whole page
css/style.css        all styling and animation
js/script.js          scroll-linked mascot + web-thread logic
```

No build step, no dependencies (aside from two Google Fonts loaded via CDN link tags). It's plain HTML/CSS/JS, so it runs as-is in any browser.

## Hosting it on GitHub Pages

1. Create a new repository on GitHub (public, since GitHub Pages on the free tier needs a public repo — or use a private repo if you're on GitHub Pro/Team/Enterprise).
2. Upload these three items to the repository root, keeping the folder structure:
   - `index.html`
   - `css/style.css`
   - `js/script.js`
   - `README.md` (optional, but nice to keep)
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` (or whichever branch you uploaded to) and folder `/ (root)`, then **Save**.
6. GitHub will give you a URL like `https://<your-username>.github.io/<repo-name>/` — it usually takes a minute or two to go live.

### Quick alternative (no git commands needed)

- On your new repo's page, click **Add file → Upload files**.
- Drag in `index.html`, `README.md`, and the `css` and `js` folders (GitHub preserves folder structure on drag-and-drop upload).
- Commit directly to `main`.
- Then follow steps 3–6 above.

## Customizing

- Colors, type, and spacing all live at the top of `css/style.css` under `:root` — change the CSS variables there to reskin the whole site.
- The mascot's descent behavior (how far he drops, when he fades out) is controlled by a few constants near the top of `js/script.js`: `descentDistance`, `maxDrop`, `fadeStart`, `fadeEnd`.
- All copy is placeholder/concept copy — swap it for your own before using this for anything real.
