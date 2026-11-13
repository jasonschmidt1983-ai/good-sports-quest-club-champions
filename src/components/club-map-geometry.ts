export const TILE_SIZE = 36;
export const MAP_COLS = 33;
export const MAP_ROWS = 24;
export const MAP_WIDTH = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SENIOR_TURF: PixelRect = {
  x: 20 * TILE_SIZE,
  y: 2 * TILE_SIZE,
  w: 12 * TILE_SIZE,
  h: 12 * TILE_SIZE,
};

// Half-open grid bounds: one full tile of turf surrounds the chalk rectangle.
export const SENIOR_PITCH = {
  x: 21 * TILE_SIZE,
  y: 3 * TILE_SIZE,
  w: 10 * TILE_SIZE,
  h: 10 * TILE_SIZE,
  centerX: 26 * TILE_SIZE,
  centerY: 8 * TILE_SIZE,
  right: 31 * TILE_SIZE,
  bottom: 13 * TILE_SIZE,
};

export const SENIOR_FENCE = {
  leftX: 20 * TILE_SIZE - 5,
  rightX: 32 * TILE_SIZE,
  topY: 2 * TILE_SIZE,
  gateTopY: 11 * TILE_SIZE,
  gateBottomY: 13 * TILE_SIZE,
  bottomY: 14 * TILE_SIZE,
};

export const GRANDSTAND = {
  x: 22 * TILE_SIZE,
  y: 0,
  w: 6 * TILE_SIZE,
  h: 60,
  firstBlockedCol: 22,
  lastBlockedCol: 27,
  blockedRow: 1,
};

export const JUNIOR_TURF: PixelRect = {
  x: 1 * TILE_SIZE,
  y: 17 * TILE_SIZE,
  w: 10 * TILE_SIZE,
  h: 6 * TILE_SIZE,
};

export const JUNIOR_PITCH = {
  x: 3 * TILE_SIZE,
  y: 18 * TILE_SIZE,
  w: 6 * TILE_SIZE,
  h: 3 * TILE_SIZE,
  centerX: 6 * TILE_SIZE,
  centerY: 19.5 * TILE_SIZE,
  right: 9 * TILE_SIZE,
  bottom: 21 * TILE_SIZE,
};

export const JUNIOR_FENCE = {
  leftX: 2 * TILE_SIZE - 8,
  rightX: 10 * TILE_SIZE + 3,
  topY: 17 * TILE_SIZE + 3,
  bottomY: 22 * TILE_SIZE + 4,
};

export const DIRT_PATHS: readonly PixelRect[] = [
  { x: 9 * TILE_SIZE + 4, y: 15 * TILE_SIZE - 2, w: 4 * TILE_SIZE - 8, h: 2 * TILE_SIZE + 3 },
  { x: 13 * TILE_SIZE + 1, y: 15 * TILE_SIZE + 4, w: 7 * TILE_SIZE, h: TILE_SIZE + 27 },
  { x: 19 * TILE_SIZE + 4, y: 14 * TILE_SIZE + 4, w: 2 * TILE_SIZE + 2, h: 8 * TILE_SIZE },
  { x: 20 * TILE_SIZE + 3, y: 18 * TILE_SIZE, w: 6 * TILE_SIZE, h: 2 * TILE_SIZE },
];

export function isOnDirtPath(tileX: number, tileY: number): boolean {
  const x = tileX * TILE_SIZE + TILE_SIZE / 2;
  const y = tileY * TILE_SIZE + TILE_SIZE / 2;
  return DIRT_PATHS.some((path) => x >= path.x && x < path.x + path.w && y >= path.y && y < path.y + path.h);
}

export interface VegetationPlacement {
  x: number;
  y: number;
  scale: number;
  phase: number;
}

export interface BushPlacement {
  x: number;
  y: number;
  phase: number;
}

