import { useEffect, useRef, useState } from "react";
import type { DialogueContent } from "../../types/game";
import { GhostFace } from "../common/GhostFace";
import { AssetImage } from "../common/AssetImage";
import { ASSETS } from "../../data/assets";
import styles from "./DialogueBox.module.css";

interface DialogueBoxProps {
  content: DialogueContent;
  onClose: () => void;
}

export function DialogueBox({ content, onClose }: DialogueBoxProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLineIndex(0);
  }, [content.id]);

  useEffect(() => {
    nextRef.current?.focus();
  }, [content.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isLast = lineIndex >= content.lines.length - 1;

  const handleNext = () => {
    if (isLast) onClose();
    else setLineIndex((i) => i + 1);
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.box}
        role="dialog"
        aria-modal="true"
        aria-label={`${content.name}의 대화`}
      >
        <div className={styles.portrait}>
          <GhostFace mood={content.mood} size={68} />
          <AssetImage src={ASSETS.ui.dialogueGhostFrame} className={styles.frame} />
        </div>
        <div className={styles.body}>
          <div className={styles.name}>{content.name}</div>
          <p className={styles.line}>{content.lines[lineIndex]}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.close}`}
              onClick={onClose}
            >
              닫기
            </button>
            <button
              ref={nextRef}
              type="button"
              className={`${styles.btn} ${styles.next}`}
              onClick={handleNext}
            >
              {isLast ? "확인" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
