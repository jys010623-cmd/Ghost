import { useCallback, useRef, useState } from "react";

export type ParticleKind = "dust" | "sparkle";

export interface Particle {
  id: number;
  x: number; // 무대 기준 % 좌표
  y: number;
  dx: number; // 날아가는 방향 오프셋 (px)
  dy: number;
  rot: number; // 회전 각도 (deg)
  scale: number;
  life: number; // 지속 시간 (ms)
  img: string;
  kind: ParticleKind;
}

interface BurstOptions {
  count?: number;
  images?: readonly string[];
  kind?: ParticleKind;
  spread?: number; // 퍼지는 거리 (px)
  power?: number; // 세기 배수
}

// 화면에 동시에 존재할 수 있는 파티클 상한 (드래그 시 폭주 방지)
const MAX_PARTICLES = 60;

/**
 * 아주 가벼운 파티클 시스템.
 * burst()로 특정 위치에서 파티클을 터뜨리고,
 * 애니메이션이 끝나면 remove()로 스스로 정리된다.
 */
export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const burst = useCallback((x: number, y: number, opts: BurstOptions = {}) => {
    const count = opts.count ?? 4;
    const images = opts.images ?? [];
    const spread = opts.spread ?? 55;
    const power = opts.power ?? 1;
    const kind = opts.kind ?? "dust";

    setParticles((prev) => {
      const added: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = (0.4 + Math.random() * 0.6) * spread * power;
        added.push({
          id: nextId.current++,
          x,
          y,
          dx: Math.cos(angle) * dist,
          // 살짝 위로 떠오르며 흩어지도록 편향
          dy: Math.sin(angle) * dist - 18 * power,
          rot: Math.random() * 160 - 80,
          scale: 0.55 + Math.random() * 0.7,
          life: 520 + Math.random() * 260,
          img: images.length ? images[Math.floor(Math.random() * images.length)] : "",
          kind,
        });
      }
      const next = prev.concat(added);
      // 오래된 것부터 잘라내 상한 유지
      return next.length > MAX_PARTICLES
        ? next.slice(next.length - MAX_PARTICLES)
        : next;
    });
  }, []);

  return { particles, burst, remove };
}