const JUNIOR_FENCE_BOUNDS: PixelRect = {
  x: JUNIOR_FENCE.leftX - 7,
  y: JUNIOR_FENCE.topY - 5,
  w: JUNIOR_FENCE.rightX - JUNIOR_FENCE.leftX + 17,
  h: JUNIOR_FENCE.bottomY - JUNIOR_FENCE.topY + 14,
};

const VEGETATION_BLOCKERS: readonly PixelRect[] = [
  { x: TILE_SIZE, y: TILE_SIZE, w: 18 * TILE_SIZE + 5, h: 15 * TILE_SIZE },
  SENIOR_TURF,
  JUNIOR_TURF,
  GRANDSTAND,
  { x: 11 * TILE_SIZE, y: 17 * TILE_SIZE - 12, w: 5 * TILE_SIZE, h: 4 * TILE_SIZE + 20 },
  { x: 22 * TILE_SIZE, y: 15 * TILE_SIZE, w: 9 * TILE_SIZE, h: 7 * TILE_SIZE },
  { x: SENIOR_FENCE.leftX - 7, y: SENIOR_FENCE.topY, w: 17, h: SENIOR_FENCE.bottomY - SENIOR_FENCE.topY },
  { x: SENIOR_FENCE.rightX - 7, y: SENIOR_FENCE.topY, w: 18, h: SENIOR_FENCE.bottomY - SENIOR_FENCE.topY },
  JUNIOR_FENCE_BOUNDS,
  ...DIRT_PATHS,
];

function overlaps(a: PixelRect, b: PixelRect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function isSafeVegetation(bounds: PixelRect): boolean {
  const insideMap = bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.w <= MAP_WIDTH && bounds.y + bounds.h <= MAP_HEIGHT;
  return insideMap && VEGETATION_BLOCKERS.every((blocker) => !overlaps(bounds, blocker));
}

const TREE_CANDIDATES: readonly VegetationPlacement[] = [
  { x: 700, y: 2, scale: 0.75, phase: 0.2 },
  { x: 1025, y: 2, scale: 0.75, phase: 1.3 },
  { x: 0, y: 560, scale: 0.75, phase: 2.1 },
  { x: 0, y: 775, scale: 0.75, phase: 0.9 },
  { x: 1125, y: 520, scale: 0.75, phase: 1.8 },
  { x: 1125, y: 600, scale: 0.75, phase: 2.8 },
  { x: 32 * TILE_SIZE + 13, y: 82, scale: 0.62, phase: 1.1 },
  { x: 32 * TILE_SIZE + 13, y: 262, scale: 0.62, phase: 2.3 },
  { x: 420, y: 832, scale: 0.75, phase: 0.5 },
  { x: 640, y: 832, scale: 0.75, phase: 1.6 },
  { x: 820, y: 832, scale: 0.75, phase: 2.4 },
  { x: 1015, y: 832, scale: 0.75, phase: 3.1 },
];

export const TREE_PLACEMENTS = TREE_CANDIDATES.filter(({ x, y, scale }) =>
  isSafeVegetation({ x: x + 2 * scale, y, w: 32 * scale, h: 42 * scale }),
);

const BUSH_CANDIDATES: readonly BushPlacement[] = [
  { x: 1129, y: 145, phase: 0.4 },
  { x: 1129, y: 280, phase: 1.5 },
  { x: 1129, y: 410, phase: 2.6 },
  { x: 1125, y: 518, phase: 0.8 },
  { x: 32 * TILE_SIZE + 13, y: 520, phase: 1.7 },
  { x: 430, y: 836, phase: 1.9 },
  { x: 555, y: 836, phase: 2.8 },
  { x: 760, y: 836, phase: 0.6 },
  { x: 945, y: 836, phase: 1.2 },
];

export const BUSH_PLACEMENTS = BUSH_CANDIDATES.filter(({ x, y }) =>
  isSafeVegetation({ x, y, w: 22, h: 20 }),
);
