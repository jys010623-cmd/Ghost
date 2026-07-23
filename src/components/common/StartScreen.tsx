import { useState } from "react";
import { GhostFace } from "./GhostFace";
import { AssetImage } from "./AssetImage";
import { ASSETS } from "../../data/assets";
import styles from "./StartScreen.module.css";

interface StartScreenProps {
  hasSave: boolean;
  onStart: () => void;
  onNewGame: () => void;
}

export function StartScreen({ hasSave, onStart, onNewGame }: StartScreenProps) {
  const [heroOk, setHeroOk] = useState(true);
  return (
    <div className={styles.screen}>
      <AssetImage src={ASSETS.title.background} className={styles.bg} />
      <div className={styles.ghostWrap}>
        {heroOk ? (
          <img
            className={styles.hero}
            src={ASSETS.title.mongsil}
            alt=""
            draggable={false}
            onError={() => setHeroOk(false)}
          />
        ) : (
          <GhostFace mood="sleep" size={110} />
        )}
      </div>
      <h1 className={styles.title}>몽실의 방</h1>
      <p className={styles.sub}>
        오래되고 버려진 집에{"\n"}외로운 유령 몽실이 살고 있어요.{"\n"}방을 청소해 다시
        따뜻한 공간으로 되돌려 주세요.
      </p>

      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={onStart}>
          {hasSave ? "이어서 청소하기" : "청소 시작하기"}
        </button>
        {hasSave && (
          <button type="button" className={`${styles.btn} ${styles.ghostBtn}`} onClick={onNewGame}>
            처음부터 새로 시작
          </button>
        )}
      </div>

      <p className={styles.hint}>가로 화면에서 즐기면 더 좋아요 · 도구는 1~4 키로도 선택</p>
    </div>
  );
}
