# Geethma Dias — Portfolio

A modern, single-page developer portfolio. Built as a **zero-build static site** (plain HTML, CSS and vanilla JavaScript) — no framework, no Node, no build step. It just works.

> Live design language: dark editorial theme, kinetic typography, custom cursor, magnetic buttons, scroll reveals, and a respectful `prefers-reduced-motion` fallback. Fully responsive and accessible.

## Project structure

```
.
├── index.html        # All page content & markup
├── styles.css        # Design system + layout
├── main.js           # Interactions (preloader, cursor, reveals, etc.)
├── favicon.svg       # Site icon
├── robots.txt
├── vercel.json       # Caching + security headers (optional)
└── assets/
    ├── portrait.jpg          # Your photo (hero + social preview)
    └── cv/
        └── geethma-dias-cv.pdf   # Your CV (single file)
```

## Run locally

No tooling needed. Either:

- **Double-click `index.html`** to open it in your browser, or
- Serve it (better, so fonts/paths behave exactly like production):
  - VS Code → install the **Live Server** extension → right-click `index.html` → *Open with Live Server*.

## Deploy — GitHub ➜ Vercel

### 1. Push to GitHub
1. Create a new repository on [github.com](https://github.com/new) (e.g. `portfolio`).
2. Upload these files. Easiest: on the new repo page click **uploading an existing file**, then drag the whole project folder in and commit.
   *(Or, if you use git: `git init`, `git add .`, `git commit -m "Portfolio"`, `git branch -M main`, `git remote add origin <repo-url>`, `git push -u origin main`.)*

### 2. Connect Vercel
1. Go to [vercel.com](https://vercel.com) and sign in **with GitHub**.
2. Click **Add New… ➜ Project** and import your repository.
3. Framework Preset: **Other** (it's a static site).
   - Build Command: *leave empty*
   - Output Directory: *leave empty* (root)
4. Click **Deploy**.

That's it — Vercel gives you a live URL (e.g. `your-name.vercel.app`). Every future push to GitHub redeploys automatically.

> Want a custom domain? In Vercel → Project → **Settings → Domains**, add yours and follow the DNS steps.

## Customising

- **Text / projects:** edit `index.html` directly — each section is clearly commented.
- **Colours / fonts:** change the CSS variables at the top of `styles.css` (`--accent`, `--accent-2`, `--bg`, `--fg`, fonts).

### Updating your photo

Replace **`assets/portrait.jpg`** with your new photo, keeping the **exact same file name** (`portrait.jpg`). Then it shows up everywhere automatically — the hero card *and* the social/link preview image. Nothing else to edit.

Use a photo that fits these specs so it stays crisp and crops nicely:

| Setting | Recommended |
| --- | --- |
| **Orientation** | Portrait (taller than wide) |
| **Aspect ratio** | **4 : 5** is ideal (the hero card is 4:5). 3:4 also works. |
| **Dimensions** | **1080 × 1350 px** (good for retina). Minimum 800 × 1000 px. |
| **Max size** | Keep the long side ≤ 1600 px so the file stays small. |
| **File format** | `.jpg` (named `portrait.jpg`), saved at ~80% quality |
| **File weight** | Aim for **under ~300 KB** (compress at e.g. [squoosh.app](https://squoosh.app)) |
| **Framing** | Head-and-shoulders, face in the **upper-middle**. Leave a little headroom — the card focuses near the top (`object-position: center 22%` in `styles.css`). |

> If you ever use a different file name or extension (e.g. `portrait.png`), update the three `assets/portrait.jpg` references in `index.html` (the hero `<img>`, plus the `og:image` and `twitter:image` meta tags) and `apple-touch-icon`.
>
> To nudge how the photo is cropped without changing the file, tweak `object-position` on `.hero__photo img` in `styles.css` (e.g. `center 30%` to show more below the face).

### Updating your CV

Replace **`assets/cv/geethma-dias-cv.pdf`** with your new CV, keeping the same file name — the "Download CV" button picks it up automatically. (If you rename it, update the link in the About section of `index.html`.)

---

© Geethma Dias · Colombo, Sri Lanka
