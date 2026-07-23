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
}
