# Daniel — Portfolio

## Project structure

- `app/page.tsx` renders the main portfolio at `/`.
- `app/main/` contains the components and supporting code for the main portfolio page, including the hero and coil geometry. Add future portfolio sections here.
- `app/layout.tsx` and `app/globals.css` provide the shared layout, fonts, and styles.

Blogs and other future features should have their own folders and routes, separate from `app/main/`. For example, a future blog could live in `app/blog/` with its own `page.tsx`. Keep `app/main/` focused on the main portfolio page.

## Current portfolio

- Viewport-height hero with Inter typography, a prominent name introduction, rounded blue CTAs and an original SVG wireframe sculpture.
- Staggered entrance, masked headline reveal, subtle scroll parallax, and a gradually contracting navigation bar.
- Pointer atmosphere for fine pointers only; reduced-motion preferences disable motion.
- “Explore my work” and “Building” open a keyboard-accessible native dialog with the student-management project described in the spec.

The About, Philosophy, Experience, and Skills labels are intentionally inactive until those chapters exist. Contact details and a résumé file have not been supplied. The hero currently uses Daniel’s first name and draft supporting copy derived from the specification. Full-page scrolling and section tracking should be completed as the remaining chapters are added.
