import { NPC, PlayerPosition } from '../types/game';
import { NPCS } from '../data/goodSportsQuestions';
import {
  BUSH_PLACEMENTS,
  DIRT_PATHS,
  isOnDirtPath,
  GRANDSTAND,
  JUNIOR_FENCE,
  JUNIOR_PITCH,
  JUNIOR_TURF,
  MAP_HEIGHT,
  MAP_WIDTH,
  SENIOR_FENCE,
  SENIOR_PITCH,
  SENIOR_TURF,
  TILE_SIZE,
  TREE_PLACEMENTS,
} from './club-map-geometry';

const TILE = TILE_SIZE;
const W = MAP_WIDTH;
const H = MAP_HEIGHT;
const SHADOW_COLOR = 'rgba(15, 23, 42, 0.28)';

type CompletionMap = Record<string, { total: number; completed: number }>;

const C = {
  ink: '#202a32',
  inkSoft: '#35434a',
  grass: '#397f4b',
  grassLight: '#4c9652',
  grassDark: '#28633d',
  grassDeep: '#1d5235',
  chalk: '#f4eed3',
  dirt: '#b77942',
  dirtLight: '#d49a59',
  dirtDark: '#875332',
  timber: '#a86c3d',
  timberLight: '#d49a5c',
  timberDark: '#704229',
  wall: '#ddc99c',
  wallLight: '#f2dfb4',
  wallDark: '#9f7954',
  emerald: '#176847',
  gold: '#f4c45c',
  stone: '#727c7c',
  stoneLight: '#a5aaa0',
  stoneDark: '#465257',
};

const rect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

function tileHash(col: number, row: number, salt = 0): number {
  let value = Math.imul(col + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(row + 0x7f4a7c15, 0xc2b2ae35) ^ salt;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
}

function drawDropShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, blur = 7) {
  ctx.save();
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 5;
  rect(ctx, x, y, w, h, SHADOW_COLOR);
  ctx.restore();
}

function drawFootShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.save();
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const stroke = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, line = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = line;
  ctx.strokeRect(Math.round(x) + line / 2, Math.round(y) + line / 2, Math.round(w) - line, Math.round(h) - line);
};

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#fff4d6', size = 10) {
  ctx.font = `bold ${size}px monospace`;
  ctx.textAlign = 'center';
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#26333a';
  ctx.strokeText(text, Math.round(x), Math.round(y));
  ctx.fillStyle = color;
  ctx.fillText(text, Math.round(x), Math.round(y));
  ctx.textAlign = 'start';
}

function drawGrass(ctx: CanvasRenderingContext2D) {
  rect(ctx, 0, 0, W, H, C.grass);
  for (let row = 0; row < H / TILE; row++) {
    for (let col = 0; col < W / TILE; col++) {
      const x = col * TILE;
      const y = row * TILE;
      const seed = tileHash(col, row);
      const variation = seed % 13;
      const base = variation < 2 ? C.grassLight : variation > 10 ? C.grassDark : C.grass;
      rect(ctx, x, y, TILE, TILE, base);
      // Stable per-tile blades and clover keep the turf varied without visual noise.
      for (let i = 0; i < 3; i++) {
        const detail = tileHash(col, row, i + 31);
        const gx = x + 4 + (detail % 27);
        const gy = y + 4 + ((detail >>> 7) % 27);
        rect(ctx, gx, gy, 2, 3, i === 1 ? C.grassLight : C.grassDeep);
        rect(ctx, gx + 2, gy + 2, 2, 1, C.grassLight);
      }
      if (variation === 3 || variation === 8) {
        const cx = x + 8 + (seed % 16);
        const cy = y + 9 + ((seed >>> 8) % 14);
        rect(ctx, cx, cy, 3, 2, '#b5c66a');
        rect(ctx, cx + 3, cy + 2, 2, 2, '#a5ba60');
        rect(ctx, cx - 2, cy + 2, 2, 2, '#93af59');
      }
      if (variation === 5) {
        rect(ctx, x + 10 + (seed % 10), y + 22, 2, 5, C.grassLight);
        rect(ctx, x + 14 + (seed % 8), y + 20, 2, 7, C.grassDeep);
      }
    }
  }
}

function drawDirtPath(ctx: CanvasRenderingContext2D) {
  // Stacked stair-step rectangles create rounded pixel edges against the grass.
  DIRT_PATHS.forEach(({ x, y, w, h }, pathIndex) => {
    rect(ctx, x + 6, y, w - 12, 4, C.dirtDark);
    rect(ctx, x + 3, y + 3, w - 6, h - 6, C.dirtDark);
    rect(ctx, x, y + 6, w, h - 12, C.dirtDark);
    rect(ctx, x + 2, y + 4, w - 4, h - 8, C.dirt);
    rect(ctx, x + 6, y + 5, w - 12, h - 10, C.dirtLight);
    const columns = Math.floor(w / 29);
    for (let i = 0; i < columns; i++) {
      const seed = tileHash(i, pathIndex, 211);
      const gx = x + 8 + i * 29;
      const gy = y + 10 + (seed % Math.max(1, Math.floor((h - 16) / 2))) * 2;
      rect(ctx, gx, gy, 4, 2, seed % 2 ? '#e1b475' : '#9d693f');
      if (seed % 3 === 0) rect(ctx, gx + 5, gy + 2, 2, 2, '#c68a50');
    }
  });
}

