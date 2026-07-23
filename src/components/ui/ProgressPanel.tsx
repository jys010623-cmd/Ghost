import { ROOM_GOAL } from "../../data/roomData";
import { ASSETS } from "../../data/assets";
import { AssetImage } from "../common/AssetImage";
import styles from "./ProgressPanel.module.css";

interface ProgressPanelProps {
  progress: number;
  remaining: number;
  muted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
}

export function ProgressPanel({
  progress,
  remaining,
  muted,
  onToggleMute,
  onReset,
}: ProgressPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.info}>
        <div className={styles.topline}>
          <span className={styles.goal}>
            <AssetImage src={ASSETS.ui.objectiveIcon} className={styles.goalIcon} />
            현재 목표: {ROOM_GOAL}
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
