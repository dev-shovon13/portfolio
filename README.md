# Kawser Ahmed Shovon: portfolio

Built with Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, Flip, DrawSVG) and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Editing content
- `src/content/profile.ts`: summary, hero ledger items, experience, toolkit, network, early work, links.
- `src/content/work.ts`: case studies. Set `withheld: true` to list an entry without a page.
- `public/Kawser_Ahmed_Shovon_Resume.pdf`: the downloadable résumé (path set in `profile.resume`).

## Deploy (Cloudflare Pages)
The site is a static export (`output: "export"`): `npm run build` writes plain files to `out/`.

In Cloudflare Pages, under Settings → Build:
- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION` = `22`. Optionally set `NEXT_PUBLIC_SITE_URL` if you use a custom domain; it defaults to `https://kawser-ahmed-shovon.pages.dev`.

`public/_headers` serves the extension-less OG image and Apple icon as PNG.

Design rules live in `DESIGN.md`. Product context lives in `PRODUCT.md`.