function drawPitch(ctx: CanvasRenderingContext2D) {
  // The lighter senior turf is a grid-aligned 12×12-tile pad; the chalk field is inset one tile.
  rect(ctx, SENIOR_TURF.x, SENIOR_TURF.y, SENIOR_TURF.w, SENIOR_TURF.h, '#397e47');
  for (let row = 0; row < SENIOR_TURF.h / TILE; row += 2) {
    const stripe = row % 4 === 0 ? '#43894c' : '#3e8448';
    rect(ctx, SENIOR_TURF.x, SENIOR_TURF.y + row * TILE, SENIOR_TURF.w, TILE, stripe);
  }
  // The junior training turf is likewise centered under its inset, 6×3-tile markings.
  rect(ctx, JUNIOR_TURF.x, JUNIOR_TURF.y, JUNIOR_TURF.w, JUNIOR_TURF.h, '#397e47');
  for (let row = 0; row < JUNIOR_TURF.h / TILE; row += 2) {
    rect(ctx, JUNIOR_TURF.x, JUNIOR_TURF.y + row * TILE, JUNIOR_TURF.w, TILE, row % 4 === 0 ? '#43894c' : '#3e8448');
  }

  // Seeded, worn goalmouth patches stay beneath the clean chalk geometry.
  [SENIOR_PITCH.x + TILE, SENIOR_PITCH.right - 3 * TILE].forEach((wearX, side) => {
    rect(ctx, wearX, SENIOR_PITCH.centerY - 2 * TILE, 2 * TILE, 4 * TILE, '#3a7844');
    for (let i = 0; i < 18; i++) {
      const seed = tileHash(i + side * 23, 8, 701);
      const px = wearX + 4 + (seed % (2 * TILE - 8));
      const py = SENIOR_PITCH.centerY - 2 * TILE + 5 + ((seed >>> 8) % (4 * TILE - 10));
      rect(ctx, px, py, 2 + (seed % 3), 2, seed % 4 === 0 ? '#936b43' : '#326d3e');
    }
  });

  ctx.strokeStyle = C.chalk;
  ctx.lineWidth = 3;
  ctx.strokeRect(SENIOR_PITCH.x, SENIOR_PITCH.y, SENIOR_PITCH.w, SENIOR_PITCH.h);
  ctx.beginPath();
  ctx.moveTo(SENIOR_PITCH.centerX, SENIOR_PITCH.y);
  ctx.lineTo(SENIOR_PITCH.centerX, SENIOR_PITCH.y + SENIOR_PITCH.h);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(SENIOR_PITCH.centerX, SENIOR_PITCH.centerY, TILE, 0, Math.PI * 2);
  ctx.stroke();
  // Matching penalty boxes on each end; the goalmouth and posts remain inside the turf buffer.
  ctx.lineWidth = 2;
  ctx.strokeRect(SENIOR_PITCH.x, SENIOR_PITCH.centerY - 2 * TILE, 2 * TILE, 4 * TILE);
  ctx.strokeRect(SENIOR_PITCH.right - 2 * TILE, SENIOR_PITCH.centerY - 2 * TILE, 2 * TILE, 4 * TILE);
  ctx.strokeRect(SENIOR_PITCH.right - 3 * TILE, SENIOR_PITCH.centerY - TILE, 3 * TILE, 2 * TILE);
  const postX = SENIOR_PITCH.right - TILE + 11;
  rect(ctx, postX, SENIOR_PITCH.centerY - 2 * TILE, 4, 4 * TILE, C.chalk);
  rect(ctx, postX + 11, SENIOR_PITCH.centerY - 2 * TILE, 4, 4 * TILE, C.chalk);
  rect(ctx, postX + 4, SENIOR_PITCH.centerY - 2, 7, 4, '#e1a552');

  ctx.strokeStyle = '#e9eed1';
  ctx.lineWidth = 2;
  ctx.strokeRect(JUNIOR_PITCH.x, JUNIOR_PITCH.y, JUNIOR_PITCH.w, JUNIOR_PITCH.h);
  ctx.beginPath();
  ctx.moveTo(JUNIOR_PITCH.centerX, JUNIOR_PITCH.y);
  ctx.lineTo(JUNIOR_PITCH.centerX, JUNIOR_PITCH.y + JUNIOR_PITCH.h);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(JUNIOR_PITCH.centerX, JUNIOR_PITCH.centerY, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(JUNIOR_PITCH.x, JUNIOR_PITCH.centerY - TILE, TILE, 2 * TILE);
  ctx.strokeRect(JUNIOR_PITCH.right - TILE, JUNIOR_PITCH.centerY - TILE, TILE, 2 * TILE);
  rect(ctx, JUNIOR_PITCH.x + 6, JUNIOR_PITCH.centerY - 2, 14, 4, C.chalk);
  rect(ctx, JUNIOR_PITCH.x + 20, JUNIOR_PITCH.centerY - 2, 4, 4, C.chalk);

  // Layered senior perimeter rails leave a grass buffer beyond the east goal box.
  const fx = SENIOR_FENCE.leftX;
  const fenceSegments = [
    [SENIOR_FENCE.topY, SENIOR_FENCE.gateTopY - SENIOR_FENCE.topY],
    [SENIOR_FENCE.gateBottomY, SENIOR_FENCE.bottomY - SENIOR_FENCE.gateBottomY],
  ];
  fenceSegments.forEach(([y, height]) => {
    drawDropShadow(ctx, fx - 3, y, 12, height, 3);
    rect(ctx, fx, y, 5, height, '#553f30');
    rect(ctx, fx - 3, y, 9, height, '#d7b16d');
    rect(ctx, fx - 3, y, 9, 5, '#f1d398');
    for (let railY = y + 8; railY < y + height; railY += 22) rect(ctx, fx - 5, railY, 13, 4, '#f4dda7');
  });
  // Hinged open west gate aligns with the walkable two-row gap.
  rect(ctx, fx - 6, SENIOR_FENCE.gateTopY + 4, 13, 4, '#805936');
  rect(ctx, fx - 6, SENIOR_FENCE.gateTopY + 4, 3, 36, '#d3ad6d');
  rect(ctx, fx - 3, SENIOR_FENCE.gateTopY + 7, 3, 26, '#efd49a');
  rect(ctx, fx - 8, SENIOR_FENCE.gateTopY + 4, 4, 4, '#f6e0a5');
  // East rail sits one tile beyond the lighter turf and clear of the goal area.
  drawDropShadow(ctx, SENIOR_FENCE.rightX - 5, SENIOR_FENCE.topY, 14, SENIOR_FENCE.bottomY - SENIOR_FENCE.topY, 3);
  rect(ctx, SENIOR_FENCE.rightX, SENIOR_FENCE.topY, 5, SENIOR_FENCE.bottomY - SENIOR_FENCE.topY, '#67482d');
  rect(ctx, SENIOR_FENCE.rightX - 4, SENIOR_FENCE.topY, 10, 4, '#e0bd7d');
  rect(ctx, SENIOR_FENCE.rightX - 4, SENIOR_FENCE.bottomY - 4, 10, 4, '#e0bd7d');
  for (let y = SENIOR_FENCE.topY + 15; y < SENIOR_FENCE.bottomY; y += 25) rect(ctx, SENIOR_FENCE.rightX - 4, y, 10, 3, '#f0d49a');

  label(ctx, 'SENIOR OVAL', SENIOR_PITCH.centerX, SENIOR_PITCH.bottom - 8, '#f7efd5', 11);
  label(ctx, 'JUNIOR FIELD', JUNIOR_PITCH.centerX, JUNIOR_PITCH.y - 6, '#f7efd5', 10);
}

function drawJuniorFence(ctx: CanvasRenderingContext2D) {
  const left = JUNIOR_FENCE.leftX;
  const right = JUNIOR_FENCE.rightX;
  const top = JUNIOR_FENCE.topY;
  const bottom = JUNIOR_FENCE.bottomY;
  const rail = (x: number, y: number, w: number, h: number) => {
    drawDropShadow(ctx, x, y, w, h, 4);
    rect(ctx, x, y, w, h - 2, '#c99a5b');
    rect(ctx, x, y, w, 3, '#f0d39a');
  };
  const gateStart = 5 * TILE;
  const gateEnd = 7 * TILE;
  rail(left, top, gateStart - left, 7);
  rail(gateEnd, top, right - gateEnd + 8, 7);
  rail(left, bottom, right - left + 8, 7);
  // Far sideline with heavy square posts.
  rail(right, top, 7, bottom - top + 7);
  for (let y = top + 15; y < bottom; y += 26) rect(ctx, right - 2, y, 10, 4, '#f1d69e');
  // Continuous west rail; the walk-through gate sits on the accessible north edge.
  rail(left, top, 7, bottom - top + 7);
  rect(ctx, gateStart - 4, top - 3, 5, 12, '#d6ae6f');
  rect(ctx, gateEnd - 1, top - 3, 5, 12, '#d6ae6f');
  rect(ctx, gateStart + 3, top + 1, 3, 5, '#f0d39a');
  rect(ctx, left - 2, top, 11, 6, '#f0d39a');
  rect(ctx, left - 2, bottom, 11, 6, '#f0d39a');
  for (let x = left + 31; x < right; x += 36) {
    if (x >= gateStart - 6 && x < gateEnd + 6) continue;
    rect(ctx, x, top - 3, 6, 12, '#d6ae6f');
    rect(ctx, x, bottom - 3, 6, 12, '#d6ae6f');
  }
}

function drawTree(ctx: CanvasRenderingContext2D, placement: (typeof TREE_PLACEMENTS)[number], time: number) {
  const { x, y, scale: s, phase } = placement;
  const sway = Math.round(Math.sin(time * 0.65 + phase) * 1.5);
  drawFootShadow(ctx, x + 18 * s, y + 40 * s, 15 * s, 4 * s);
  // Trunk stays planted while the leafy crown shifts by a pixel or two in the breeze.
  rect(ctx, x + 11 * s, y + 23 * s, 13 * s, 19 * s, '#70492f');
  rect(ctx, x + 7 * s, y + 19 * s, 22 * s, 7 * s, '#523a2c');
  rect(ctx, x + 14 * s, y + 26 * s, 3 * s, 13 * s, '#91613d');
  rect(ctx, x + (2 + sway) * s, y + 11 * s, 32 * s, 15 * s, '#1b573a');
  rect(ctx, x + (6 + sway) * s, y + 5 * s, 25 * s, 15 * s, '#287346');
  rect(ctx, x + (11 + sway) * s, y, 15 * s, 14 * s, '#3e8c4d');
  rect(ctx, x + (9 + sway) * s, y + 7 * s, 7 * s, 3 * s, '#72a653');
  rect(ctx, x + (20 + sway) * s, y + 14 * s, 7 * s, 3 * s, '#6da14e');
  rect(ctx, x + (8 + sway) * s, y + 19 * s, 5 * s, 3 * s, '#73a650');
  stroke(ctx, x + (2 + sway) * s, y, 32 * s, 26 * s, '#173e2c', Math.max(1, s));
}

function drawBush(ctx: CanvasRenderingContext2D, placement: (typeof BUSH_PLACEMENTS)[number], time: number) {
  const { x, y, phase } = placement;
  const sway = Math.round(Math.sin(time * 0.72 + phase) * 1.2);
  drawFootShadow(ctx, x + 12, y + 18, 11, 3);
  rect(ctx, x + 4, y + 12, 16, 7, '#1e5d3b');
  rect(ctx, x + 2 + sway, y + 7, 19, 10, '#347d46');
  rect(ctx, x + 6 + sway, y + 3, 13, 11, '#4a934d');
  rect(ctx, x + 10 + sway, y + 5, 6, 3, '#82aa5c');
  rect(ctx, x + 4 + sway, y + 11, 5, 3, '#72a653');
  stroke(ctx, x + 2 + sway, y + 3, 19, 14, '#183e2e', 2);
}

function drawInteriorFloor(ctx: CanvasRenderingContext2D) {
  rect(ctx, 2 * TILE, 2 * TILE, 17 * TILE, 13 * TILE, '#a66c40');
  // Offset rows of oak boards, fine seams, and a few worn warm pixels.
  for (let y = 2 * TILE; y < 15 * TILE; y += 18) {
    const row = Math.floor(y / 18);
    const offset = row % 2 ? 18 : 0;
    for (let x = 2 * TILE - 36; x < 19 * TILE; x += 36) {
      const bx = x + offset;
      const seed = tileHash(Math.floor(bx / TILE), row, 37);
      const plank = seed % 5 === 0 ? '#b77b48' : seed % 4 === 0 ? '#a86b3d' : '#ad7142';
      rect(ctx, bx, y, 35, 17, plank);
      rect(ctx, bx, y + 16, 35, 2, '#805133');
      rect(ctx, bx + 2, y + 2, 18, 1, '#d1975c');
      if (seed % 5 === 0) rect(ctx, bx + 25, y + 10, 5, 2, '#94613b');
    }
  }
  // Boardroom carpet: woven navy/teal pattern, carefully inside the raised walls.
  rect(ctx, 2 * TILE, 2 * TILE, 9 * TILE, 4 * TILE, '#334c68');
  for (let y = 2 * TILE + 2; y < 6 * TILE; y += 12) {
    for (let x = 2 * TILE + 2; x < 11 * TILE; x += 12) {
      rect(ctx, x, y, 10, 10, tileHash(Math.floor(x / 12), Math.floor(y / 12), 53) % 2 ? '#3a5870' : '#30445c');
      rect(ctx, x + 3, y + 3, 2, 2, '#668072');
    }
  }
  // Bar and foyer use patterned tiles over the timber base.
  rect(ctx, 7 * TILE, 8 * TILE, 10 * TILE, 6 * TILE, '#8c593c');
  for (let y = 8 * TILE; y < 14 * TILE; y += 18) {
    for (let x = 7 * TILE; x < 17 * TILE; x += 18) {
      rect(ctx, x, y, 17, 17, tileHash(Math.floor(x / 18), Math.floor(y / 18), 79) % 2 ? '#986247' : '#87543d');
      rect(ctx, x + 2, y + 2, 1, 1, '#c18759');
    }
  }
  // Team-green welcome rug with a gold pixel border.
  rect(ctx, 9 * TILE + 4, 13 * TILE + 2, 4 * TILE - 8, TILE + 5, '#17583f');
  stroke(ctx, 9 * TILE + 8, 13 * TILE + 6, 4 * TILE - 16, TILE - 2, '#e2b858', 2);
  label(ctx, 'GOOD SPORTS', 11 * TILE, 14 * TILE + 3, '#f3d77c', 9);
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h = 20) {
  // Thick rear wall with offset cast shadow, plaster cap, timber wainscot and baseboard.
  drawDropShadow(ctx, x, y + h + 3, w, 6, 7);
  rect(ctx, x, y + 6, w, h, C.wallDark);
  rect(ctx, x, y, w, 10, C.wallLight);
  rect(ctx, x + 2, y + 2, w - 4, 5, C.wall);
  rect(ctx, x, y + h - 5, w, 6, '#704b35');
  rect(ctx, x, y + h - 3, w, 2, '#d1a166');
  stroke(ctx, x, y, w, h + 8, C.ink, 2);
}

function drawSideWall(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  drawDropShadow(ctx, x + 9, y + 2, 12, h, 6);
  rect(ctx, x + 7, y, 16, h, C.wallDark);
  rect(ctx, x, y, 11, h, C.wallLight);
  rect(ctx, x + 3, y + 2, 5, h - 4, C.wall);
  rect(ctx, x + 15, y, 4, h, '#76523b');
  stroke(ctx, x, y, 23, h, C.ink, 2);
}

function drawHouseWalls(ctx: CanvasRenderingContext2D) {
  // Back/top wall and side walls, with the entrance and patio opening kept clear.
  drawWall(ctx, TILE, TILE, 18 * TILE);
  drawSideWall(ctx, TILE, 2 * TILE, 13 * TILE);
  drawSideWall(ctx, 19 * TILE - 20, 2 * TILE, 9 * TILE);
  drawWall(ctx, TILE, 15 * TILE - 23, 8 * TILE - 3, 17);
  drawWall(ctx, 13 * TILE, 15 * TILE - 23, 6 * TILE - 1, 17);
  drawStoneFoundation(ctx, TILE, 15 * TILE - 3, 8 * TILE - 3);
  drawStoneFoundation(ctx, 13 * TILE, 15 * TILE - 3, 6 * TILE - 1);
  // Divider between the boardroom and bar; its offset gap is the doorway.
  drawSideWall(ctx, 11 * TILE - 11, 2 * TILE, 3 * TILE);
  drawSideWall(ctx, 11 * TILE - 11, 6 * TILE - 5, TILE);
  // Door threshold and layered trim.
  rect(ctx, 9 * TILE, 15 * TILE - 6, 4 * TILE, 8, '#70462f');
  rect(ctx, 9 * TILE + 4, 15 * TILE - 5, 4 * TILE - 8, 4, '#e3c17c');
  rect(ctx, 19 * TILE - 21, 11 * TILE, 6, 3 * TILE, '#70462f');
  rect(ctx, 19 * TILE - 17, 11 * TILE + 3, 4, 3 * TILE - 6, '#e3c17c');
  // Wall mounted frames, displayed at eye level on the back wall.
  drawFrame(ctx, 3 * TILE, TILE + 7, 'TEAM');
  drawFrame(ctx, 6 * TILE, TILE + 7, '1998');
  drawWarmWindow(ctx, 9 * TILE, TILE + 3);
  drawWarmWindow(ctx, 12 * TILE, TILE + 3);
  drawFrame(ctx, 14 * TILE, TILE + 7, 'CLUB');
  drawFrame(ctx, 17 * TILE, TILE + 7, 'FAIR');
}

function drawFrame(ctx: CanvasRenderingContext2D, x: number, y: number, motif: string) {
  rect(ctx, x + 2, y + 4, 31, 16, 'rgba(28,31,30,0.3)');
  rect(ctx, x, y, 31, 15, '#603e2c');
  rect(ctx, x + 3, y + 3, 25, 9, '#d8c895');
  rect(ctx, x + 5, y + 5, 6, 5, '#5e8c59');
  rect(ctx, x + 12, y + 5, 4, 5, '#b95946');
  rect(ctx, x + 17, y + 5, 8, 5, '#476a86');
  label(ctx, motif, x + 15, y + 21, '#f3d488', 7);
  stroke(ctx, x, y, 31, 15, C.ink, 2);
}

function drawWarmWindow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawDropShadow(ctx, x, y, 44, 18, 4);
  rect(ctx, x, y, 44, 18, '#4b342b');
  rect(ctx, x + 3, y + 2, 38, 12, '#bd7848');
  rect(ctx, x + 5, y + 4, 34, 8, '#f4c679');
  rect(ctx, x + 7, y + 5, 13, 6, '#ffe2a2');
  rect(ctx, x + 23, y + 5, 13, 6, '#edaa60');
  rect(ctx, x + 21, y + 4, 2, 9, '#70462f');
  rect(ctx, x + 4, y + 14, 36, 2, '#f1d59a');
  stroke(ctx, x, y, 44, 18, C.ink, 2);
}

