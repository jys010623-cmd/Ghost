import { useEffect, useRef, useState } from "react";
import styles from "./CompletionModal.module.css";

interface CompletionModalProps {
  memoriesFound: number;
  onReset: () => void;
}

export function CompletionModal({ memoriesFound, onReset }: CompletionModalProps) {
  const [notice, setNotice] = useState("");
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
        aria-label="거실 청소 완료"
      >
        <div className={styles.crown} aria-hidden="true">
          🌙✨
        </div>
        <h2 className={styles.title}>거실 청소 완료!</h2>
        <p className={styles.msg}>
          몽실이 다시 편안하게{"\n"}잠들 수 있게 되었습니다.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>청소 완료도</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{memoriesFound}개</div>
            <div className={styles.statLabel}>발견한 추억</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            ref={btnRef}
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => setNotice("침실은 다음 업데이트에서 열립니다.")}
          >
            다음 방으로 →
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onReset}
          >
            처음부터 다시하기
          </button>
        </div>
        <div className={styles.notice} role="status" aria-live="polite">
          {notice}
        </div>
      </div>
    </div>
  );
}
