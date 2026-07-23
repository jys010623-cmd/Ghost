import { useCallback, useMemo, useState } from "react";
import type { CleanableItem } from "../types/game";
import { LIVING_ROOM_ITEMS } from "../data/roomData";

function buildInitialItems(saved?: Record<string, number>): CleanableItem[] {
  return LIVING_ROOM_ITEMS.map((item) => ({
    ...item,
    currentCleanValue:
      saved && item.id in saved ? saved[item.id] : item.maxCleanValue,
  }));
}

export function useGameProgress(savedValues?: Record<string, number>) {
  const [items, setItems] = useState<CleanableItem[]>(() =>
    buildInitialItems(savedValues),
  );

  /** 문지르기: 청소 수치를 amount 만큼 감소 */
  const rub = useCallback((id: string, amount: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, currentCleanValue: Math.max(0, it.currentCleanValue - amount) }
          : it,
      ),
    );
  }, []);

  /** 줍기: 즉시 청소 완료 */
  const pickUp = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, currentCleanValue: 0 } : it)),
    );
  }, []);

  const reset = useCallback(() => {
    setItems(buildInitialItems());
  }, []);

  const totalMax = useMemo(
    () => items.reduce((sum, it) => sum + it.maxCleanValue, 0),
    [items],
  );

  const cleanedAmount = useMemo(
    () => items.reduce((sum, it) => sum + (it.maxCleanValue - it.currentCleanValue), 0),
    [items],
  );

  /** 각 오브젝트의 현재 청소 수치를 기반으로 계산한 전체 진행도(0~100) */
  const progress = useMemo(
    () => (totalMax === 0 ? 0 : Math.round((cleanedAmount / totalMax) * 100)),
    [cleanedAmount, totalMax],
  );

  const remainingCount = useMemo(
    () => items.filter((it) => it.currentCleanValue > 0).length,
    [items],
  );

  const cleanValues = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) map[it.id] = it.currentCleanValue;
    return map;
  }, [items]);

  return {
    items,
    progress,
    remainingCount,
    cleanValues,
    rub,
    pickUp,
    reset,
  };
}