function drawStoneFoundation(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  drawDropShadow(ctx, x, y, w, 8, 6);
  rect(ctx, x, y, w, 9, C.stoneDark);
  for (let sx = x + 2, index = 0; sx < x + w - 2; sx += 18, index++) {
    const stone = tileHash(Math.floor(sx / 18), Math.floor(y / 9), 101) % 3;
    rect(ctx, sx, y + 1, Math.min(16, x + w - sx - 2), 6, stone === 0 ? C.stone : stone === 1 ? '#818987' : '#687476');
    rect(ctx, sx + 2, y + 2, 7, 1, C.stoneLight);
    rect(ctx, sx + 7, y + 7, 1, 2, C.stoneDark);
  }
  stroke(ctx, x, y, w, 9, C.ink, 2);
}

function drawRaisedObject(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, top: string, front: string, depth = 12) {
  drawDropShadow(ctx, x, y + h + depth, w, 5, 6);
  rect(ctx, x, y + h, w, depth, front);
  rect(ctx, x, y + h + depth - 4, w, 4, '#54382b');
  rect(ctx, x, y, w, h, top);
  stroke(ctx, x, y, w, h + depth, C.ink, 2);
  rect(ctx, x + 3, y + 2, w - 6, 2, '#f2c67e');
}

function drawCommitteeProps(ctx: CanvasRenderingContext2D) {
  // Committee boardroom table and its deeply shaded front face.
  drawRaisedObject(ctx, 4 * TILE, 3 * TILE + 4, 5 * TILE, 22, '#89552f', '#623b2b', 13);
  rect(ctx, 4 * TILE + 8, 3 * TILE + 9, 5 * TILE - 16, 3, '#d49a58');
  // Folders and papers.
  rect(ctx, 4 * TILE + 9, 3 * TILE - 2, 25, 15, '#b34738');
  rect(ctx, 4 * TILE + 12, 3 * TILE - 6, 22, 14, '#d5b457');
  rect(ctx, 4 * TILE + 14, 3 * TILE - 2, 17, 2, '#f1dfb3');
  rect(ctx, 6 * TILE + 28, 3 * TILE - 3, 25, 17, '#38516a');
  rect(ctx, 6 * TILE + 30, 3 * TILE - 1, 21, 11, '#9db3b4');
  rect(ctx, 6 * TILE + 34, 3 * TILE + 2, 13, 2, '#28373f');
  // Gold trophy on the tabletop.
  rect(ctx, 8 * TILE + 14, 3 * TILE - 8, 7, 8, '#f2c350');
  rect(ctx, 8 * TILE + 10, 3 * TILE - 5, 4, 5, '#d79b33');
  rect(ctx, 8 * TILE + 21, 3 * TILE - 5, 4, 5, '#d79b33');
  rect(ctx, 8 * TILE + 15, 3 * TILE, 6, 4, '#a76e2d');
  // Whiteboard under the framed club photos.
  rect(ctx, 7 * TILE + 4, 2 * TILE + 2, 2 * TILE + 14, 20, '#5b4c38');
  rect(ctx, 7 * TILE + 7, 2 * TILE + 5, 2 * TILE + 8, 14, '#eceddc');
  rect(ctx, 7 * TILE + 13, 2 * TILE + 8, 27, 2, '#d06b54');
  rect(ctx, 7 * TILE + 13, 2 * TILE + 13, 37, 2, '#4b8290');
  // Trophy cabinet in the main hall.
  drawRaisedObject(ctx, 14 * TILE + 3, 3 * TILE, 2 * TILE + 15, 42, '#8c5b37', '#5e4232', 9);
  rect(ctx, 14 * TILE + 11, 3 * TILE + 7, 2 * TILE, 26, '#92b3ac');
  stroke(ctx, 14 * TILE + 8, 3 * TILE + 5, 2 * TILE + 6, 31, '#2b4b4b', 2);
  for (let i = 0; i < 3; i++) {
    const tx = 14 * TILE + 16 + i * 15;
    rect(ctx, tx, 3 * TILE + 14, 7, 10, '#e6b647');
    rect(ctx, tx - 3, 3 * TILE + 17, 3, 5, '#bd812f');
    rect(ctx, tx + 7, 3 * TILE + 17, 3, 5, '#bd812f');
  }
}

