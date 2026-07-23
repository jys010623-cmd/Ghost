import { useEffect, useRef } from "react";
import type { MemoryItem } from "../../types/game";
import styles from "./MemoryPopup.module.css";

interface MemoryPopupProps {
  memory: MemoryItem;
  onClose: () => void;
}

export function MemoryPopup({ memory, onClose }: MemoryPopupProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label="추억 발견">
        <div className={styles.badge}>추억을 발견했습니다</div>
        <div className={styles.icon} aria-hidden="true">
          {memory.icon}
        </div>
        <div className={styles.title}>{memory.title}</div>
        <p className={styles.desc}>{memory.description}</p>
        <button ref={btnRef} type="button" className={styles.btn} onClick={onClose}>
          간직하기
        </button>
      </div>
    </div>
  );
}
