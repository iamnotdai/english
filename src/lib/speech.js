import { useSyncExternalStore } from "react";

export const canSay = typeof window !== "undefined" && "speechSynthesis" in window;

// Shared playback state so dialogue lines can highlight while "Play whole dialogue" runs.
let state = { playing: false, line: -1 };
const subs = new Set();
const set = p => { state = { ...state, ...p }; subs.forEach(f => f()); };
const subscribe = f => { subs.add(f); return () => subs.delete(f); };
export const useSpeech = () => useSyncExternalStore(subscribe, () => state);

function utt(t, w, rate) {
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "en-US";
  u.rate = rate || .9;
  const vs = speechSynthesis.getVoices().filter(x => /^en/i.test(x.lang));
  const us = vs.filter(x => /^en[-_]US/i.test(x.lang));
  const pool = us.length > 1 ? us : vs;
  if (w == null) { if (pool[0]) u.voice = pool[0]; }
  else { if (pool.length > 1) u.voice = pool[w % 2 === 0 ? 0 : 1]; else if (pool[0]) u.voice = pool[0]; u.pitch = w ? .85 : 1.15; }
  return u;
}

// w: speaker index (0/1) to pick a voice, or null for the default voice.
export function say(t, w = null, rate) {
  if (!canSay || !t) return;
  try { speechSynthesis.cancel(); set({ playing: false, line: -1 }); speechSynthesis.speak(utt(t, w, rate)); } catch { /* unsupported */ }
}

export function playAll(lines) {
  if (!canSay) return;
  speechSynthesis.cancel();
  set({ playing: true, line: -1 });
  lines.forEach((l, i) => {
    const u = utt(l[1], l[0]);
    u.onstart = () => set({ line: i });
    if (i === lines.length - 1) u.onend = () => set({ playing: false, line: -1 });
    speechSynthesis.speak(u);
  });
}

export function stopAll() {
  if (canSay) { try { speechSynthesis.cancel(); } catch { /* unsupported */ } }
  if (state.playing || state.line !== -1) set({ playing: false, line: -1 });
}

if (canSay) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch { /* unsupported */ } }