function drawBarProps(ctx: CanvasRenderingContext2D) {
  label(ctx, 'CLUB BAR  /  RSA', 12 * TILE, 6 * TILE + 12, '#f6df9f', 10);
  drawRaisedObject(ctx, 7 * TILE + 3, 7 * TILE - 4, 10 * TILE - 6, 19, '#523b32', '#3a3030', 13);
  rect(ctx, 7 * TILE + 8, 7 * TILE + 1, 10 * TILE - 16, 4, '#d2a263');
  // Tap handles, non-alcoholic drinks and water dispenser.
  for (const x of [12 * TILE + 7, 13 * TILE + 26]) {
    rect(ctx, x, 7 * TILE - 1, 4, 15, '#b6c3b8');
    rect(ctx, x - 4, 7 * TILE - 4, 11, 4, '#dbe5d7');
    rect(ctx, x + 1, 7 * TILE + 12, 2, 5, '#86bfce');
  }
  rect(ctx, 10 * TILE + 9, 7 * TILE - 2, 9, 8, '#db7053');
  rect(ctx, 10 * TILE + 11, 7 * TILE - 4, 5, 3, '#f7d08b');
  // Small register with receipt roll.
  rect(ctx, 15 * TILE + 11, 7 * TILE - 12, 21, 13, '#32444a');
  rect(ctx, 15 * TILE + 14, 7 * TILE - 9, 13, 5, '#acd0bd');
  rect(ctx, 15 * TILE + 18, 7 * TILE - 15, 7, 5, '#eee5c8');
  // Glass cabinet, glass-front bottles and water glasses.
  drawRaisedObject(ctx, 7 * TILE + 8, 6 * TILE - 17, 3 * TILE, 15, '#6c503a', '#563a2c', 7);
  rect(ctx, 7 * TILE + 14, 6 * TILE - 14, 3 * TILE - 12, 10, '#8fb8ad');
  stroke(ctx, 7 * TILE + 12, 6 * TILE - 16, 3 * TILE - 8, 14, '#29484a', 2);
  for (let i = 0; i < 4; i++) {
    rect(ctx, 7 * TILE + 18 + i * 15, 6 * TILE - 12, 5, 7, ['#e7cc73', '#a7d5d0', '#dc7b64', '#8fb1d2'][i]);
    rect(ctx, 7 * TILE + 19 + i * 15, 6 * TILE - 14, 3, 2, '#f8e8bb');
  }
  // Stools: seat, dark outline, and splayed timber legs.
  [8 * TILE + 18, 11 * TILE + 18, 15 * TILE + 18].forEach((x, i) => {
    const y = 8 * TILE + 22 + (i % 2) * 3;
    drawDropShadow(ctx, x - 3, y, 18, 20, 4);
    rect(ctx, x + 4, y + 8, 4, 13, '#6b482f');
    rect(ctx, x - 3, y + 3, 3, 13, '#765236');
    rect(ctx, x + 12, y + 3, 3, 13, '#765236');
    rect(ctx, x, y, 12, 5, '#a86e43');
    stroke(ctx, x, y, 12, 5, C.ink, 2);
    rect(ctx, x + 4, y + 1, 4, 2, '#d6a765');
  });
  // Tiny coasters along the counter edge.
  [8 * TILE, 10 * TILE, 14 * TILE, 16 * TILE].forEach((x) => {
    rect(ctx, x + 5, 7 * TILE + 18, 10, 5, '#f1dbab');
    stroke(ctx, x + 5, 7 * TILE + 18, 10, 5, '#523a32', 1);
  });
  // Side return shelf.
  drawRaisedObject(ctx, 7 * TILE - 1, 8 * TILE - 2, 19, 30, '#745037', '#553b2c', 12);
}

