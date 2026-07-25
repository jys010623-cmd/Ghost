import { useEffect, useRef } from "react";
import { ASSETS } from "../../data/assets";
import { MAX_STARS, starComment } from "../../data/memoryData";
import { AssetImage } from "../common/AssetImage";
import styles from "./CompletionModal.module.css";

interface CompletionModalProps {
  roomName: string;
  isLastRoom: boolean;
  stars: number;
  memoriesFound: number;
  memoriesTotal: number;
  onOpenCodex: () => void;
  onNextRoom: () => void;
  onReset: () => void;
}

export function CompletionModal({
  roomName,
  isLastRoom,
  stars,
  memoriesFound,
  memoriesTotal,
  onOpenCodex,
  onNextRoom,
  onReset,
}: CompletionModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div className={styles.overlay}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label={`${roomName} 청소 완료`}
      >
        <AssetImage src={ASSETS.ui.roomCompleteDecoration} className={styles.deco} />
        <div className={styles.crown} aria-hidden="true">
          {isLastRoom ? "🌙✨" : "✨"}
        </div>
        <h2 className={styles.title}>
          {isLastRoom ? "모든 방 청소 완료!" : `${roomName} 청소 완료!`}
        </h2>

        <div
          className={styles.stars}
          role="img"
          aria-label={`별 ${stars} / ${MAX_STARS}개 획득`}
        >
          {Array.from({ length: MAX_STARS }, (_, i) => (
            <span
              key={i}
              className={`${styles.star} ${i < stars ? styles.starOn : styles.starOff}`}
              style={{ animationDelay: `${i * 0.18}s` }}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
        <p className={styles.msg}>
          {isLastRoom
            ? "몽실이 온 집에서 다시 편안하게 잠들 수 있게 되었습니다."
            : starComment(stars)}
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>청소 완료도</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>
              {memoriesFound}/{memoriesTotal}
            </div>
            <div className={styles.statLabel}>{roomName}의 추억</div>
          </div>
        </div>

        <div className={styles.actions}>
          {!isLastRoom && (
            <button
              ref={btnRef}
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={onNextRoom}
            >
              다음 방으로 →
            </button>
          )}
          <button
            ref={isLastRoom ? btnRef : undefined}
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onOpenCodex}
          >
            추억 보관함 열기
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onReset}
          >
            처음부터 다시하기
          </button>
        </div>
      </div>
    </div>
  );
}
