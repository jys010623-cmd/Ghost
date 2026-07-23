import { useCallback, useEffect, useRef, useState } from "react";
import type { CleaningTool, DialogueContent, MemoryItem } from "../../types/game";
import type { CleanableItem as CleanableItemData } from "../../types/game";
import { TOOLS, WRONG_TOOL_MESSAGE } from "../../data/roomData";
import { moodForProgress, stageForProgress } from "../../data/ghostData";
import {
  COMPLETION_DIALOGUE,
  FAMILY_PHOTO_MEMORY,
  INTRO_DIALOGUE,
  STAGE_DIALOGUES,
} from "../../data/dialogueData";
import { useGameProgress } from "../../hooks/useGameProgress";
import { useGhostMovement } from "../../hooks/useGhostMovement";
import { useCleaning } from "../../hooks/useCleaning";
import { playSound, startBgm } from "../../utils/audio";
import { writeSave, type SaveData } from "../../utils/storage";
import { RoomBackground } from "./RoomBackground";
import { CleanableItem } from "./CleanableItem";
import { Ghost } from "./Ghost";
import { CleaningEffects } from "./CleaningEffects";
import { ProgressPanel } from "../ui/ProgressPanel";
import { ToolBar } from "../ui/ToolBar";
import { DialogueBox } from "../ui/DialogueBox";
import { MemoryPopup } from "../ui/MemoryPopup";
import { CompletionModal } from "../ui/CompletionModal";
import { Toast } from "../ui/Toast";
import styles from "./GameScene.module.css";

interface GameSceneProps {
  initialSave: SaveData | null;
  muted: boolean;
  onToggleMute: () => void;
  onExitToStart: () => void;
}

export function GameScene({
  initialSave,
  muted,
  onToggleMute,
  onExitToStart,
}: GameSceneProps) {
  const { items, progress, remainingCount, cleanValues, rub, pickUp } =
    useGameProgress(initialSave?.cleanValues);

  const [selectedTool, setSelectedTool] = useState<CleaningTool>("broom");
  const [shownStages, setShownStages] = useState<Set<number>>(
    () => new Set(initialSave?.shownStages ?? []),
  );
  const [introSeen, setIntroSeen] = useState(initialSave?.introSeen ?? false);
  const [memoryFound, setMemoryFound] = useState(initialSave?.memoryFound ?? false);
  const [completed, setCompleted] = useState(initialSave?.completed ?? false);

  const [dialogue, setDialogue] = useState<DialogueContent | null>(null);
  const [memoryPopup, setMemoryPopup] = useState<MemoryItem | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [toast, setToast] = useState("");

  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1600);
  }, []);

  const locked =
    dialogue !== null || memoryPopup !== null || completed || showCompletion;

  const ghostPosition = useGhostMovement(!locked);

  // 첫 진입 시 인트로 대화
  useEffect(() => {
    startBgm();
    if (!introSeen) {
      setDialogue(INTRO_DIALOGUE);
      setIntroSeen(true);
      setShownStages((prev) => new Set(prev).add(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWrongTool = useCallback(
    (item: CleanableItemData) => showToast(WRONG_TOOL_MESSAGE[item.type]),
    [showToast],
  );

  const onCleaned = useCallback(
    (item: CleanableItemData) => {
      if (item.hasMemory && !memoryFound) {
        setMemoryFound(true);
        setMemoryPopup(FAMILY_PHOTO_MEMORY);
      }
    },
    [memoryFound],
  );

  const interact = useCleaning({
    selectedTool,
    locked,
    rub,
    pickUp,
    onWrongTool,
    onCleaned,
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
      setDialogue(COMPLETION_DIALOGUE);
    } else if (!locked) {
      setDialogue(STAGE_DIALOGUES[stage]);
    }
  }, [progress, introSeen, shownStages, locked]);

  // 완료 대화가 닫히면 완료 카드 표시
  const handleDialogueClose = useCallback(() => {
    const closing = dialogue;
    setDialogue(null);
    if (closing?.id === COMPLETION_DIALOGUE.id) {
      setShowCompletion(true);
    }
  }, [dialogue]);

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
      cleanValues,
      shownStages: Array.from(shownStages),
      introSeen,
      memoryFound,
      muted,
      completed,
    };
    writeSave(data);
  }, [cleanValues, shownStages, introSeen, memoryFound, muted, completed]);

  const ghostMood = moodForProgress(progress);
  const visibleItems = items.filter((it) => it.currentCleanValue > 0);

  return (
    <div className={styles.scene}>
      <RoomBackground progress={progress} />

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

      <Ghost mood={ghostMood} position={ghostPosition} jumping={completed} />

      <CleaningEffects active={completed} />

      <ProgressPanel
        progress={progress}
        remaining={remainingCount}
        muted={muted}
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
          memoriesFound={memoryFound ? 1 : 0}
          onReset={onExitToStart}
        />
      )}

      <div className={styles.rotateHint}>
        <span className={styles.spin}>📱</span>
        <span>가로로 돌려서 즐겨주세요</span>
      </div>
    </div>
  );
}
