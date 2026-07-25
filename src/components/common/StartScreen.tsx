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
        오래되고 버려진 집,{"\n"}잠들지 못하는 유령 몽실.{"\n"}방을 하나씩 치우다
        보면…{"\n"}무언가 떠오를지도 몰라요.
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

      <p className={styles.hint}>가로 화면에서 즐기면 더 좋아요 · 도구는 숫자 키로도 선택</p>
    </div>
  );
}
