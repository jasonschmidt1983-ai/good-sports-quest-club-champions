# Visual Redesign Plan

## Goal
Redesign the existing Good Sports Quest map as an original 16-bit-era, 2.5D top-down community sports club RPG, using the supplied Pokémon FireRed/LeafGreen and Ruby/Sapphire references as genre/style guidance while preserving the current navigation, NPC interactions, quest progression, and responsive controls.

## Design
- **Design movement:** Hand-crafted GBA / Game Boy Color-era top-down pixel-art RPG.
- **Core principles:** Crisp pixel edges and dark outlines; layered, readable depth; warm clubhouse interiors contrasted with lively green sports grounds; recognizable prop silhouettes that do not obscure characters or routes.
- **Color philosophy:** Deep forest greens and clean chalk whites for the fields, honey oak and team-club hues indoors, warm amber accents for lighting, and restrained gold for interactive affordances.
- **Layout paradigm:** Keep the existing tile coordinates and orthogonal navigation grid; give objects a south-facing vertical plane and cast shadow to suggest height without changing collision or map dimensions.
- **Signature elements:** Boarded timber/carpet flooring, chunky outlined counters and room dividers, and 16×24 chibi sprites with oval foot shadows.
- **Interaction philosophy:** Retain the existing controller/UI behavior; render a speech bubble above available NPCs, animate a pixel exclamation when one is in reach, and keep completion marks legible.
- **Animation:** Subtle one- or two-pixel idle bob for NPC markers and restrained player step motion; no continuous large motion.
- **Typography:** Keep canvas signage short and high-contrast; retain the existing crisp monospace/pixel-like tone for in-world labels and the current HTML UI controls for longer text.
- **Brand essence:** A welcoming sports-club quest that makes good-practice learning feel like exploring a lived-in RPG world; **welcoming, spirited, practical**.
- **Brand voice:** Friendly club-side prompts. Example signoffs: “Your next good call is just around the corner.” “Take a breather in the recovery nook.”
- **Wordmark & logo:** Existing Good Sports identity remains unchanged; the canvas redesign does not introduce a new app logo.
- **Signature brand color:** Deep club emerald, paired with warm timber and chalk white.

## Implementation approach
1. Keep `ClubMapCanvas.tsx` responsible for movement, collision, game state, and HTML controls.
2. Move canvas illustration into a focused renderer module (`src/components/clubhouse-pixel-art.ts`) with tile/texturing helpers, layered room/prop drawing, and sprite routines.
3. Continue using the existing 32×24 tile map and map coordinates so quest NPC positions and click-to-walk behavior remain compatible.
4. Preserve the existing source art/data and use deterministic canvas drawing for reusable environment tiles, props, and characters; no external/generated raster sheet is required.
5. Verify changes with TypeScript and production build commands, resolving any verified dependency issue if needed before the final build is declared complete.
6. Keep synthesized one-shot sound effects in the existing Web Audio manager, adding tile footsteps and collision bumps; play one generated original 16-bit-style instrumental loop at a restrained volume after the first user gesture.
7. Use the existing audio toggle to start/stop both music and effects, respecting saved mute preference and browser autoplay restrictions.

## Project structure
- `src/components/ClubMapCanvas.tsx`: map interactions, player position, map view and controls.
- `src/components/clubhouse-pixel-art.ts`: pure canvas drawing helpers for terrain, architecture, props, pixel sprites and status bubbles.
- `src/utils/audio.ts`: synthesized gameplay/UI effects plus looped background music and shared mute behavior.
- `public/audio/club-grounds-loop.mp3`: original instrumental background loop.
- `src/data/goodSportsQuestions.ts`: existing NPC and question definitions, unchanged by this visual pass.
- `src/types/game.ts`: existing game types, unchanged unless the renderer reveals a necessary type gap.
- `src/App.tsx`: existing application state and quest UI, unchanged.
