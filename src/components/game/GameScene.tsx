import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CleaningTool,
  DialogueContent,
  MemoryItem,
  RoomDef,
} from "../../types/game";
import type { CleanableItem as CleanableItemData } from "../../types/game";
import { TOOLS, WRONG_TOOL_MESSAGE } from "../../data/roomData";
import { moodForProgress, stageForProgress } from "../../data/ghostData";
import { useGameProgress } from "../../hooks/useGameProgress";
import { useGhostMovement } from "../../hooks/useGhostMovement";
import { useCleaning } from "../../hooks/useCleaning";
import { useParticles } from "../../hooks/useParticles";
import { ASSETS } from "../../data/assets";
import {
  computeStars,
  roomMemoryFound,
  roomMemoryTotal,
} from "../../data/memoryData";
import { playSound, startBgm } from "../../utils/audio";
import { writeSave, type SaveData } from "../../utils/storage";
import { RoomBackground } from "./RoomBackground";
import { CleanableItem } from "./CleanableItem";
import { Ghost } from "./Ghost";
import { CleaningEffects } from "./CleaningEffects";
import { ParticleLayer } from "./ParticleLayer";
import { ProgressPanel } from "../ui/ProgressPanel";
import { ToolBar } from "../ui/ToolBar";
import { DialogueBox } from "../ui/DialogueBox";
import { MemoryPopup } from "../ui/MemoryPopup";
import { MemoryCodex } from "../ui/MemoryCodex";
import { CompletionModal } from "../ui/CompletionModal";
import { Toast } from "../ui/Toast";
import styles from "./GameScene.module.css";

interface GameSceneProps {
  room: RoomDef;
  roomIndex: number;
  isLastRoom: boolean;
  initialSave: SaveData | null;
  muted: boolean;
  onToggleMute: () => void;
  onNextRoom: () => void;
  onExitToStart: () => void;
}

