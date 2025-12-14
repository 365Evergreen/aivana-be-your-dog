# Deployment Notes

This document summarizes recommended hosting and build practices for the app. The project is configured to produce relative asset URLs by using `homepage: "."` in `package.json` so the same build can be served from different base paths.

Key points
- Use relative assets: `PUBLIC_URL` is controlled at build-time. The repo currently uses `homepage: "."` so `npm run build` produces relative URLs (recommended for multi-host portability).
- Environment configuration: provide runtime secrets and IDs at build-time using `REACT_APP_` env vars (e.g., `REACT_APP_MSAL_CLIENT_ID`). Do NOT commit secrets.
- Routing: this is an SPA. Use `HashRouter` or configure your host to rewrite all routes to `index.html` for `BrowserRouter`.

Platforms

- GitHub Pages
  - Option A (recommended for this repo): Use relative assets (homepage `.`) and deploy `build/` to GitHub Pages. You can still use the `gh-pages` deploy script (`npm run deploy`) or upload `build/` to the `gh-pages` branch.
  - Option B (if you want `https://user.github.io/repo/` paths): set `PUBLIC_URL='/repo/'` or `homepage` to `https://<user>.github.io/<repo>/` prior to `npm run build`.

- Netlify
  - Site settings: Build command: `npm run build`, Publish directory: `build`
  - Add a `_redirects` file in `build/` (or at repo root added to publish) to route SPA paths:

    /*    /index.html   200

- Vercel
  - Configure the project to run `npm run build` and serve the `build` folder. Vercel automatically handles SPA rewrites.

- Azure Static Web Apps
  - Configure the app to build with `npm run build` and point the app artifact location to `build`.
  - Use Azure Static Web Apps secrets for keys; set environment variables in the portal or in the GitHub Actions workflow.

- Amazon S3 + CloudFront
  - Upload `build/` to an S3 bucket configured for static website hosting.
  - In CloudFront, set the error response for 403/404 to return `/index.html` with HTTP 200 (to support client-side routing).

- Generic servers (IIS / Nginx / Apache)
  - Configure rewrite rules to route all non-file requests to `index.html`.
  - Example Nginx snippet:

    location / {
      try_files $uri /index.html;
    }

Build & deploy examples

- Local test of production build

```powershell
pnpm build
npx serve -s build -l 5000
# Open http://localhost:5000 and verify scripts and manifest are served.
```

- Build for a specific base path

```powershell
#set PUBLIC_URL to the repo path if deploying under a subpath
$env:PUBLIC_URL='/myrepo/'; npm run build
```

Environment variables & secrets
- Use `REACT_APP_` prefixed variables for CRA to inject at build-time, for example `REACT_APP_MSAL_CLIENT_ID` and `REACT_APP_BOT_ID`.
- For CI/CD use the hosting provider's secret storage (GitHub Actions `secrets`, Netlify environment variables, Azure Static Web Apps secret store).

Service worker & caching
- CRA's default service worker is opt-in. If you enable a service worker, ensure proper cache invalidation and that it does not serve stale `index.html` for updated assets.

Security
- Keep client-side secrets out of the repo. Use server-side APIs for sensitive operations.
- Add CSP / security headers at the host level.

Troubleshooting
- If you see `Unexpected token '<'` for a JS file or `manifest.json: Syntax error` in the browser console, check that the requested asset path maps to an actual file (not index.html). This typically happens when built HTML references absolute paths but the server serves the build folder at a different mount point. Fix by:
  - Rebuilding with `PUBLIC_URL='.'` (already configured), or
  - Serving the build at the same base path referenced in `index.html`.

Notes for this repo
- The repository is currently set to use relative assets (`homepage: '.'`) so one build can be deployed to different hosts without changing asset URLs.
- For GitHub Pages deployment with `gh-pages` you can either set `homepage` to the GitHub Pages URL or keep `homepage: '.'` and ensure you publish `build/` to the `gh-pages` branch.

If you want, I can:
- Add a `_redirects` file to the repo for Netlify/Serve/preview workflows
- Add a small GitHub Actions workflow to build and deploy to Azure Static Web Apps or GitHub Pages using secrets
- Run a final verification of the deployed build after you pick a target

---
Generated on December 14, 2025
