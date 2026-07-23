import { useEffect, useState } from "react";
import type { GhostMood, GhostPosition } from "../../types/game";
import { GHOST_IMAGES, GHOST_NAME } from "../../data/ghostData";
import styles from "./Ghost.module.css";

interface GhostProps {
  mood: GhostMood;
  position: GhostPosition;
  jumping?: boolean;
}

const MOOD_CLASS: Record<GhostMood, string> = {
  normal: "",
  sad: styles.sad,
  happy: styles.happy,
  surprised: styles.surprised,
  sleep: styles.sleep,
};

export function Ghost({ mood, position, jumping }: GhostProps) {
  const [imgOk, setImgOk] = useState(true);

  // 표정이 바뀌면 이미지 로드를 다시 시도
  useEffect(() => {
    setImgOk(true);
  }, [mood]);

  return (
    <div
      className={styles.anchor}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      aria-label={`유령 ${GHOST_NAME}`}
      role="img"
    >
      <div className={`${styles.float} ${jumping ? styles.jump : ""}`}>
        {imgOk ? (
          <img
            className={styles.image}
            src={GHOST_IMAGES[mood]}
            alt=""
            draggable={false}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className={`${styles.blob} ${MOOD_CLASS[mood]}`}>
            <div className={styles.eyes}>
              <span className={styles.eye} />
              <span className={styles.eye} />
            </div>
            <span className={`${styles.cheek} ${styles.left}`} />
            <span className={`${styles.cheek} ${styles.right}`} />
            <span className={styles.mouth} />
          </div>
        )}
      </div>
    </div>
  );
}
