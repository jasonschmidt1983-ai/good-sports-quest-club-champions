/**
 * Retro 8-bit/16-bit Web Audio Sound Synthesizer
 * Inspired by classic handheld RPG games.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;

  constructor() {
    // Read mute preference if saved
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('gs_game_muted') === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.startBackgroundMusic();
  }

  private startBackgroundMusic() {
    if (this.isMuted || typeof window === 'undefined') return;
    if (!this.backgroundMusic) {
      this.backgroundMusic = new Audio(`${import.meta.env.BASE_URL}audio/club-grounds-loop.mp3`);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.preload = 'auto';
      this.backgroundMusic.volume = 0.22;
    }
    if (this.backgroundMusic.paused) {
      void this.backgroundMusic.play().catch(() => {
        // Browsers may defer playback until the next user gesture.
      });
    }
  }

  private stopBackgroundMusic() {
    this.backgroundMusic?.pause();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs_game_muted', String(this.isMuted));
    }
    if (this.isMuted) this.stopBackgroundMusic();
    else this.startBackgroundMusic();
    return this.isMuted;
  }

  // Pokémon-style dialogue typewriter chirp
  public playDialogueChirp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      // Slight pitch variance for retro feel
      const freq = 420 + Math.random() * 80;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext could be blocked by autoplay policies
    }
  }

  // UI button click / select
  public playSelectSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  // Soft handheld-console footstep, called once per successful tile move.
  public playFootstepSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const pitch = 185 + Math.random() * 28;
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(88, now + 0.055);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio errors when browser playback is unavailable.
    }
  }

  // Low, brief blip for a blocked tile or fence collision.
  public playCollisionSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(72, now + 0.075);
      gain.gain.setValueAtTime(0.028, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors when browser playback is unavailable.
    }
  }

  // Answer confirmed (Yes - Policy endorsed)
  public playSuccessSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.06, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.12);
      });
    } catch {
      // Ignore
    }
  }

  // Action item added (Not Yet)
  public playActionPlanSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.05, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.1);
      });
    } catch {
      // Ignore
    }
  }

  // Badge Unlock Fanfare (Classic Pokémon Gym Badge melody)
  public playBadgeFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Melody: C5, E5, G5, B5, C6, G5, C6
      const melody = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 987.77, d: 0.14 },
        { f: 1046.5, d: 0.22 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.45 },
      ];

      let elapsed = 0;
      melody.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, now + elapsed);

        gain.gain.setValueAtTime(0.08, now + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.001, now + elapsed + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + elapsed);
        osc.stop(now + elapsed + note.d);

        elapsed += note.d * 0.9;
      });
    } catch {
      // Ignore
    }
  }

  // Accreditation Signing Triumph (Silver / Gold Celebration)
  public playTriumphFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.14 },
        { f: 523.25, d: 0.14 },
        { f: 523.25, d: 0.14 },
        { f: 523.25, d: 0.35 },
        { f: 415.30, d: 0.28 },
        { f: 466.16, d: 0.28 },
        { f: 523.25, d: 0.2 },
        { f: 466.16, d: 0.1 },
        { f: 523.25, d: 0.6 },
      ];

      let elapsed = 0;
      fanfare.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f * 1.5, now + elapsed);

        gain.gain.setValueAtTime(0.09, now + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.001, now + elapsed + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);

        elapsed += n.d * 0.95;
      });
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundManager();
