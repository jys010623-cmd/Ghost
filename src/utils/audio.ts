/**
 * 아주 가벼운 사운드 재생기.
 * 파일이 없거나 재생이 막혀도 절대 오류를 던지지 않는다.
 */

export type SoundKey =
  | "bgm"
  | "clean-dust"
  | "clean-stain"
  | "trash-pickup"
  | "ghost-happy"
  | "room-complete";

const SOUND_SRC: Record<SoundKey, string> = {
  bgm: "/assets/audio/bgm-room.mp3",
  "clean-dust": "/assets/audio/clean-dust.mp3",
  "clean-stain": "/assets/audio/clean-stain.mp3",
  "trash-pickup": "/assets/audio/trash-pickup.mp3",
  "ghost-happy": "/assets/audio/ghost-happy.mp3",
  "room-complete": "/assets/audio/room-complete.mp3",
};

let muted = false;
let bgm: HTMLAudioElement | null = null;
const cache = new Map<SoundKey, HTMLAudioElement>();

function makeAudio(key: SoundKey): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  try {
    const el = new Audio(SOUND_SRC[key]);
    el.addEventListener("error", () => {
      /* 파일 없음 — 무시 */
    });
    return el;
  } catch {
    return null;
  }
}

export function setMuted(value: boolean): void {
  muted = value;
  if (bgm) bgm.muted = value;
}

export function isMuted(): boolean {
  return muted;
}

export function playSound(key: SoundKey): void {
  if (muted) return;
  let el = cache.get(key);
  if (!el) {
    const created = makeAudio(key);
    if (!created) return;
    el = created;
    cache.set(key, el);
  }
  try {
    el.currentTime = 0;
    void el.play().catch(() => {});
  } catch {
    /* 무시 */
  }
}

export function startBgm(): void {
  if (bgm) return;
  const el = makeAudio("bgm");
  if (!el) return;
  bgm = el;
  bgm.loop = true;
  bgm.volume = 0.4;
  bgm.muted = muted;
  try {
    void bgm.play().catch(() => {});
  } catch {
    /* 무시 */
  }
}
