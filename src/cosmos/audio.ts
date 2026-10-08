import { useCosmos } from "@/cosmos/store";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensure(): void {
  if (ctx || typeof window === "undefined") return;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  ctx = new Ctx();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const low = ctx.createOscillator();
  low.type = "sine";
  low.frequency.value = 55;
  const lowGain = ctx.createGain();
  lowGain.gain.value = 0.2;
  low.connect(lowGain).connect(master);

  const fifth = ctx.createOscillator();
  fifth.type = "sine";
  fifth.frequency.value = 82.5;
  const fifthGain = ctx.createGain();
  fifthGain.gain.value = 0.07;
  fifth.connect(fifthGain).connect(master);

  const air = ctx.createOscillator();
  air.type = "sine";
  air.frequency.value = 196;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.012;
  air.connect(airGain).connect(master);

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;
  noise.connect(filter).connect(noiseGain).connect(master);

  low.start();
  fifth.start();
  air.start();
  noise.start();

  const drift = () => {
    if (!ctx) return;
    filter.frequency.setTargetAtTime(220 + Math.random() * 500, ctx.currentTime, 2.4);
    window.setTimeout(drift, 5000);
  };
  drift();
}

function fade(value: number, seconds: number): void {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(value, ctx.currentTime, seconds);
}

export function enableSound(): void {
  ensure();
  void ctx?.resume();
  useCosmos.getState().setSound(true);
}

export function bindAmbience(): () => void {
  return useCosmos.subscribe((state, prev) => {
    if (prev && state.sound === prev.sound) return;
    if (!state.sound) {
      fade(0, 0.2);
      return;
    }
    ensure();
    void ctx?.resume();
    fade(0.16, 0.7);
  });
}
