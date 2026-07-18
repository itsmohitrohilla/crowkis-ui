/**
 * Sound for the arcade, synthesised live with the Web Audio API, no audio
 * files to download or license. It works offline and stays in the Crowkis
 * spirit: one self-contained thing that never phones home. Crow caws, a punchy
 * kill blip, a rain bed, and a light energetic loop, all behind one mute switch.
 *
 * Browsers block audio until a user gesture, so call resume() from a click/keypress
 * (we do, on "start" and on the unmute toggle) before expecting sound.
 */

type Win = typeof window & { webkitAudioContext?: typeof AudioContext };

// A minor pentatonic, bass + a little lead arpeggio for the loop.
const BASS = [110, 110, 146.83, 110, 130.81, 110, 164.81, 110]; // A2 / D3 / C3 / E3
const LEAD = [440, 523.25, 659.25, 783.99, 659.25, 523.25]; // A4 C5 E5 G5 …

export class ArcadeAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private muted: boolean;

  private rainGain: GainNode | null = null;
  private rainSrc: AudioBufferSourceNode | null = null;

  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private musicGain: GainNode | null = null;
  private step = 0;

  constructor(muted = false) {
    this.muted = muted;
  }

  /** Build (lazily) and unsuspend the context, must run inside a user gesture. */
  resume() {
    if (!this.ctx) this.build();
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  private build() {
    const AC = window.AudioContext || (window as Win).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);

    // 2s of white noise, reused for rain hiss + caw rasp + hit thwack.
    const len = Math.floor(this.ctx.sampleRate * 2);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.9, t + 0.08);
    }
  }

  /** A harsh, descending crow caw, one or two syllables. */
  caw(golden = false) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t0 = ctx.currentTime;
    const syllables = golden ? 2 : 1 + (Math.random() < 0.4 ? 1 : 0);
    for (let s = 0; s < syllables; s++) {
      const t = t0 + s * 0.17;
      const dur = 0.16;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      const f0 = (golden ? 1040 : 840) + Math.random() * 120;
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + dur);

      // rasp: a fast square tremolo bent into the pitch
      const trem = ctx.createOscillator();
      trem.type = "square";
      trem.frequency.value = 55 + Math.random() * 25;
      const tremAmt = ctx.createGain();
      tremAmt.gain.value = 80;
      trem.connect(tremAmt).connect(osc.frequency);

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1500;
      bp.Q.value = 4;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(golden ? 0.55 : 0.45, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(bp).connect(g).connect(this.master);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      trem.start(t);
      trem.stop(t + dur + 0.02);
    }
  }

  /** Punchy blip the instant a crow is hit, then the crow's protest. */
  hit(golden = false) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = golden ? "triangle" : "square";
    osc.frequency.setValueAtTime(golden ? 1200 : 720, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(golden ? 0.5 : 0.4, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.16);

    const ns = ctx.createBufferSource();
    ns.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.3, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    ns.connect(hp).connect(ng).connect(this.master);
    ns.start(t);
    ns.stop(t + 0.1);

    this.caw(golden);
  }

  /** Rain bed: 0 = off, ~0.4 = rain, ~0.75 = storm. The source stays alive; we ride the gain. */
  setRain(level: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise) return;
    if (!this.rainSrc) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1800;
      const g = ctx.createGain();
      g.gain.value = 0;
      src.connect(lp).connect(g).connect(this.master);
      src.start();
      this.rainSrc = src;
      this.rainGain = g;
    }
    const target = Math.max(0, level) * 0.18;
    this.rainGain!.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.8);
  }

  /** A light, driving loop while a round is live. */
  startMusic() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.musicTimer) return;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.13;
    this.musicGain.connect(this.master);
    this.step = 0;
    // 16th notes at ~134 bpm
    const stepMs = 60000 / 134 / 4;
    this.musicTimer = setInterval(() => this.tick(), stepMs);
    this.tick();
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
    }
    this.musicGain = null;
  }

  private tick() {
    const ctx = this.ctx;
    const out = this.musicGain;
    if (!ctx || !out || !this.noise) return;
    const t = ctx.currentTime;
    const s = this.step % 16;

    // bass pulse on the strong steps
    if (s % 2 === 0) {
      const f = BASS[(s / 2) % BASS.length];
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.18);
    }

    // lead blips, syncopated
    if (s === 0 || s === 3 || s === 6 || s === 8 || s === 11 || s === 14) {
      const f = LEAD[this.step % LEAD.length];
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.32, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.14);
    }

    // hi-hat tick for drive
    const ns = ctx.createBufferSource();
    ns.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(s % 2 === 0 ? 0.12 : 0.06, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    ns.connect(hp).connect(ng).connect(out);
    ns.start(t);
    ns.stop(t + 0.06);

    this.step++;
  }

  /** Tear everything down on unmount. */
  dispose() {
    this.stopMusic();
    if (this.rainSrc) {
      try {
        this.rainSrc.stop();
      } catch {
        /* already stopped */
      }
      this.rainSrc = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
    this.master = null;
    this.noise = null;
  }
}
