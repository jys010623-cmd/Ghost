import { useState } from "react";
import {
  ROOM_CLEAN_IMAGE,
  ROOM_DIRTY_IMAGE,
  cleanBackgroundOpacity,
} from "../../data/roomData";
import styles from "./RoomBackground.module.css";

interface RoomBackgroundProps {
  progress: number;
}

/** CSS 로 그린 방 (이미지가 없을 때의 폴백) */
function RoomPlaceholder({ variant }: { variant: "dirty" | "clean" }) {
  return (
    <div className={`${styles.layer} ${styles[variant]}`}>
      <div className={styles.wall} />
      <div className={styles.floor} />
      <div className={styles.rug} />
    </div>
  );
}

export function RoomBackground({ progress }: RoomBackgroundProps) {
  const [dirtyOk, setDirtyOk] = useState(true);
  const [cleanOk, setCleanOk] = useState(true);
  const cleanOpacity = cleanBackgroundOpacity(progress);
  const gloomOpacity = Math.max(0, 1 - progress / 100);

  return (
    <div className={styles.room} aria-hidden="true">
      {/* 더러운 방 (기본) */}
      <RoomPlaceholder variant="dirty" />
      {dirtyOk && (
        <img
          className={styles.layerImg}
          src={ROOM_DIRTY_IMAGE}
          alt=""
          onError={() => setDirtyOk(false)}
        />
      )}

      {/* 깨끗한 방 (진행도에 따라 서서히 나타남) */}
      <div className={styles.cleanLayer} style={{ opacity: cleanOpacity }}>
        <RoomPlaceholder variant="clean" />
        {cleanOk && (
          <img
            className={styles.layerImg}
            src={ROOM_CLEAN_IMAGE}
            alt=""
            onError={() => setCleanOk(false)}
          />
        )}
      </div>

      {/* 어둡고 차가운 필터 */}
      <div className={styles.gloom} style={{ opacity: gloomOpacity }} />
    </div>
  );
}
