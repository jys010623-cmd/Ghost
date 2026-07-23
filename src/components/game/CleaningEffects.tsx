import { useState } from "react";
import { ASSETS } from "../../data/assets";
import { AssetImage } from "../common/AssetImage";
import styles from "./CleaningEffects.module.css";

const SPARKLES = [
  { x: 20, y: 30, delay: 0, img: ASSETS.effects.sparkleSmall01 },
  { x: 72, y: 24, delay: 0.4, img: ASSETS.effects.sparkleSmall02 },
  { x: 45, y: 18, delay: 0.8, img: ASSETS.effects.sparkleSmall01 },
  { x: 60, y: 45, delay: 0.2, img: ASSETS.effects.sparkleSmall02 },
  { x: 30, y: 55, delay: 1.1, img: ASSETS.effects.sparkleSmall01 },
  { x: 84, y: 50, delay: 0.6, img: ASSETS.effects.sparkleSmall02 },
  { x: 12, y: 60, delay: 1.4, img: ASSETS.effects.sparkleSmall01 },
  { x: 52, y: 62, delay: 0.9, img: ASSETS.effects.sparkleSmall02 },
  { x: 38, y: 38, delay: 1.7, img: ASSETS.effects.sparkleSmall01 },
  { x: 78, y: 68, delay: 1.2, img: ASSETS.effects.sparkleSmall02 },
];

function Sparkle({ x, y, delay, img }: { x: number; y: number; delay: number; img: string }) {
  const [imgOk, setImgOk] = useState(true);
  const common = {
    className: styles.sparkle,
    style: { left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` },
  };
  if (imgOk) {
    return (
      <img {...common} src={img} alt="" draggable={false} onError={() => setImgOk(false)} />
    );
  }
  return (
    <span {...common} aria-hidden="true">
      ✨
    </span>
  );
}

interface CleaningEffectsProps {
  active: boolean;
}

export function CleaningEffects({ active }: CleaningEffectsProps) {
  if (!active) return null;
  return (
    <div className={styles.effects} aria-hidden="true">
      <div className={styles.warmLight} />
      <AssetImage src={ASSETS.effects.cleanShine} className={styles.shine} />
      <AssetImage src={ASSETS.effects.sparkleCluster} className={styles.cluster} />
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}
    </div>
  );
}