export function GameScene({
  room,
  roomIndex,
  isLastRoom,
  initialSave,
  muted,
  onToggleMute,
  onNextRoom,
  onExitToStart,
}: GameSceneProps) {
  const { items, progress, remainingCount, cleanValues, rub, pickUp } =
    useGameProgress(room.items, initialSave?.cleanValues);

  const { intro, stages } = room.dialogue;
  const completionDialogue = stages[3];

  const [selectedTool, setSelectedTool] = useState<CleaningTool>("broom");
  const [shownStages, setShownStages] = useState<Set<number>>(
    () => new Set(initialSave?.shownStages ?? []),
  );
  const [introSeen, setIntroSeen] = useState(initialSave?.introSeen ?? false);
  // 발견한 추억 id 집합 (구버전 memoryFound:boolean 세이브에서 마이그레이션)
  const [foundMemories, setFoundMemories] = useState<Set<string>>(() => {
    if (initialSave?.foundMemories) return new Set(initialSave.foundMemories);
    if (initialSave?.memoryFound) return new Set(["family-photo"]);
    return new Set();
  });
  const [mistakes, setMistakes] = useState(initialSave?.mistakes ?? 0);
  const [completed, setCompleted] = useState(initialSave?.completed ?? false);

  const [dialogue, setDialogue] = useState<DialogueContent | null>(null);
  // 이미 완료된 방을 이어서 열면 완료 카드를 바로 보여준다
  const [showCompletion, setShowCompletion] = useState(
    initialSave?.completed ?? false,
  );
  const [memoryPopup, setMemoryPopup] = useState<MemoryItem | null>(null);
  const [showCodex, setShowCodex] = useState(false);
  const [toast, setToast] = useState("");

  const roomFound = roomMemoryFound(room.id, foundMemories);
  const roomTotal = roomMemoryTotal(room.id);

  const toastTimer = useRef<number | null>(null);
  const lastBurst = useRef(0);

  const { particles, burst, remove } = useParticles();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1600);
  }, []);

  const locked =
    dialogue !== null ||
    memoryPopup !== null ||
    completed ||
    showCompletion ||
    showCodex;

  const ghostPosition = useGhostMovement(!locked);

  // 첫 진입 시 인트로 대화 (이미 완료된 방을 이어서 열 때는 생략)
  useEffect(() => {
    startBgm();
    if (!introSeen && !completed) {
      setDialogue(intro);
      setIntroSeen(true);
      setShownStages((prev) => new Set(prev).add(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWrongTool = useCallback(
    (item: CleanableItemData) => {
      setMistakes((m) => m + 1);
      showToast(WRONG_TOOL_MESSAGE[item.type]);
    },
    [showToast],
  );

  // 문지르는 동안 티끌이 튀도록 (과도한 생성 방지를 위해 살짝 스로틀)
  const onRub = useCallback(
    (item: CleanableItemData) => {
      const now = performance.now();
      if (now - lastBurst.current < 55) return;
      lastBurst.current = now;
      burst(item.x, item.y, {
        count: 2,
        images: ASSETS.particles.dust,
        kind: "dust",
        spread: 46,
      });
    },
    [burst],
  );

  const onCleaned = useCallback(
    (item: CleanableItemData) => {
      // 다 지웠을 때의 보상감 — 반짝임 터뜨리기
      burst(item.x, item.y, {
        count: 9,
        images: ASSETS.particles.sparkle,
        kind: "sparkle",
        spread: 78,
        power: 1.4,
      });
      const memory = room.memory;
      if (item.hasMemory && memory && !foundMemories.has(memory.id)) {
        setFoundMemories((prev) => new Set(prev).add(memory.id));
        setMemoryPopup(memory);
      }
    },
    [foundMemories, burst, room.memory],
  );

  const interact = useCleaning({
    selectedTool,
    locked,
    rub,
    pickUp,
    onWrongTool,
    onCleaned,
    onRub,
  });

  // 진행 구간에 처음 진입했을 때 한 번만 대사 표시
  useEffect(() => {
    if (!introSeen) return;
    const stage = stageForProgress(progress);
    if (stage === 0) return;
    if (shownStages.has(stage)) return;

    setShownStages((prev) => new Set(prev).add(stage));

    if (stage === 3) {
      // 완료 시퀀스 시작
      setCompleted(true);
      playSound("room-complete");
      playSound("ghost-happy");
      setDialogue(completionDialogue);
    } else if (!locked) {
      setDialogue(stages[stage]);
    }
  }, [progress, introSeen, shownStages, locked, stages, completionDialogue]);

  // 완료 대화가 닫히면 완료 카드 표시
  const handleDialogueClose = useCallback(() => {
    const closing = dialogue;
    setDialogue(null);
    if (closing?.id === completionDialogue.id) {
      setShowCompletion(true);
    }
  }, [dialogue, completionDialogue]);

  // 도구 단축키 (1~4)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tool = TOOLS.find((t) => t.shortcut === e.key);
      if (tool) setSelectedTool(tool.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 상태 저장
  useEffect(() => {
    const data: SaveData = {
      phase: "playing",
      roomIndex,
      cleanValues,
      shownStages: Array.from(shownStages),
      introSeen,
      memoryFound: foundMemories.size > 0, // 하위 호환
      foundMemories: Array.from(foundMemories),
      mistakes,
      muted,
      completed,
    };
    writeSave(data);
  }, [
    roomIndex,
    cleanValues,
    shownStages,
    introSeen,
    foundMemories,
    mistakes,
    muted,
    completed,
  ]);

  const ghostMood = moodForProgress(progress);
  const visibleItems = items.filter((it) => it.currentCleanValue > 0);

  return (
    <div className={styles.scene}>
      <RoomBackground
        progress={progress}
        theme={room.theme}
        dirtyImage={room.dirtyImage}
        cleanImage={room.cleanImage}
      />

      <div className={styles.decoration}>
        <div className={styles.window} />
      </div>

      <div className={styles.cleanables}>
        {visibleItems.map((item) => (
          <CleanableItem
            key={item.id}
            item={item}
            disabled={locked}
            onInteract={interact}
          />
        ))}
      </div>

      <ParticleLayer particles={particles} onDone={remove} />

      <Ghost mood={ghostMood} position={ghostPosition} jumping={completed} />

      <CleaningEffects active={completed} />

      <ProgressPanel
        progress={progress}
        goal={room.goal}
        remaining={remainingCount}
        muted={muted}
        memoriesFound={foundMemories.size}
        onOpenCodex={() => setShowCodex(true)}
        onToggleMute={onToggleMute}
        onReset={onExitToStart}
      />

      <ToolBar selected={selectedTool} onSelect={setSelectedTool} />

      <Toast message={toast} />

      {dialogue && <DialogueBox content={dialogue} onClose={handleDialogueClose} />}

      {memoryPopup && (
        <MemoryPopup memory={memoryPopup} onClose={() => setMemoryPopup(null)} />
      )}

      {showCompletion && (
        <CompletionModal
          roomName={room.name}
          isLastRoom={isLastRoom}
          stars={computeStars(mistakes, roomFound, roomTotal)}
          memoriesFound={roomFound}
          memoriesTotal={roomTotal}
          onOpenCodex={() => setShowCodex(true)}
          onNextRoom={onNextRoom}
          onReset={onExitToStart}
        />
      )}

      {showCodex && (
        <MemoryCodex found={foundMemories} onClose={() => setShowCodex(false)} />
      )}
    </div>
  );
}
