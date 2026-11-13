import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NPC, PlayerPosition } from '../types/game';
import { NPCS } from '../data/goodSportsQuestions';
import { sounds } from '../utils/audio';
import { drawClubMap } from './clubhouse-pixel-art';
import { MessageSquare, Compass, Volume2, VolumeX, HelpCircle, Award } from 'lucide-react';

interface ClubMapCanvasProps {
  onInteractNPC: (npc: NPC) => void;
  answeredQuestionIds: Record<string, string>;
  activeStreamQuestions: string[];
  npcCompletionMap: Record<string, { total: number; completed: number }>;
  onOpenHub: () => void;
  onOpenTraining: () => void;
}

const TILE_SIZE = 36;
const MAP_COLS = 32;
const MAP_ROWS = 24;

// Collision map: 1 = impassable, 0 = walkable
const createCollisionMap = (): number[][] => {
  const map: number[][] = Array(MAP_ROWS).fill(0).map(() => Array(MAP_COLS).fill(0));

  // Outer boundaries
  for (let r = 0; r < MAP_ROWS; r++) {
    map[r][0] = 1;
    map[r][MAP_COLS - 1] = 1;
  }
  for (let c = 0; c < MAP_COLS; c++) {
    map[0][c] = 1;
    map[MAP_ROWS - 1][c] = 1;
  }

  // Clubhouse exterior walls (r: 1..15, c: 1..19)
  for (let c = 1; c <= 19; c++) {
    map[1][c] = 1; // Top wall
    if (c < 9 || c > 13) {
      map[15][c] = 1; // Bottom wall except main entrance opening (c: 9..13)
    }
  }
  for (let r = 1; r <= 15; r++) {
    map[r][1] = 1; // Left wall
    if (r < 11 || r > 13) {
      map[r][19] = 1; // Right wall except patio doorway (r: 11..13)
    }
  }

  // Boardroom divider wall (r: 1..6, c: 11)
  for (let r = 1; r <= 6; r++) {
    if (r !== 5) map[r][11] = 1; // Doorway at r:5
  }
  // Boardroom table (r: 3, c: 4..8)
  for (let c = 4; c <= 8; c++) map[3][c] = 1;

  // Bar Counter (r: 7, c: 7..16)
  for (let c = 7; c <= 16; c++) {
    map[7][c] = 1;
  }
  map[8][7] = 1; // Bar side return

  // Change rooms building (r: 17..21, c: 11..16)
  for (let c = 11; c <= 16; c++) {
    map[17][c] = 1;
    if (c !== 13) map[21][c] = 1; // Door at c:13
  }
  for (let r = 17; r <= 21; r++) {
    map[r][11] = 1;
    map[r][16] = 1;
  }

  // Oval boundary fence (r: 2..15, c: 20)
  for (let r = 2; r <= 15; r++) {
    if (r !== 7 && r !== 8) {
      map[r][20] = 1; // Gate at r: 7..8
    }
  }

  // Senior Pitch Goal Posts
  map[7][30] = 1;
  map[9][30] = 1;

  // Junior Pitch Mini Goals
  map[20][3] = 1;
  map[21][3] = 1;

  // First Aid / Wellbeing Pavilion kiosk (r: 17, c: 26..28)
  for (let c = 26; c <= 28; c++) map[17][c] = 1;

  // Grandstand spectator shelter (r: 4..5, c: 24..28)
  for (let c = 24; c <= 28; c++) {
    map[4][c] = 1;
  }

  return map;
};

const COLLISION_GRID = createCollisionMap();