function drawLounge(ctx: CanvasRenderingContext2D) {
  // Club lounge sofas, coffee table and a low potted plant.
  drawRaisedObject(ctx, 14 * TILE + 1, 12 * TILE + 1, 2 * TILE + 10, 24, '#356b59', '#214d43', 12);
  rect(ctx, 14 * TILE + 9, 12 * TILE + 5, 2 * TILE - 2, 13, '#4d8d70');
  rect(ctx, 14 * TILE + 15, 12 * TILE + 8, 26, 8, '#70a47b');
  stroke(ctx, 14 * TILE + 8, 12 * TILE + 4, 2 * TILE, 16, '#172f2e', 2);
  drawRaisedObject(ctx, 14 * TILE + 12, 13 * TILE + 21, 38, 16, '#8e633f', '#63452e', 8);
  rect(ctx, 14 * TILE + 22, 13 * TILE + 25, 17, 4, '#e2bd78');
  // Plant in a striped terracotta pot.
  drawPlant(ctx, 18 * TILE - 8, 13 * TILE + 10, 0.8);
  label(ctx, 'MEMBERS LOUNGE', 16 * TILE, 11 * TILE + 22, '#f4dfab', 8);
}

function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  const s = scale;
  drawFootShadow(ctx, x + 15 * s, y + 23 * s, 12 * s, 3 * s);
  rect(ctx, x + 8 * s, y + 15 * s, 13 * s, 10 * s, '#b85e3e');
  rect(ctx, x + 6 * s, y + 14 * s, 17 * s, 4 * s, '#d17a4a');
  rect(ctx, x + 13 * s, y + 4 * s, 5 * s, 12 * s, '#34754a');
  rect(ctx, x + 3 * s, y + 7 * s, 12 * s, 5 * s, '#3d9454');
  rect(ctx, x + 15 * s, y + 1 * s, 11 * s, 6 * s, '#4c9b58');
  rect(ctx, x + 5 * s, y + 5 * s, 4 * s, 2 * s, '#8ab85c');
  stroke(ctx, x + 6 * s, y + 14 * s, 17 * s, 11 * s, '#4e352d', 2);
}

