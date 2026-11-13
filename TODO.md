# Redesign outcomes

## 1. 2.5D overhead perspective and layered architecture — complete
- Replace flat colour blocks with a 3/4 top-down angled perspective.
- Give all interior walls, counters, and desks visible front-facing vertical faces with baseboards, wall trim, and cast drop-shadows onto the floor to create clear height and depth.
- Add thick, layered borders around rooms, doorways, and fencing around the outdoor playing fields.

## 2. Pixel-art tileset and environmental textures — complete
- Use a cohesive, vibrant 16-bit pixel-art palette with crisp 1px dark outlines on all interactive objects and furniture.
- Replace the plain checkered floor with detailed wooden floorboards or patterned clubhouse carpet tiles, adding subtle dithering and wear textures.
- Upgrade the outdoor grass from flat green to textured turf tiles with tufts of grass, white chalk field lines, dirt footpaths with rounded edges, and perimeter trees or bushes.

## 3. Community-club environmental props — complete
- Populate the empty spaces to make it feel like a lived-in community sports club.
- Club Bar & RSA Desk: Add stools, a cash register, glass cabinets, framed team photos, and coasters.
- Committee Desk: Add stacks of folders, a desktop monitor, a trophy cabinet, and a whiteboard.
- Wellbeing Nook: Add potted plants, comfortable armchairs, a bookshelf, and warm floor lamps.
- Change Rooms: Add rows of metal lockers, wooden benches, and gym bags.

## 4. RPG character sprites and NPC markers — complete
- Redesign the player and NPCs into classic 16x24 or 16x32 pixel chibi RPG sprites with distinct hair, club uniforms, dark outlines, and oval ground shadows underneath their feet.
- Replace the floating yellow '?' icons with classic pixel-art speech bubbles or subtle animated exclamation marks above NPCs when the player approaches.
- Preserve the existing walk controls, collision, NPC coordinates, quest completion status, and conversation actions while changing presentation.

## 5. Retro audio and game sound effects — complete
- Add audio sound effects and 16-bit retro background music to match the Pokémon aesthetic.
- Play a short footstep sound on successful tile movement and a distinct collision blip on a blocked tile.
- Start the music after the first permitted user gesture, loop it continuously, and make the existing audio toggle control both music and sound effects.

## 6. GitHub Pages browser preview — complete
- Set up GitHub Pages to deploy a live browser preview of the game.
- Make the repository public and publish the Pages site at `https://jasonschmidt1983-ai.github.io/good-sports-quest-club-champions/` as authorized.

## 7. Outdoor map alignment — complete
- Senior Oval & Grandstand (Right Side): Move the wooden grandstand/bleachers completely off the playing surface so they sit neatly along the outer north or east perimeter behind the white touchline. Align the white pitch boundary lines, halfway line, and centre circle cleanly inside the lighter green turf area, leaving a 1-tile grass buffer before the perimeter fence. Shift the right-side perimeter fence outward by 1–2 tiles so it never overlaps the goal box.
- Junior Field (Bottom-Left): Recalculate the X-offset of the Junior Field's white pitch markings (perimeter lines, centre circle, halfway line, and penalty boxes) using the exact tile grid coordinates so they sit centred horizontally inside the fenced turf area instead of spilling over the left fence.
- Tree Placement & Layering: Restrict tree spawning strictly to unoccupied outer background grass tiles. Exclude all playing field turf, white line coordinates, dirt pathways, and perimeter fence tiles so trees never overlap fences or fields. Render tree canopies on an overhead/Y-sorted layer so characters walk cleanly behind them.

## 8. Dynamic lighting and shadows — complete
- Add an ambient lighting overlay layer. Give the Club Bar, Wellbeing Room, and clubhouse windows soft, warm radial light pools (globalCompositeOperation = 'lighter' or warm alpha gradients).
- Cast consistent, soft directional drop-shadows (rgba(15, 23, 42, 0.28)) offset to the bottom-right under all walls, trees, grandstands, furniture, and characters.

## 9. Tile variation and auto-tiled borders — complete
- Replace uniform grass and wood tiles with seeded procedural variants (adding subtle grass blades, clover, worn turf in the goalmouths, and varied wood plank shading).
- Add rounded pixel-art transition edges where dirt paths meet grass, and render stone foundations/baseboards along the bottom edge of all exterior clubhouse walls.

## 10. Character polish and micro-animations — complete
- Upgrade character sprites with higher-contrast 16-bit shading, distinct hair and club uniform details, and a smooth 2-frame idle breathing animation so NPCs gently bob when standing still.
- Add a slow, gentle wind-sway offset to tree canopies and bushes.
- Spawn subtle pixel dust puffs behind the player's feet when walking on outdoor dirt pathways, and display a smooth bouncing pixel indicator with a clean retro RPG dialogue prompt when approaching NPCs.