export const ClubMapCanvas: React.FC<ClubMapCanvasProps> = ({
  onInteractNPC,
  npcCompletionMap,
  onOpenHub,
  onOpenTraining,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state: starts near clubhouse entrance foyer
  const [player, setPlayer] = useState<PlayerPosition>({
    x: 11,
    y: 13,
    dir: 'up',
    isMoving: false,
  });

  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
  const [currentZoneName, setCurrentZoneName] = useState<string>('Clubhouse Foyer');
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const animationFrameRef = useRef<number | null>(null);
  const stepCycleRef = useRef<number>(0);

  // Determine which zone player is in
  const getZoneForPos = (x: number, y: number): string => {
    if (x <= 19 && y <= 15) {
      if (y <= 6 && x <= 11) return 'Committee Boardroom';
      if (y >= 6 && y <= 10 && x >= 7 && x <= 16) return 'Clubhouse Bar & Canteen';
      if (x >= 14 && y >= 9) return 'Lounge & Trophy Terrace';
      return 'Clubhouse Main Hall';
    }
    if (x > 19 && y <= 15) {
      if (y <= 7 && x >= 23) return 'Spectator Grandstand & Smoke-Free Zone';
      return 'Senior Oval & Match Pitch';
    }
    if (x <= 17 && y > 15) {
      if (x >= 11 && x <= 16 && y >= 17 && y <= 21) return 'Locker & Change Rooms';
      return 'Junior Academy Playing Field';
    }
    return 'Wellbeing Garden & Recovery Nook';
  };

  // Check collision
  const isTileBlocked = useCallback((tx: number, ty: number): boolean => {
    if (tx < 0 || tx >= MAP_COLS || ty < 0 || ty >= MAP_ROWS) return true;
    if (COLLISION_GRID[ty][tx] === 1) return true;
    // Check if an NPC is on this tile
    const hitNPC = NPCS.some((n) => n.x === tx && n.y === ty);
    return hitNPC;
  }, []);

  // Proximity check for NPC interaction
  const checkNearbyNPC = useCallback((px: number, py: number): NPC | null => {
    for (const npc of NPCS) {
      const dist = Math.hypot(npc.x - px, npc.y - py);
      if (dist <= 1.45) {
        return npc;
      }
    }
    return null;
  }, []);

  // Move handler
  const tryMove = useCallback(
    (dx: number, dy: number, dir: 'down' | 'up' | 'left' | 'right') => {
      setPlayer((prev) => {
        const nextX = prev.x + dx;
        const nextY = prev.y + dy;

        if (isTileBlocked(nextX, nextY)) {
          // Can still turn towards that direction
          const npc = checkNearbyNPC(prev.x, prev.y);
          setNearbyNPC(npc);
          return { ...prev, dir };
        }

        stepCycleRef.current = (stepCycleRef.current + 1) % 4;
        const newZone = getZoneForPos(nextX, nextY);
        setCurrentZoneName(newZone);

        const npc = checkNearbyNPC(nextX, nextY);
        setNearbyNPC(npc);

        return {
          x: nextX,
          y: nextY,
          dir,
          isMoving: true,
        };
      });
    },
    [isTileBlocked, checkNearbyNPC]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          tryMove(0, -1, 'up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          tryMove(0, 1, 'down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          tryMove(-1, 0, 'left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          tryMove(1, 0, 'right');
          break;
        case 'e':
        case 'E':
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (nearbyNPC) {
            sounds.playSelectSound();
            onInteractNPC(nearbyNPC);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, nearbyNPC, onInteractNPC]);

  // Click on canvas to walk towards tile
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const targetTx = Math.floor(clickX / TILE_SIZE);
    const targetTy = Math.floor(clickY / TILE_SIZE);

    // If clicked on or adjacent to an NPC, turn towards and interact if close
    const clickedNPC = NPCS.find(
      (n) => Math.hypot(n.x - targetTx, n.y - targetTy) <= 1.2
    );

    if (clickedNPC) {
      const dist = Math.hypot(player.x - clickedNPC.x, player.y - clickedNPC.y);
      if (dist <= 1.8) {
        sounds.playSelectSound();
        onInteractNPC(clickedNPC);
        return;
      }
    }

    // Step 1 tile towards target
    const dx = Math.sign(targetTx - player.x);
    const dy = Math.sign(targetTy - player.y);

    if (Math.abs(targetTx - player.x) >= Math.abs(targetTy - player.y)) {
      if (dx > 0) tryMove(1, 0, 'right');
      else if (dx < 0) tryMove(-1, 0, 'left');
    } else {
      if (dy > 0) tryMove(0, 1, 'down');
      else if (dy < 0) tryMove(0, -1, 'up');
    }
  };

  // Rendering Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let time = 0;
    const render = () => {
      time += 0.05;
      drawClubMap(ctx, player, nearbyNPC, npcCompletionMap, time);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [player, nearbyNPC, npcCompletionMap]);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Zone Header Banner & Fast Controls */}
      <div className="w-full max-w-5xl flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-t-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Current Location</span>
            <p className="text-sm font-bold text-white tracking-wide">{currentZoneName}</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600/50"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            onClick={onOpenTraining}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Training Modules</span>
          </button>

          <button
            onClick={onOpenHub}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Club-Dex Hub</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport Container */}
      <div className="relative border-x border-b border-slate-700 rounded-b-xl overflow-hidden bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={MAP_COLS * TILE_SIZE}
          height={MAP_ROWS * TILE_SIZE}
          onClick={handleCanvasClick}
          className="cursor-pointer max-w-full h-auto block"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Floating Proximity Action Button when near NPC */}
        {nearbyNPC && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/95 border-2 border-amber-400 rounded-xl px-4 py-2.5 shadow-xl animate-bounce">
            <MessageSquare className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-left pr-2">
              <p className="text-xs font-bold text-white">
                Talk to {nearbyNPC.name} ({nearbyNPC.role})
              </p>
              <p className="text-[11px] text-slate-300">
                Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-amber-300 font-mono text-[10px]">SPACE</kbd> or click Talk
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playSelectSound();
                onInteractNPC(nearbyNPC);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0 shadow-md"
            >
              Talk
            </button>
          </div>
        )}

        {/* Legend / Key overlay in corner */}
        <div className="hidden md:flex absolute top-3 right-3 flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 text-[11px] text-slate-300 pointer-events-none">
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1">Club Map Guide</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex w-3 h-3 items-center justify-center border border-slate-900 bg-amber-50 text-[8px] font-bold text-rose-600">…</span>
            <span>Speech bubble: Talk · !: Nearby</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Green ✓: Station Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"></span>
            <span>You: Club Champion (Arrow Keys / Click)</span>
          </div>
        </div>
      </div>

      {/* On-Screen Mobile / Touch Direction Controls */}
      <div className="mt-4 flex flex-col items-center gap-2 sm:hidden">
        <button
          onClick={() => tryMove(0, -1, 'up')}
          className="w-12 h-12 bg-slate-800 active:bg-slate-700 border border-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
        >
          ▲
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => tryMove(-1, 0, 'left')}
            className="w-12 h-12 bg-slate-800 active:bg-slate-700 border border-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
          >
            ◀
          </button>
          <button
            onClick={() => {
              if (nearbyNPC) {
                sounds.playSelectSound();
                onInteractNPC(nearbyNPC);
              }
            }}
            className={`w-12 h-12 border rounded-lg flex items-center justify-center font-bold text-xs shadow-md ${
              nearbyNPC
                ? 'bg-amber-400 border-amber-300 text-slate-950 animate-pulse'
                : 'bg-slate-800 border-slate-600 text-slate-400'
            }`}
          >
            ACT
          </button>
          <button
            onClick={() => tryMove(1, 0, 'right')}
            className="w-12 h-12 bg-slate-800 active:bg-slate-700 border border-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => tryMove(0, 1, 'down')}
          className="w-12 h-12 bg-slate-800 active:bg-slate-700 border border-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
        >
          ▼
        </button>
      </div>

      {/* Keyboard Controls Footer */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">Arrows</kbd> to Walk
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">E</kbd> to Interact
        </span>
        <span aria-hidden="true">·</span>
        <span>Click anywhere on map to step there</span>
      </div>
    </div>
  );
};
