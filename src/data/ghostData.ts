import type { GhostMood, GhostPosition } from "../types/game";

export const GHOST_NAME = "몽실";

/** 몽실이 방 안에서 순회하는 위치 (퍼센트 좌표) */
export const GHOST_POSITIONS: GhostPosition[] = [
  { x: 58, y: 40 },
  { x: 30, y: 32 },
  { x: 68, y: 55 },
  { x: 45, y: 25 },
  { x: 72, y: 34 },
];

/** 표정별 이미지 경로 — 없으면 CSS 플레이스홀더로 대체된다 */
export const GHOST_IMAGES: Record<GhostMood, string> = {
  normal: "/assets/ghosts/mongsil/mongsil-normal.png",
  sad: "/assets/ghosts/mongsil/mongsil-sad.png",
  happy: "/assets/ghosts/mongsil/mongsil-happy.png",
  surprised: "/assets/ghosts/mongsil/mongsil-surprised.png",
  sleep: "/assets/ghosts/mongsil/mongsil-sleep.png",
};

/** 진행도(0~100)에 따른 표정 */
export function moodForProgress(progress: number): GhostMood {
  if (progress >= 100) return "happy";
  if (progress >= 70) return "surprised";
  if (progress >= 30) return "normal";
  return "sad";
}

/** 진행도가 속한 대사 구간 인덱스 (0:sad 1:normal 2:surprised 3:done) */
export function stageForProgress(progress: number): number {
  if (progress >= 100) return 3;
  if (progress >= 70) return 2;
  if (progress >= 30) return 1;
  return 0;
}
