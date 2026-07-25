import { useCallback, useState } from "react";
import { StartScreen } from "./components/common/StartScreen";
import { GameScene } from "./components/game/GameScene";
import { ROOMS } from "./data/roomData";
import { useAudio } from "./hooks/useAudio";
import { clearSave, loadSave, writeSave, type SaveData } from "./utils/storage";
import styles from "./App.module.css";

type Phase = "start" | "playing";

const clampRoom = (i: number) => Math.min(Math.max(i, 0), ROOMS.length - 1);

export default function App() {
  const [save, setSave] = useState<SaveData | null>(() => loadSave());
  const [phase, setPhase] = useState<Phase>("start");
  const [roomIndex, setRoomIndex] = useState(() => clampRoom(save?.roomIndex ?? 0));
  const [gameKey, setGameKey] = useState(0);
  const { muted, toggleMuted } = useAudio(save?.muted ?? false);

  // 게임 전체가 끝난 세이브(마지막 방까지 완료)면 '이어하기'를 제공하지 않는다
  const gameFinished =
    !!save && save.completed && clampRoom(save.roomIndex ?? 0) >= ROOMS.length - 1;
  const hasSave = !!save && !gameFinished;

  const handleStart = useCallback(() => {
    setRoomIndex(clampRoom(save?.roomIndex ?? 0));
    setPhase("playing");
  }, [save]);

  const handleNewGame = useCallback(() => {
    clearSave();
    setSave(null);
    setRoomIndex(0);
    setGameKey((k) => k + 1);
    setPhase("playing");
  }, []);

  const handleExitToStart = useCallback(() => {
    clearSave();
    setSave(null);
    setRoomIndex(0);
    setGameKey((k) => k + 1);
    setPhase("start");
  }, []);

  const handleNextRoom = useCallback(() => {
    const next = roomIndex + 1;
    if (next >= ROOMS.length) {
      handleExitToStart();
      return;
    }
    // 다음 방을 위한 세이브 — 발견한 추억은 유지, 방별 상태는 초기화
    const carried: SaveData = {
      phase: "playing",
      roomIndex: next,
      cleanValues: save?.cleanValues ?? {},
      shownStages: [],
      introSeen: false,
      memoryFound: save?.memoryFound ?? false,
      foundMemories: save?.foundMemories ?? [],
      mistakes: 0,
      muted,
      completed: false,
    };
    writeSave(carried);
    setSave(carried);
    setRoomIndex(next);
    setGameKey((k) => k + 1);
  }, [roomIndex, save, muted, handleExitToStart]);

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
            room={ROOMS[roomIndex]}
            roomIndex={roomIndex}
            isLastRoom={roomIndex >= ROOMS.length - 1}
            initialSave={save}
            muted={muted}
            onToggleMute={toggleMuted}
            onNextRoom={handleNextRoom}
            onExitToStart={handleExitToStart}
          />
        )}
      </div>
    </div>
  );
}
