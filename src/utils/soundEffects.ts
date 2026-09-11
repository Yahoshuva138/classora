/**
 * Web Audio API Synth Sound Effects
 * Crisp, clean synthetic sound cues without external mp3 assets
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.5;

  constructor() {
    // Check localStorage preference - default to polite mute (false) for academic environments
    const saved = localStorage.getItem('classora_sound_enabled');
    this.enabled = saved !== null ? saved === 'true' : false;
    const savedVol = localStorage.getItem('classora_sound_volume');
    this.volume = savedVol !== null ? Math.max(0, Math.min(1, parseFloat(savedVol))) : 0.5;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('classora_sound_volume', String(this.volume));
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('classora_sound_enabled', String(this.enabled));
    if (this.enabled) {
      this.playSuccess();
    }
    return this.enabled;
  }

  public playPop() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext unavailable
    }
  }

  public playSuccess() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + i * 0.06;
        gain.gain.setValueAtTime(0.09 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  public playFanfare() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5]; // Major chord
      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  public playCelebration() {
    this.playFanfare();
  }
}

export const soundFx = new SoundManager();