function drawChangeRooms(ctx: CanvasRenderingContext2D) {
  // Tile floor inside the change block.
  rect(ctx, 11 * TILE + 4, 17 * TILE + 5, 5 * TILE - 8, 4 * TILE - 5, '#647277');
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 9; col++) {
      rect(ctx, 11 * TILE + 7 + col * 19, 17 * TILE + 8 + row * 18, 18, 17, (row + col) % 2 ? '#718086' : '#65767c');
    }
  }
  // Building shell, low roof and deep front fascia.
  drawDropShadow(ctx, 11 * TILE, 17 * TILE + 2, 5 * TILE, 4 * TILE + 6, 8);
  rect(ctx, 11 * TILE, 17 * TILE - 7, 5 * TILE, 4 * TILE, '#465c64');
  rect(ctx, 11 * TILE + 5, 17 * TILE - 12, 5 * TILE - 10, 10, '#729095');
  rect(ctx, 11 * TILE, 17 * TILE + 3, 5 * TILE, 11, '#2e444c');
  rect(ctx, 11 * TILE, 17 * TILE + 9, 5 * TILE, 5, '#d5b56d');
  stroke(ctx, 11 * TILE, 17 * TILE - 11, 5 * TILE, 4 * TILE + 20, C.ink, 2);
  label(ctx, 'CHANGE ROOMS', 13.5 * TILE, 17 * TILE - 14, '#fbefca', 9);
  // Locker doors, frame rivets, vents and number tabs.
  for (let i = 0; i < 6; i++) {
    const x = 11 * TILE + 7 + i * 28;
    rect(ctx, x, 17 * TILE + 5, 24, 38, '#8fa6a4');
    rect(ctx, x + 3, 17 * TILE + 8, 18, 28, i % 2 ? '#a5b5ae' : '#93aaa7');
    rect(ctx, x + 6, 17 * TILE + 12, 12, 3, '#52676b');
    rect(ctx, x + 17, 17 * TILE + 22, 2, 4, '#e4c46e');
    rect(ctx, x + 5, 17 * TILE + 9, 2, 21, '#c5cec0');
    stroke(ctx, x, 17 * TILE + 5, 24, 38, '#24363d', 2);
  }
  // Benches and two kit bags placed off the main character route.
  drawRaisedObject(ctx, 11 * TILE + 3, 19 * TILE + 4, 48, 10, '#ae7140', '#70462d', 10);
  drawRaisedObject(ctx, 14 * TILE + 41, 19 * TILE + 5, 39, 10, '#ae7140', '#70462d', 10);
  rect(ctx, 11 * TILE + 24, 20 * TILE + 4, 19, 11, '#31536c');
  rect(ctx, 11 * TILE + 26, 20 * TILE + 2, 14, 4, '#416e8d');
  rect(ctx, 14 * TILE + 54, 20 * TILE + 2, 16, 12, '#8a523c');
  rect(ctx, 14 * TILE + 57, 20 * TILE, 9, 5, '#bd7948');
}

function drawGrandstand(ctx: CanvasRenderingContext2D) {
  // Grid-aligned timber bleachers in the north grass margin, wholly above the touchline.
  const { x, y, w, h } = GRANDSTAND;
  drawDropShadow(ctx, x + 2, y + 3, w - 4, h, 8);
  rect(ctx, x + 3, y + 4, w - 6, h - 5, '#563c2d');
  for (let row = 0; row < 3; row++) {
    const seatY = y + 7 + row * 15;
    rect(ctx, x + 6, seatY, w - 12, 10, row === 0 ? '#a36e3f' : row === 1 ? '#916039' : '#825435');
    rect(ctx, x + 6, seatY + 7, w - 12, 4, '#543b2e');
    rect(ctx, x + 8, seatY + 1, w - 16, 1, '#d6a766');
    for (let col = 0; col < 5; col++) rect(ctx, x + 14 + col * 38, seatY + 2, 4, 6, '#e2bd7b');
  }
  rect(ctx, x, y + 2, w, 5, '#5e4937');
  rect(ctx, x + 4, y + 1, w - 8, 5, '#e2c57e');
  stroke(ctx, x, y + 1, w, h, '#29383b', 2);
  label(ctx, 'SMOKE-FREE STANDS', x + w / 2, y + 56, '#fbf0cf', 8);
}

function drawWellbeingNook(ctx: CanvasRenderingContext2D) {
  // A quiet pavilion canopy and floor, deliberately set behind the two NPC stations.
  drawDropShadow(ctx, 23 * TILE + 3, 16 * TILE + 11, 7 * TILE, 5 * TILE, 8);
  rect(ctx, 23 * TILE + 3, 16 * TILE + 14, 7 * TILE, 5 * TILE, '#8c694d');
  rect(ctx, 23 * TILE + 7, 16 * TILE + 11, 7 * TILE - 8, 5 * TILE - 3, '#c4ad7e');
  for (let y = 16 * TILE + 15; y < 21 * TILE; y += 18) rect(ctx, 23 * TILE + 11, y, 7 * TILE - 17, 2, '#98744f');
  // Kiosk front desk and awning.
  rect(ctx, 25 * TILE + 9, 15 * TILE + 10, 4 * TILE + 3, 11, '#f1d89e');
  rect(ctx, 25 * TILE + 4, 15 * TILE + 17, 4 * TILE + 13, 20, '#b75145');
  rect(ctx, 25 * TILE + 7, 15 * TILE + 36, 4 * TILE + 7, 10, '#873e38');
  rect(ctx, 25 * TILE + 10, 15 * TILE + 19, 4 * TILE, 3, '#fff0c3');
  stroke(ctx, 25 * TILE + 4, 15 * TILE + 17, 4 * TILE + 13, 29, '#352f32', 2);
  label(ctx, 'WELLBEING', 27 * TILE, 15 * TILE + 8, '#fff0c3', 8);
  // Bookshelf, visible spines, set to the far side away from guests.
  drawRaisedObject(ctx, 29 * TILE + 8, 16 * TILE + 3, 22, 36, '#70492f', '#503b32', 10);
  rect(ctx, 29 * TILE + 13, 16 * TILE + 8, 12, 25, '#d0b187');
  for (let i = 0; i < 5; i++) {
    const bx = 29 * TILE + 14 + (i % 3) * 4;
    rect(ctx, bx, 16 * TILE + 9 + Math.floor(i / 3) * 11, 3, 9, ['#b55145', '#387257', '#536f9a', '#d09d3c', '#854b6e'][i]);
  }
  // Warm floor lamp with pixel halo, plants, comfortable armchairs.
  rect(ctx, 23 * TILE + 16, 19 * TILE + 1, 3, 28, '#5b4835');
  rect(ctx, 23 * TILE + 10, 19 * TILE - 2, 15, 10, '#e2b95f');
  rect(ctx, 23 * TILE + 13, 19 * TILE, 9, 5, '#f8dd88');
  drawDropShadow(ctx, 23 * TILE + 3, 20 * TILE + 21, 50, 27, 5);
  rect(ctx, 23 * TILE + 7, 20 * TILE + 26, 40, 22, '#466a75');
  rect(ctx, 23 * TILE + 3, 20 * TILE + 21, 11, 25, '#31525e');
  rect(ctx, 23 * TILE + 41, 20 * TILE + 21, 11, 25, '#31525e');
  rect(ctx, 23 * TILE + 14, 20 * TILE + 29, 26, 11, '#658891');
  stroke(ctx, 23 * TILE + 3, 20 * TILE + 21, 49, 27, '#233b43', 2);
  drawDropShadow(ctx, 28 * TILE + 2, 20 * TILE + 22, 50, 26, 5);
  rect(ctx, 28 * TILE + 8, 20 * TILE + 27, 37, 21, '#785b73');
  rect(ctx, 28 * TILE + 2, 20 * TILE + 22, 11, 24, '#62455f');
  rect(ctx, 28 * TILE + 41, 20 * TILE + 22, 11, 24, '#62455f');
  rect(ctx, 28 * TILE + 13, 20 * TILE + 30, 25, 10, '#9a7590');
  stroke(ctx, 28 * TILE + 2, 20 * TILE + 22, 50, 26, '#382e3d', 2);
  drawPlant(ctx, 22 * TILE + 18, 19 * TILE + 28, 0.82);
  drawPlant(ctx, 30 * TILE + 2, 19 * TILE + 29, 0.8);
}

