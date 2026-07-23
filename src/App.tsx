import { useCallback, useState } from "react";
import { StartScreen } from "./components/common/StartScreen";
import { GameScene } from "./components/game/GameScene";
import { useAudio } from "./hooks/useAudio";
import { clearSave, loadSave, type SaveData } from "./utils/storage";
import styles from "./App.module.css";

type Phase = "start" | "playing";

export default function App() {
  const [save, setSave] = useState<SaveData | null>(() => loadSave());
  const [phase, setPhase] = useState<Phase>("start");
  const [gameKey, setGameKey] = useState(0);
  const { muted, toggleMuted } = useAudio(save?.muted ?? false);

  const hasSave = !!save && !save.completed;

  const handleStart = useCallback(() => {
    setPhase("playing");
  }, []);

  const handleNewGame = useCallback(() => {
    clearSave();
    setSave(null);
    setGameKey((k) => k + 1);
    setPhase("playing");
  }, []);

  const handleExitToStart = useCallback(() => {
    clearSave();
    setSave(null);
    setGameKey((k) => k + 1);
    setPhase("start");
  }, []);

  return (
    <div className={styles.viewport}>
      <div className={styles.stage}>
        {phase === "start" ? (
          <StartScreen
            hasSave={hasSave}
            onStart={handleStart}
            onNewGame={handleNewGame}
          />
        ) : (
          <GameScene
            key={gameKey}
            initialSave={save}
            muted={muted}
            onToggleMute={toggleMuted}
            onExitToStart={handleExitToStart}
          />
        )}
      </div>
    </div>
  );
}
