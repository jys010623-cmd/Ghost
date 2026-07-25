import { useCallback } from "react";
import type { CleanableItem, CleaningTool } from "../types/game";
import { playSound } from "../utils/audio";

const RUB_AMOUNT = 14;

export type InteractPhase = "down" | "move";

interface UseCleaningArgs {
  selectedTool: CleaningTool;
  locked: boolean;
  rub: (id: string, amount: number) => void;
  pickUp: (id: string) => void;
  onWrongTool: (item: CleanableItem) => void;
  onCleaned: (item: CleanableItem) => void;
  /** 올바른 도구로 문지르거나 주울 때마다 (연출용). */
  onRub?: (item: CleanableItem) => void;
}

/**
 * 청소 상호작용 규칙을 한곳에 모은다.
 * CleanableItem 이 pointer 이벤트에서 이 핸들러를 호출한다.
 */
export function useCleaning({
  selectedTool,
  locked,
  rub,
  pickUp,
  onWrongTool,
  onCleaned,
  onRub,
}: UseCleaningArgs) {
  return useCallback(
    (item: CleanableItem, phase: InteractPhase) => {
      if (locked) return;
      if (item.currentCleanValue <= 0) return;

      // 잘못된 도구 — 청소되지 않고 안내만
      if (item.requiredTool !== selectedTool) {
        if (phase === "down") onWrongTool(item);
        return;
      }

      // 쓰레기: 손으로 클릭해서 줍기 (한 번에)
      if (item.type === "trash") {
        if (phase === "down") {
          pickUp(item.id);
          playSound("trash-pickup");
          onRub?.(item);
          onCleaned(item);
        }
        return;
      }

      // 먼지 / 거미줄 / 얼룩: 문질러서 청소
      const before = item.currentCleanValue;
      rub(item.id, RUB_AMOUNT);
      onRub?.(item);
      if (phase === "down") {
        playSound(item.type === "stain" ? "clean-stain" : "clean-dust");
      }
      if (before > 0 && before - RUB_AMOUNT <= 0) {
        onCleaned(item);
      }
    },
    [locked, selectedTool, rub, pickUp, onWrongTool, onCleaned, onRub],
  );
}
