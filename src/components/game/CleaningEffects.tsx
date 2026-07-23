import styles from "./CleaningEffects.module.css";

const SPARKLES = [
  { x: 20, y: 30, delay: 0 },
  { x: 72, y: 24, delay: 0.4 },
  { x: 45, y: 18, delay: 0.8 },
  { x: 60, y: 45, delay: 0.2 },
  { x: 30, y: 55, delay: 1.1 },
  { x: 84, y: 50, delay: 0.6 },
  { x: 12, y: 60, delay: 1.4 },
  { x: 52, y: 62, delay: 0.9 },
  { x: 38, y: 38, delay: 1.7 },
  { x: 78, y: 68, delay: 1.2 },
];

interface CleaningEffectsProps {
  active: boolean;
}

export function CleaningEffects({ active }: CleaningEffectsProps) {
  if (!active) return null;
  return (
    <div className={styles.effects} aria-hidden="true">
      <div className={styles.warmLight} />
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={styles.sparkle}
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s` }}
        >
          ✨
        </span>
      ))}
    </div>
  );
}
