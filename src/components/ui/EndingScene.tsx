import { useEffect, useRef } from "react";
import { GhostFace } from "../common/GhostFace";
import styles from "./EndingScene.module.css";

interface EndingSceneProps {
  memoriesFound: number;
  memoriesTotal: number;
  onOpenCodex: () => void;
  onReset: () => void;
}

/**
 * 게임의 마지막 방까지 청소한 뒤 보여주는 결말 연출.
 *
 * NOTE: 몽실의 구체적 정체·결말 대사는 아직 미확정("일부만 정하고 다음에 확정").
 * 아래 NARRATION 텍스트만 교체하면 최종 서사를 확정할 수 있도록 분리해 두었다.
 */
const NARRATION_ALL = [
  "먼지를 다 걷어내고 나서야 알았어.",
  "낯익은 냄새, 익숙한 손길, 정든 방들…\n여기는, 내가 살던 집이었어.",
  "이제 다 기억나. 참 행복했었지.\n고마워… 덕분에 편히 쉴 수 있겠어. 잘 자.",
];

const NARRATION_PARTIAL = [
  "먼지를 걷어내니 어렴풋이 떠올라.",
  "다 기억나진 않지만…\n여기가 내게 아주 소중한 집이었다는 건, 이제 알 것 같아.",
  "언젠가 남은 기억도 만나겠지.\n고마워… 이제 조금은 편히 쉴 수 있어.",
];

export function EndingScene({
  memoriesFound,
  memoriesTotal,
  onOpenCodex,
  onReset,
}: EndingSceneProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const allFound = memoriesFound >= memoriesTotal;
  const lines = allFound ? NARRATION_ALL : NARRATION_PARTIAL;

  useEffect(() => {
    btnRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.starfield} aria-hidden="true" />
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="이야기의 끝"
      >
        <div className={styles.face}>
          <GhostFace mood="sleep" size={96} />
        </div>

        <h2 className={styles.title}>몽실의 기억</h2>

        <div className={styles.narration}>
          {lines.map((line, i) => (
            <p key={i} className={styles.line}>
              {line}
            </p>
          ))}
        </div>

        <div className={styles.count}>
          되찾은 기억 <b>{memoriesFound}</b> / {memoriesTotal}
        </div>

        <div className={styles.actions}>
          <button
            ref={btnRef}
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={onOpenCodex}
          >
            추억 보관함 보기
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