function drawPixelSprite(ctx: CanvasRenderingContext2D, centerX: number, feetY: number, options: {
  dir: PlayerPosition['dir'];
  shirt: string;
  accent: string;
  hair: string;
  skin?: string;
  hat?: boolean;
  bob?: number;
  style?: number;
}) {
  const scale = 2;
  const originX = Math.round(centerX - 16);
  const originY = Math.round(feetY - 47 + (options.bob ?? 0));
  const p = (x: number, y: number, w: number, h: number, color: string) => {
    rect(ctx, originX + x * scale, originY + y * scale, w * scale, h * scale, color);
  };
  const outline = '#202630';
  // 16×24 sprite silhouette with hard 1px logical outlines and separated feet.
  p(4, 1, 8, 1, outline); p(2, 2, 12, 5, outline); p(3, 7, 10, 2, outline);
  p(2, 9, 12, 7, outline); p(1, 10, 2, 5, outline); p(13, 10, 2, 5, outline);
  p(4, 15, 4, 7, outline); p(8, 15, 4, 7, outline); p(3, 22, 5, 2, outline); p(8, 22, 5, 2, outline);
  // Hair, ears, face and distinctive hair silhouette.
  p(4, 2, 8, 6, options.skin ?? '#edb98c');
  p(2, 3, 2, 3, options.skin ?? '#edb98c'); p(12, 3, 2, 3, options.skin ?? '#edb98c');
  const hairStyle = options.style ?? 0;
  p(3, 1, 10, hairStyle % 3 === 0 ? 2 : 3, options.hair);
  if (hairStyle % 3 === 1) { p(2, 3, 3, 3, options.hair); p(11, 2, 3, 4, options.hair); }
  else if (hairStyle % 3 === 2) { p(3, 3, 2, 4, options.hair); p(11, 3, 2, 4, options.hair); p(6, 4, 5, 1, options.hair); }
  else { p(5, 4, 6, 2, options.hair); }
  if (options.hat) {
    p(2, 1, 12, 2, '#a33b35'); p(1, 2, 14, 2, '#d44f45');
    p(options.dir === 'left' ? 0 : 3, 4, options.dir === 'right' ? 5 : 10, 1, '#a33b35');
    p(4, 1, 8, 1, '#e67558');
  }
  // Face direction: eyes are hidden from the back, profile gets a single pixel eye.
  if (options.dir === 'down') { p(5, 5, 1, 1, outline); p(10, 5, 1, 1, outline); }
  else if (options.dir === 'left') p(4, 5, 1, 1, outline);
  else if (options.dir === 'right') p(11, 5, 1, 1, outline);
  else { p(5, 5, 6, 1, options.skin ?? '#edb98c'); }
  // Jersey, dark hems, sleeves and a team-colour accent.
  p(4, 9, 8, 6, options.shirt); p(2, 10, 2, 4, options.shirt); p(12, 10, 2, 4, options.shirt);
  p(4, 14, 8, 1, outline); p(6, 9, 1, 6, options.accent); p(9, 9, 1, 6, options.accent);
  p(4, 9, 2, 1, '#fff0d2'); p(10, 10, 2, 2, '#efc85e');
  p(5, 13, 6, 1, '#253946');
  p(3, 12, 1, 2, '#e3a97d'); p(12, 12, 1, 2, '#e3a97d');
  // Lower kit and boots.
  p(4, 15, 4, 7, '#263b55'); p(8, 15, 4, 7, '#263b55');
  p(4, 20, 4, 2, '#405c77'); p(8, 20, 4, 2, '#405c77');
  p(3, 22, 5, 2, '#f1dec0'); p(8, 22, 5, 2, '#f1dec0');
  p(4, 23, 4, 1, '#b84335'); p(9, 23, 3, 1, '#b84335');
}

function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC, nearbyNPC: NPC | null, completion: CompletionMap, time: number, index: number) {
  const nx = npc.x * TILE + TILE / 2;
  const feetY = npc.y * TILE + TILE / 2 + 14;
  const done = (completion[npc.id]?.total ?? 0) > 0 && (completion[npc.id]?.completed ?? 0) >= (completion[npc.id]?.total ?? 0);
  const isNearby = nearbyNPC?.id === npc.id;
  const breathFrame = Math.floor(time * 1.35 + index * 0.23) % 2;
  const bob = isNearby ? Math.sin(time * 3.5 + index) * 1.4 : breathFrame === 0 ? 0 : -1.5;
  // Soft, directional ellipse sits beneath each character while their idle body breathes.
  drawFootShadow(ctx, nx, feetY - 1, 12, 4);
  drawPixelSprite(ctx, nx, feetY, {
    dir: npc.direction,
    shirt: npc.spriteColor,
    accent: index % 2 ? '#ead78f' : '#f3e4c4',
    hair: ['#49352e', '#292d37', '#c3b69a', '#3c2e2d', '#322b2b', '#603b2e'][index % 6],
    skin: ['#ecc09b', '#d99d78', '#e9c9a7', '#d7a17e'][index % 4],
    style: index % 3,
    bob,
  });
  if (done) {
    drawPixelBubble(ctx, nx, feetY - 55, '✓', '#4aa86a');
  } else if (isNearby) {
    drawPixelBubble(ctx, nx, feetY - 59 + Math.sin(time * 3) * 2, '!', '#ef6a48');
  } else {
    // A tiny white pixel speech balloon replaces the old floating question marker.
    const bx = nx - 7;
    const by = feetY - 55 + bob;
    rect(ctx, bx - 2, by - 2, 18, 13, C.ink);
    rect(ctx, bx, by, 14, 9, '#fff7dd');
    rect(ctx, bx + 2, by + 2, 2, 2, '#6c6759');
    rect(ctx, bx + 6, by + 2, 2, 2, '#6c6759');
    rect(ctx, bx + 10, by + 2, 2, 2, '#6c6759');
    rect(ctx, bx + 3, by + 9, 3, 3, C.ink);
    rect(ctx, bx + 4, by + 9, 2, 2, '#fff7dd');
  }
  // Small, dark name plate stays legible against both grass and floors.
  const name = npc.name;
  ctx.font = 'bold 8px monospace';
  const width = Math.max(31, Math.ceil(ctx.measureText(name).width + 8));
  const plateY = feetY - 2;
  rect(ctx, nx - width / 2, plateY, width, 12, '#26353a');
  rect(ctx, nx - width / 2 + 2, plateY + 2, width - 4, 2, '#e1b766');
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff4d3';
  ctx.fillText(name, nx, plateY + 9);
  ctx.textAlign = 'start';
}

