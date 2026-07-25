import { useState, type CSSProperties } from "react";
import type { Particle } from "../../hooks/useParticles";
import styles from "./ParticleLayer.module.css";

interface ParticleLayerProps {
  particles: Particle[];
  onDone: (id: number) => void;
}

const KIND_COLOR: Record<Particle["kind"], string> = {
  dust: "rgba(150, 130, 100, 0.85)",
  sparkle: "rgba(255, 226, 150, 0.95)",
};

function ParticleView({ p, onDone }: { p: Particle; onDone: (id: number) => void }) {
  const [imgOk, setImgOk] = useState(Boolean(p.img));

  const style = {
    left: `${p.x}%`,
    top: `${p.y}%`,
    animationDuration: `${p.life}ms`,
    // CSS 키프레임이 참조하는 커스텀 속성
    "--dx": `${p.dx}px`,
    "--dy": `${p.dy}px`,
    "--rot": `${p.rot}deg`,
    "--scale": p.scale,
  } as CSSProperties;

  if (imgOk) {
    return (
      <img
        src={p.img}
        alt=""
        draggable={false}
        className={`${styles.particle} ${styles.img}`}
        style={style}
        onAnimationEnd={() => onDone(p.id)}
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${styles.particle} ${styles.dot}`}
      style={{ ...style, background: KIND_COLOR[p.kind] }}
      onAnimationEnd={() => onDone(p.id)}
    />
  );
}

/** 청소할 때 튀기는 티끌·반짝임을 렌더링하는 레이어. */
export function ParticleLayer({ particles, onDone }: ParticleLayerProps) {
  if (particles.length === 0) return null;
  return (
    <div className={styles.layer} aria-hidden="true">
      {particles.map((p) => (
        <ParticleView key={p.id} p={p} onDone={onDone} />
      ))}
    </div>
  );
}
