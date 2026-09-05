<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio Architecture and Design

## Sources of truth

Read the [content and motion specification](../portfolio_content_motion_spec.md) before changing the visual direction or building another portfolio section. The [README](README.md) summarizes the current implementation. Visual references live in `../inspo/`.

Follow the user's latest decisions when they revise the spec, and update the spec to preserve agreed changes. Do not restore the original first-pass styles over the approved design.

## Architecture

- This is a Next.js App Router application using TypeScript, React, and Tailwind CSS v4. Check `package.json` for installed versions.
- `app/page.tsx` is the entry point for the portfolio at `/`. Keep it focused on composing the page.
- `app/main/` owns the main portfolio's components and supporting code. Add future portfolio sections here. It is not a separate `/main` route; do not add a `page.tsx` there unless that route is explicitly wanted.
- `app/main/hero.tsx` implements the hero, navigation, project preview dialog, and pointer interactions.
- `app/main/coil-geometry.ts` contains the cached 3D coil geometry and projection functions. Keep geometry calculations separate from React interaction code.
- `app/layout.tsx` owns the shared document shell, metadata, and font loading. `app/globals.css` owns shared tokens and the current portfolio styles. Preserve these tokens when extending the site; scope feature-specific styles so they do not unintentionally affect other routes.
- Blogs and additional features belong in separate route folders, such as a future `app/blog/page.tsx`. Keep their feature-specific code out of `app/main/`. Extract shared components when they are actually reused.
- Prefer Server Components for static composition; use Client Components where browser APIs, effects, or interactive state are needed.

## Design guide summary

The site is one continuous editorial experience: bold, precise, spacious, near-black, and softly rounded. Vary composition and scale across chapters while preserving the visual system. Avoid excessive cards, decorative pills, technology-logo walls, glowing borders, and dashboard styling.

| Token / treatment | Approved value |
| --- | --- |
| Canvas | `#090B0D` |
| Primary text | `#EEEDE7` |
| Supporting text | `#96999F` |
| Blue text accent and CTA background | `#2855D9` (`--blue`) |
| CTA hover | `#3967ED` (`--blue-hover`) |
| CTA text and icons | `#FFFFFF` |
| Keyboard focus ring | `#7C9FFF` (`--focus-ring`) |
| Secondary hover background / text | `#7C9FFF26` / `#B6CCFF` |
| CTA and secondary button corners | `999px` |
| Dialog corners | `24px` |
| Icon button shape | Circular |

Use Inter for the hero, navigation, wordmark, and supporting copy. Small technical metadata may use Geist Mono. Other editorial sections may use serif display text as described in the full spec. Keep hover states visibly responsive and preserve keyboard focus indicators.

### Approved hero

Keep the large Inter headline to exactly three lines:

```text
I’m Daniel.
I build software
that matters.
```

“Daniel.” and “matters.” use the same `#2855D9` as the buttons. Emphasis is upright, not italic. Do not reintroduce the vertical introduction/year label, the line beneath the navigation, or the coil caption.

Fit the desktop hero, navigation, and bottom metadata within the viewport using `100dvh` and responsive sizing. On mobile, do not force viewport height: hide the coil, let the hero grow with content, place bottom metadata after the content, and allow the enlarged headline to wrap naturally. Keep the enlarged desktop coil slightly left of the right edge and constrained by viewport height.

Both “Explore my work” CTAs and “Building” currently open the native Student Management System preview dialog. About, Philosophy, Experience, and Skills remain inactive until their sections exist. Do not invent résumé, contact, or project destinations or present exploratory features as completed work.

### Motion

- Use controlled, cinematic motion without bouncing. Reveal navigation, metadata, the complete headline, supporting copy, and CTAs in sequence. The complete headline uses one 1.8-second subtle opacity fade beginning at 550ms, like the supporting copy; do not stagger it or restore a sharp vertical or masked-rise animation.
- Preserve the gradual navigation-to-rounded-dock transition as the page grows. Use restrained blue section indicators.
- The desktop coil starts on the left and moves continuously through a restrained left-to-right-to-left pass of its actual 3D geometry, with approximately ±24° yaw and a slight lateral shift. Keep its guides stationary and its container free of vertical scroll parallax. Do not render it on mobile.
- The resting pass lasts about 15 seconds. Pointer travel adds capped velocity in the travel direction, then returns to its resting speed with the approved **1000ms exponential damping time constant**. This is smoothing, not a fixed one-second pause before movement.
- Reset pointer tracking on pointer leave or window blur, reset all motion when the tab is hidden, and clean up listeners and scheduled frames.
- Preserve the visible but restrained blue pointer atmosphere, fading after movement stops. Disable pointer motion for touch/coarse pointers and honor reduced-motion preferences, including preference changes during a session.

## Validation

Run `npm run lint` and `npx tsc --noEmit` for code changes. Use `npm run build` for production verification when relevant; `npm run build -- --webpack` is available when the environment prevents Turbopack's worker from opening a port. Google font downloads may require network access. Report any unverified build or browser behavior accurately.

For layout or motion changes, check desktop and mobile sizing, short viewports, keyboard access, and reduced motion when browser verification is available. Documentation-only changes need a diff check, not an application test run.
