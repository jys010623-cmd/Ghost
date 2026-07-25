import { ASSETS } from "../../data/assets";
import { AssetImage } from "../common/AssetImage";
import styles from "./ProgressPanel.module.css";

interface ProgressPanelProps {
  progress: number;
  goal: string;
  remaining: number;
  muted: boolean;
  memoriesFound: number;
  onOpenCodex: () => void;
  onToggleMute: () => void;
  onReset: () => void;
}

export function ProgressPanel({
  progress,
  goal,
  remaining,
  muted,
  memoriesFound,
  onOpenCodex,
  onToggleMute,
  onReset,
}: ProgressPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.info}>
        <div className={styles.topline}>
          <span className={styles.goal}>
            <AssetImage src={ASSETS.ui.objectiveIcon} className={styles.goalIcon} />
            현재 목표: {goal}
          </span>
          <span className={styles.percent}>청소 진행도 {progress}%</span>
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={`청소 진행도 ${progress}%`}
        >
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.sub}>남은 오염물 {remaining}개</div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.ctrl}
          onClick={onOpenCodex}
          aria-label={`추억 보관함 (${memoriesFound}개 발견)`}
          title="추억 보관함"
        >
          📖
          {memoriesFound > 0 && <span className={styles.badge}>{memoriesFound}</span>}
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={onToggleMute}
          aria-label={muted ? "배경음 켜기" : "배경음 끄기"}
          aria-pressed={muted}
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={onReset}
          aria-label="게임 초기화"
          title="게임 초기화"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
