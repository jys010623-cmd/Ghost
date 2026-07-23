import { useEffect, useState } from "react";
import type { GhostMood } from "../../types/game";
import { GHOST_IMAGES } from "../../data/ghostData";
import styles from "./GhostFace.module.css";

const MOOD_EMOJI: Record<GhostMood, string> = {
  normal: "👻",
  sad: "😔",
  happy: "😊",
  surprised: "😮",
  sleep: "😴",
};

interface GhostFaceProps {
  mood: GhostMood;
  size?: number;
}

export function GhostFace({ mood, size = 64 }: GhostFaceProps) {
  const [imgOk, setImgOk] = useState(true);
  useEffect(() => setImgOk(true), [mood]);

  return (
    <div className={styles.face} style={{ width: size, height: size, fontSize: size }}>
      {imgOk ? (
        <img
          className={styles.img}
          src={GHOST_IMAGES[mood]}
          alt=""
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className={styles.emoji} aria-hidden="true">
          {MOOD_EMOJI[mood]}
        </span>
      )}
    </div>
  );
}
