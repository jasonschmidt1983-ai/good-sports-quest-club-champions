# Visual Redesign Plan

## Goal
Overhaul the existing Good Sports Quest canvas into an original, polished 16-bit-era top-down community sports club RPG, using Pokémon Emerald and Stardew Valley as broad aesthetic references while preserving navigation, NPC interactions, quest progression, and responsive controls.

## Design
- **Design movement:** Hand-crafted GBA / Game Boy Color-era top-down pixel-art RPG.
- **Core principles:** Crisp pixel edges and dark outlines; grid-snapped field geometry; deterministic texture variation; readable depth; warm light and directional shadows; recognizable silhouettes that keep routes clear.
- **Color philosophy:** Deep forest greens and chalk whites for sports grounds, honey oak and club hues indoors, warm amber radial pools around hospitality and wellbeing areas, and restrained gold for interactive affordances.
- **Layout paradigm:** Keep character/NPC coordinates on the 33×24 orthogonal grid; the single east-edge extension moves the senior fence outward one tile and leaves one walkable grass tile between chalk and rail, with the grandstand north of the touchline.
- **Signature elements:** Boarded timber/carpet flooring, softened grass-to-dirt pixel edges, layered stand and wall shadows, warm window/light pools, and canopy layers that depth-sort with people.
- **Interaction philosophy:** Retain the existing controller/UI behavior; render a speech bubble above available NPCs, animate a pixel exclamation when one is in reach, and keep completion marks legible.
- **Animation:** Two-frame idle breathing, a restrained player step cycle, slow one-to-two-pixel canopy sway, brief dirt-path foot puffs, and a gentle bouncing dialogue indicator; motion stays calm and legible.
- **Typography:** Keep canvas signage short and high-contrast; retain the existing crisp monospace/pixel-like tone for in-world labels and the current HTML UI controls for longer text.
- **Brand essence:** A welcoming sports-club quest that makes good-practice learning feel like exploring a lived-in RPG world; **welcoming, spirited, practical**.
- **Brand voice:** Friendly club-side prompts. Example signoffs: “Your next good call is just around the corner.” “Take a breather in the recovery nook.”
- **Wordmark & logo:** Existing Good Sports identity remains unchanged; the canvas redesign does not introduce a new app logo.
- **Signature brand color:** Deep club emerald, paired with warm timber and chalk white.

## Implementation approach
1. Keep `ClubMapCanvas.tsx` responsible for movement, collision, game state, and HTML controls.
2. Move canvas illustration into a focused renderer module (`src/components/clubhouse-pixel-art.ts`) with tile/texturing helpers, layered room/prop drawing, and sprite routines.
3. Preserve existing NPC coordinates and click-to-walk behavior on a 33×24 tile map; add only one east-edge background tile to move the senior fence outward by one full tile.
4. Preserve the existing source art/data and use deterministic canvas drawing for reusable environment tiles, props, and characters; no external/generated raster sheet is required.
5. Verify changes with TypeScript and production build commands, resolving any verified dependency issue if needed before the final build is declared complete.
6. Keep synthesized one-shot sound effects in the existing Web Audio manager, adding tile footsteps and collision bumps; play one generated original 16-bit-style instrumental loop at a restrained volume after the first user gesture.
7. Use the existing audio toggle to start/stop both music and effects, respecting saved mute preference and browser autoplay restrictions.
8. Set Vite's production base to `/good-sports-quest-club-champions/` in GitHub Actions and use `import.meta.env.BASE_URL` for public audio assets so both app bundles and music load beneath the project Pages URL.
9. Add a GitHub Actions workflow that installs from the frozen Bun lockfile, runs lint and build, then uploads `dist` and deploys it to Pages on pushes to `main` and manual dispatch.
10. Make the GitHub repository public as authorized so it matches the existing Pages setup; publish the site at `https://jasonschmidt1983-ai.github.io/good-sports-quest-club-champions/`.
11. Re-center senior and junior pitch markings on the tile grid, keep a full grass tile between each field boundary and its fence where space permits, move the grandstand above the senior north touchline, and align collision cells with both structures.
12. Replace ad-hoc vegetation coordinates with safe outer-grass placements that exclude both pitches, chalk, paths, and fences; render tree canopies in foot-Y order with actors and apply a slow wind sway.
13. Use a stable tile hash for grass, goalmouth wear, and timber-board variants; make dirt edges pixel-rounded and add stone foundations along the bottom edge of exterior walls.
14. Share a directional soft-shadow treatment across architecture, trees, furniture, stands, and character feet, then layer low-intensity warm radial pools at the bar, wellbeing nook, and new clubhouse windows.
15. Give NPCs a subtle two-frame idle breath, limit player walking animation to real movement, emit a few outdoor-path dust pixels while walking, and soften the nearby-NPC dialogue prompt into a smooth retro bounce.

## Project structure
- `src/components/ClubMapCanvas.tsx`: map interactions, player position, map view and controls.
- `src/components/club-map-geometry.ts`: shared tile dimensions, pitch/fence/path bounds, collisions helpers, and verified safe vegetation placements.
- `src/components/clubhouse-pixel-art.ts`: pure canvas drawing helpers for terrain, architecture, props, pixel sprites and status bubbles.
- `src/utils/audio.ts`: synthesized gameplay/UI effects plus looped background music and shared mute behavior.
- `public/audio/club-grounds-loop.mp3`: original instrumental background loop.
- `.github/workflows/deploy.yml`: frozen-lockfile build and GitHub Pages deployment workflow.
- `src/data/goodSportsQuestions.ts`: existing NPC and question definitions, unchanged by this visual pass.
- `src/types/game.ts`: existing game types, unchanged unless the renderer reveals a necessary type gap.
- `src/App.tsx`: existing application state and quest UI, unchanged.