function drawPixelBubble(ctx: CanvasRenderingContext2D, cx: number, y: number, mark: string, fill: string) {
  rect(ctx, cx - 8, y - 2, 18, 20, C.ink);
  rect(ctx, cx - 6, y, 14, 15, '#fff7de');
  rect(ctx, cx - 5, y + 15, 4, 4, C.ink);
  rect(ctx, cx - 4, y + 15, 2, 2, '#fff7de');
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = fill;
  ctx.fillText(mark, cx + 1, y + 12);
  ctx.textAlign = 'start';
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerPosition, nearbyNPC: NPC | null, time: number) {
  const px = player.x * TILE + TILE / 2;
  const feetY = player.y * TILE + TILE / 2 + 14;
  const walkFrame = Math.floor(time * 14) % 2;
  const bob = player.isMoving ? (walkFrame ? -2 : 0) : 0;
  drawDustPuffs(ctx, player, px, feetY, time);
  drawFootShadow(ctx, px, feetY - 1, 13, 4);
  drawPixelSprite(ctx, px, feetY, {
    dir: player.dir,
    shirt: '#176847',
    accent: '#f1c358',
    hair: '#332b28',
    skin: '#edbf98',
    hat: true,
    bob,
  });
  if (nearbyNPC) {
    // Make the player's facing/engagement obvious without adding a second status icon.
    rect(ctx, px - 2, feetY - 51, 4, 3, '#f4cf78');
  }
}

function drawDustPuffs(ctx: CanvasRenderingContext2D, player: PlayerPosition, px: number, feetY: number, time: number) {
  if (!player.isMoving || !isOnDirtPath(player.x, player.y)) return;
  const rear = player.dir === 'up' ? { x: 0, y: 1 } : player.dir === 'down' ? { x: 0, y: -1 } : player.dir === 'left' ? { x: 1, y: 0 } : { x: -1, y: 0 };
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const phase = (time * 1.5 + i / 3) % 1;
    ctx.globalAlpha = (1 - phase) * 0.72;
    const drift = 4 + phase * 8;
    const x = px + rear.x * drift + Math.sin((time + i) * 4) * 2 - 2;
    const y = feetY - 3 + rear.y * (3 + phase * 4) - phase * 5;
    rect(ctx, x, y, phase < 0.45 ? 4 : 3, 2, phase < 0.55 ? '#e4c18a' : '#b98c5b');
    if (phase < 0.35) rect(ctx, x + 2, y - 2, 2, 2, '#ead3a3');
  }
  ctx.restore();
}

function drawAmbientLighting(ctx: CanvasRenderingContext2D, time: number) {
  const lights = [
    { x: 12 * TILE, y: 7 * TILE, radius: 132, strength: 0.17, phase: 0.2 },
    { x: 9 * TILE + 22, y: TILE + 12, radius: 82, strength: 0.12, phase: 1.7 },
    { x: 12 * TILE + 22, y: TILE + 12, radius: 82, strength: 0.12, phase: 2.5 },
    { x: 25 * TILE, y: 19 * TILE, radius: 108, strength: 0.16, phase: 0.9 },
  ];
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const light of lights) {
    const pulse = 0.96 + Math.sin(time * 0.8 + light.phase) * 0.04;
    const glow = ctx.createRadialGradient(light.x, light.y, 2, light.x, light.y, light.radius);
    glow.addColorStop(0, `rgba(255, 205, 126, ${light.strength * pulse})`);
    glow.addColorStop(0.48, `rgba(255, 179, 94, ${light.strength * 0.35 * pulse})`);
    glow.addColorStop(1, 'rgba(255, 167, 74, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(light.x - light.radius, light.y - light.radius, light.radius * 2, light.radius * 2);
  }
  ctx.restore();
}

export function drawClubMap(ctx: CanvasRenderingContext2D, player: PlayerPosition, nearbyNPC: NPC | null, completion: CompletionMap, time: number) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, W, H);
  drawGrass(ctx);
  drawDirtPath(ctx);
  drawPitch(ctx);
  drawJuniorFence(ctx);

  drawInteriorFloor(ctx);
  drawChangeRooms(ctx);
  drawGrandstand(ctx);
  drawWellbeingNook(ctx);
  drawHouseWalls(ctx);
  drawCommitteeProps(ctx);
  drawBarProps(ctx);
  drawLounge(ctx);
  drawPlant(ctx, 16 * TILE + 15, 14 * TILE + 2, 0.75);
  drawPlant(ctx, 3 * TILE + 1, 8 * TILE + 6, 0.78);

  // Small healthcare/club signs and field details.
  rect(ctx, 24 * TILE + 3, 15 * TILE + 5, 15, 9, '#faf0d2');
  rect(ctx, 24 * TILE + 7, 15 * TILE + 7, 7, 5, '#d8544c');
  rect(ctx, 24 * TILE + 9, 15 * TILE + 6, 3, 7, '#fff3d4');

  // Y-sort vegetation crowns, NPCs, and the player so whoever is visually farther back draws first.
  const entities = [
    ...TREE_PLACEMENTS.map((tree) => ({ y: tree.y + 42 * tree.scale, draw: () => drawTree(ctx, tree, time) })),
    ...BUSH_PLACEMENTS.map((bush) => ({ y: bush.y + 20, draw: () => drawBush(ctx, bush, time) })),
    ...NPCS.map((npc, index) => ({ y: npc.y * TILE + TILE / 2 + 14, draw: () => drawNPC(ctx, npc, nearbyNPC, completion, time, index) })),
    { y: player.y * TILE + TILE / 2 + 14, draw: () => drawPlayer(ctx, player, nearbyNPC, time) },
  ].sort((a, b) => a.y - b.y);
  entities.forEach((entity) => entity.draw());
  drawAmbientLighting(ctx, time);
}
