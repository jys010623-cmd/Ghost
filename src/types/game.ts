export type CleaningTool = "hand" | "cloth" | "duster" | "broom";

export type CleanableType = "dust" | "cobweb" | "trash" | "stain";

export interface CleanableItem {
  id: string;
  type: CleanableType;
  /** 배경 대비 퍼센트 좌표 (0~100) */
  x: number;
  y: number;
  /** 배경 너비 대비 퍼센트 크기 */
  width: number;
  rotation?: number;
  scale?: number;
  /** 좌우 반전 */
  flip?: boolean;
  maxCleanValue: number;
  currentCleanValue: number;
  requiredTool: CleaningTool;
  image: string;
  /** 청소 완료 시 추억 아이템을 드러내는지 여부 */
  hasMemory?: boolean;
}

export type GhostMood = "sad" | "normal" | "surprised" | "happy" | "sleep";

export type GamePhase = "start" | "playing";

export interface GhostPosition {
  x: number;
  y: number;
}

export interface ToolInfo {
  id: CleaningTool;
  name: string;
  icon: string;
  image: string;
  shortcut: string;
  hint: string;
}

export interface DialogueContent {
  id: string;
  name: string;
  mood: GhostMood;
  lines: string[];
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** 발견했을 때 보여줄 이미지 (없으면 icon 으로 대체) */
  image?: string;
  /** 어느 방 소속 추억인지 (도감 로직용) */
  roomId?: string;
  /** 어느 방에서 찾은 추억인지 (도감 표시용) */
  roomLabel?: string;
}

/** 방의 배경 테마 (실제 그림이 없을 때 CSS 플레이스홀더 선택에 사용) */
export type RoomTheme = "livingRoom" | "bedroom";

/** 방별 대사 묶음 (stages[3] = 완료 대사) */
export interface RoomDialogue {
  intro: DialogueContent;
  stages: DialogueContent[];
}

/** 하나의 청소 가능한 방 정의 */
export interface RoomDef {
  id: string;
  name: string;
  goal: string;
  theme: RoomTheme;
  /** 배경 이미지 (없으면 CSS 플레이스홀더로 그려진다) */
  dirtyImage?: string;
  cleanImage?: string;
  items: CleanableItem[];
  dialogue: RoomDialogue;
  /** 이 방에 숨겨진 추억 (hasMemory 오브젝트를 청소하면 등장) */
  memory?: MemoryItem;
}
