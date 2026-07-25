import type { MemoryItem } from "../types/game";
import { FAMILY_PHOTO_MEMORY, MUSIC_BOX_MEMORY } from "./dialogueData";

/**
 * 게임에 존재하는 모든 추억. 도감(MemoryCodex)이 이 목록을 기준으로
 * 발견/미발견을 표시한다. 방이 늘어나면 여기에 추가하면 된다.
 */
export const ALL_MEMORIES: MemoryItem[] = [FAMILY_PHOTO_MEMORY, MUSIC_BOX_MEMORY];

/** 특정 방에 속한 추억 총 개수 */
export function roomMemoryTotal(roomId: string): number {
  return ALL_MEMORIES.filter((m) => m.roomId === roomId).length;
}

/** 특정 방에서 발견한 추억 개수 */
export function roomMemoryFound(roomId: string, found: Set<string>): number {
  return ALL_MEMORIES.filter((m) => m.roomId === roomId && found.has(m.id)).length;
}

/** 최대 별 개수 */
export const MAX_STARS = 3;

/**
 * 별점 계산 — 힐링 게임이라 벌점이 아닌 '따뜻한 보상'에 가깝다.
 * 1) 방 청소 완료 (항상)
 * 2) 꼼꼼하게: 잘못된 도구 사용이 적음
 * 3) 이 방의 추억을 모두 발견
 */
const MISTAKE_ALLOWANCE = 4;

export function computeStars(
  mistakes: number,
  memoriesFound: number,
  memoriesTotal: number,
): number {
  let stars = 1; // 완료
  if (mistakes <= MISTAKE_ALLOWANCE) stars += 1;
  if (memoriesTotal > 0 && memoriesFound >= memoriesTotal) stars += 1;
  return stars;
}

/** 별점에 따른 한 줄 코멘트 */
export function starComment(stars: number): string {
  if (stars >= 3) return "완벽해요! 몽실이 무척 행복해합니다.";
  if (stars === 2) return "아주 잘했어요. 방이 포근해졌어요.";
  return "방이 다시 따뜻해졌어요.";
}
