import { useEffect, useRef, useState } from "react";
import { GHOST_POSITIONS } from "../data/ghostData";
import type { GhostPosition } from "../types/game";

/**
 * 몇 초마다 몽실을 지정된 위치들로 부드럽게 이동시킨다.
 * active 가 false 이면 이동을 멈춘다(대화/완료 중).
 */
export function useGhostMovement(active: boolean, intervalMs = 5000) {
  const [position, setPosition] = useState<GhostPosition>(GHOST_POSITIONS[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      indexRef.current = (indexRef.current + 1) % GHOST_POSITIONS.length;
      setPosition(GHOST_POSITIONS[indexRef.current]);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  return position;
}
