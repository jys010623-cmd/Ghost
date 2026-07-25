import { useState } from "react";
import type { RoomTheme } from "../../types/game";
import { cleanBackgroundOpacity } from "../../data/roomData";
import { ASSETS } from "../../data/assets";
import { AssetImage } from "../common/AssetImage";
import styles from "./RoomBackground.module.css";

interface RoomBackgroundProps {
  progress: number;
  theme: RoomTheme;
  dirtyImage?: string;
  cleanImage?: string;
}

/** CSS 로 그린 방 (이미지가 없을 때의 폴백) */
function RoomPlaceholder({
  variant,
  theme,
}: {
  variant: "dirty" | "clean";
  theme: RoomTheme;
}) {
  return (
    <div className={`${styles.layer} ${styles[variant]} ${styles[theme]}`}>
      <div className={styles.wall} />
      <div className={styles.floor} />
      {theme === "bedroom" ? (
        <>
          <div className={styles.bed} />
          <div className={styles.pillow} />
        </>
      ) : (
        <div className={styles.rug} />
      )}
    </div>
  );
}

export function RoomBackground({
  progress,
  theme,
  dirtyImage,
  cleanImage,
}: RoomBackgroundProps) {
  const [dirtyOk, setDirtyOk] = useState(Boolean(dirtyImage));
  const [cleanOk, setCleanOk] = useState(Boolean(cleanImage));
  const cleanOpacity = cleanBackgroundOpacity(progress);
  const gloomOpacity = Math.max(0, 1 - progress / 100);

  return (
    <div className={styles.room} aria-hidden="true">
      {/* 더러운 방 (기본) */}
      <RoomPlaceholder variant="dirty" theme={theme} />
      {dirtyImage && dirtyOk && (
        <img
          className={styles.layerImg}
          src={dirtyImage}
          alt=""
          onError={() => setDirtyOk(false)}
        />
      )}

      {/* 깨끗한 방 (진행도에 따라 서서히 나타남) */}
      <div className={styles.cleanLayer} style={{ opacity: cleanOpacity }}>
        <RoomPlaceholder variant="clean" theme={theme} />
        {cleanImage && cleanOk && (
          <img
            className={styles.layerImg}
            src={cleanImage}
            alt=""
            onError={() => setCleanOk(false)}
          />
        )}
      </div>

      {/* 어둡고 차가운 필터 */}
      <div className={styles.gloom} style={{ opacity: gloomOpacity }} />

      {/* 창빛 + 따뜻한 조명 오버레이 — 진행도에 따라 점점 밝아진다 */}
      <AssetImage
        src={ASSETS.overlays.window}
        className={styles.overlay}
        style={{ opacity: 0.25 + (progress / 100) * 0.4 }}
      />
      <AssetImage
        src={ASSETS.overlays.warm90}
        className={styles.overlayWarm}
        style={{ opacity: (progress / 100) * 0.85 }}
      />
      <AssetImage
        src={ASSETS.overlays.fireplace}
        className={styles.overlayWarm}
        style={{ opacity: progress >= 60 ? ((progress - 60) / 40) * 0.7 : 0 }}
      />
    </div>
  );
}
