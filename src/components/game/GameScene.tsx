import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CleaningTool,
  DialogueContent,
  GhostPosition,
  MemoryItem,
  RoomDef,
} from "../../types/game";
import type { CleanableItem as CleanableItemData } from "../../types/game";
import { WRONG_TOOL_MESSAGE, toolsForItems } from "../../data/roomData";
import { moodForProgress, stageForProgress } from "../../data/ghostData";
import { useGameProgress } from "../../hooks/useGameProgress";
import { useGhostMovement } from "../../hooks/useGhostMovement";
import { useCleaning } from "../../hooks/useCleaning";
import { useParticles } from "../../hooks/useParticles";
import { ASSETS } from "../../data/assets";
import {
  ALL_MEMORIES,
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
import { EndingScene } from "../ui/EndingScene";
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

  // 이 방에서 실제로 쓰는 도구만 (툴바·단축키)
  const roomTools = useMemo(() => toolsForItems(room.items), [room.items]);

  const [selectedTool, setSelectedTool] = useState<CleaningTool>(
    () => roomTools[0]?.id ?? "hand",
  );
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

  // 청소하는 지점으로 몽실을 이동시키고 문지르는 모션을 준다
  const [ghostFocus, setGhostFocus] = useState<GhostPosition | null>(null);
  const [ghostWorking, setGhostWorking] = useState(false);
  const focusTimer = useRef<number | null>(null);
  // 추억 팝업이 떠 있는 동안 완료 대사를 미뤄두기 위한 플래그
  const pendingCompletion = useRef(false);

  const { particles, burst, remove } = useParticles();

  const focusGhostOn = useCallback((item: CleanableItemData) => {
    // 오브젝트 살짝 위에 떠서 문지르도록 위치 보정
    const x = Math.min(90, Math.max(10, item.x));
    const y = Math.min(86, Math.max(20, item.y - 10));
    setGhostFocus({ x, y });
    setGhostWorking(true);
    if (focusTimer.current) window.clearTimeout(focusTimer.current);
    focusTimer.current = window.setTimeout(() => {
      setGhostWorking(false);
      setGhostFocus(null);
    }, 1300);
  }, []);

  useEffect(
    () => () => {
      if (focusTimer.current) window.clearTimeout(focusTimer.current);
    },
    [],
  );

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

  // 청소 지점(focus)이 있으면 그곳으로, 없으면 자유롭게 배회
  const wanderPosition = useGhostMovement(!locked && ghostFocus === null);
  const ghostPosition = ghostFocus ?? wanderPosition;

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

  // 청소할 때: 몽실을 그 지점으로 보내 문지르게 하고, 티끌을 튀긴다
  const onRub = useCallback(
    (item: CleanableItemData) => {
      focusGhostOn(item);
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
    [burst, focusGhostOn],
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
      // 추억 오브젝트를 맨 마지막에 치운 경우: 추억 팝업이 떠 있으면
      // 완료 대사를 팝업이 닫힌 뒤로 미뤄 겹침을 막는다
      if (memoryPopup !== null) {
        pendingCompletion.current = true;
      } else {
        setDialogue(completionDialogue);
      }
    } else if (!locked) {
      setDialogue(stages[stage]);
    }
  }, [progress, introSeen, shownStages, locked, stages, completionDialogue, memoryPopup]);

  // 완료 대화가 닫히면 완료 카드 표시
  const handleDialogueClose = useCallback(() => {
    const closing = dialogue;
    setDialogue(null);
    if (closing?.id === completionDialogue.id) {
      setShowCompletion(true);
    }
  }, [dialogue, completionDialogue]);

  // 추억 팝업을 닫을 때, 미뤄둔 완료 대사가 있으면 이제 표시한다
  const handleMemoryClose = useCallback(() => {
    setMemoryPopup(null);
    if (pendingCompletion.current) {
      pendingCompletion.current = false;
      setDialogue(completionDialogue);
    }
  }, [completionDialogue]);

  // 도구 단축키 — 이 방에서 쓰는 도구만
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tool = roomTools.find((t) => t.shortcut === e.key);
      if (tool) setSelectedTool(tool.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [roomTools]);

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

      <Ghost
        mood={ghostMood}
        position={ghostPosition}
        jumping={completed}
        working={ghostWorking}
      />

      <CleaningEffects active={completed} />

      <ProgressPanel
        progress={progress}
        goal={room.goal}
        remaining={remainingCount}
        muted={muted}
        memoriesFound={foundMemories.size}
        memoriesTotal={ALL_MEMORIES.length}
        onOpenCodex={() => setShowCodex(true)}
        onToggleMute={onToggleMute}
        onReset={onExitToStart}
      />

      <ToolBar tools={roomTools} selected={selectedTool} onSelect={setSelectedTool} />

      <Toast message={toast} />

      {dialogue && <DialogueBox content={dialogue} onClose={handleDialogueClose} />}

      {memoryPopup && (
        <MemoryPopup memory={memoryPopup} onClose={handleMemoryClose} />
      )}

      {showCompletion && !isLastRoom && (
        <CompletionModal
          roomName={room.name}
          isLastRoom={false}
          stars={computeStars(mistakes, roomFound, roomTotal)}
          memoriesFound={roomFound}
          memoriesTotal={roomTotal}
          onOpenCodex={() => setShowCodex(true)}
          onNextRoom={onNextRoom}
          onReset={onExitToStart}
        />
      )}

      {showCompletion && isLastRoom && (
        <EndingScene
          memoriesFound={foundMemories.size}
          memoriesTotal={ALL_MEMORIES.length}
          onOpenCodex={() => setShowCodex(true)}
          onReset={onExitToStart}
        />
      )}

      {showCodex && (
        <MemoryCodex found={foundMemories} onClose={() => setShowCodex(false)} />
      )}
    </div>
  );
}
