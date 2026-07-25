import { useEffect, useRef, useState } from "react";
import type { MemoryItem } from "../../types/game";
import { ALL_MEMORIES } from "../../data/memoryData";
import styles from "./MemoryCodex.module.css";

interface MemoryCodexProps {
  found: Set<string>;
  onClose: () => void;
}

function MemoryCard({ memory, isFound }: { memory: MemoryItem; isFound: boolean }) {
  const [imgOk, setImgOk] = useState(Boolean(memory.image));

  if (!isFound) {
    return (
      <div className={`${styles.card} ${styles.locked}`}>
        <div className={styles.thumb}>
          <span className={styles.lockIcon} aria-hidden="true">
            ？
          </span>
        </div>
        <div className={styles.cardTitle}>아직 발견하지 못한 추억</div>
        {memory.roomLabel && <div className={styles.room}>{memory.roomLabel}</div>}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        {imgOk && memory.image ? (
          <img
            src={memory.image}
            alt=""
            draggable={false}
            className={styles.photo}
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className={styles.icon} aria-hidden="true">
            {memory.icon}
          </span>
        )}
      </div>
      <div className={styles.cardTitle}>{memory.title}</div>
      <p className={styles.cardDesc}>{memory.description}</p>
      {memory.roomLabel && <div className={styles.room}>{memory.roomLabel}</div>}
    </div>
  );
}

/** 발견한 추억을 모아 보는 도감. */
export function MemoryCodex({ found, onClose }: MemoryCodexProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const foundCount = ALL_MEMORIES.filter((m) => found.has(m.id)).length;

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  // ESC 로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="추억 보관함"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>추억 보관함</h2>
          <span className={styles.count}>
            {foundCount} / {ALL_MEMORIES.length}
          </span>
        </header>

        <div className={styles.grid}>
          {ALL_MEMORIES.map((m) => (
            <MemoryCard key={m.id} memory={m} isFound={found.has(m.id)} />
          ))}
        </div>

        <button ref={btnRef} type="button" className={styles.close} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
