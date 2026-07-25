import { useEffect, useMemo, useState } from "react";
import type { GhostMood, GhostPosition } from "../../types/game";
import { GHOST_IMAGES, GHOST_NAME } from "../../data/ghostData";
import { ASSETS } from "../../data/assets";
import { AssetImage } from "../common/AssetImage";
import styles from "./Ghost.module.css";

interface GhostProps {
  mood: GhostMood;
  position: GhostPosition;
  jumping?: boolean;
  /** 청소 지점으로 이동해 문지르는 모션 중인지 */
  working?: boolean;
}

const MOOD_CLASS: Record<GhostMood, string> = {
  normal: "",
  sad: styles.sad,
  happy: styles.happy,
  surprised: styles.surprised,
  sleep: styles.sleep,
};

// 프레임 애니메이션이 있는 기분만 지정. 나머지는 정적 표정 이미지 사용.
function framesForMood(mood: GhostMood): readonly string[] | null {
  if (mood === "happy") return ASSETS.ghostAnim.happyBounce;
  if (mood === "normal") return ASSETS.ghostAnim.idleFloat;
  return null;
}

const FRAME_MS: Record<"happy" | "idle", number> = { happy: 110, idle: 170 };

const prefersReducedMotion =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Ghost({ mood, position, jumping, working }: GhostProps) {
  const [imgOk, setImgOk] = useState(true); // 정적 표정 이미지 로드 여부
  const [animOk, setAnimOk] = useState(true); // 프레임 애니메이션 사용 가능 여부
  const [frame, setFrame] = useState(0);

  const frames = useMemo(() => framesForMood(mood), [mood]);
  // 프레임이 있고, 이전에 로드 실패한 적 없고, 모션 감소 설정이 아니면 프레임 사용
  const showFrames = Boolean(frames) && animOk && !prefersReducedMotion;

  // 표정이 바뀌면 로드 상태와 프레임 인덱스를 초기화
  useEffect(() => {
    setImgOk(true);
    setAnimOk(true);
    setFrame(0);
  }, [mood]);

  // 프레임 순환
  useEffect(() => {
    if (!showFrames || !frames) return;
    const ms = mood === "happy" ? FRAME_MS.happy : FRAME_MS.idle;
    const timer = window.setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [showFrames, frames, mood]);

  const staticSrc = GHOST_IMAGES[mood];
  const src = showFrames && frames ? frames[frame] : staticSrc;

  const handleError = () => {
    if (showFrames) {
      // 프레임 로드 실패 → 정적 표정 이미지로 폴백
      setAnimOk(false);
    } else {
      // 정적 이미지도 없음 → CSS 플레이스홀더로
      setImgOk(false);
    }
  };

  // 우선순위: 완료 점프 > 청소 모션 > 프레임 애니메이션 > 기본 bob
  const floatClass = [
    styles.float,
    jumping
      ? styles.jump
      : working
        ? styles.working
        : showFrames && imgOk
          ? styles.noBob
          : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`${styles.anchor} ${working ? styles.focusing : ""}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      aria-label={`유령 ${GHOST_NAME}`}
      role="img"
    >
      <div className={floatClass}>
        <AssetImage
          src={ASSETS.effects.ghostGlow}
          className={styles.glow}
          style={{ opacity: mood === "happy" ? 0.9 : 0.4 }}
        />
        {imgOk ? (
          <img
            className={styles.image}
            src={src}
            alt=""
            draggable={false}
            onError={handleError}
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
