const STORAGE_KEY = "mongsil-cleaning-save-v1";

export interface SaveData {
  phase: "start" | "playing";
  /** 현재 진행 중인 방 인덱스 (ROOMS 기준) */
  roomIndex?: number;
  cleanValues: Record<string, number>;
  shownStages: number[];
  introSeen: boolean;
  /** @deprecated foundMemories 로 대체됨. 구버전 세이브 호환용. */
  memoryFound: boolean;
  /** 발견한 추억 id 목록 */
  foundMemories?: string[];
  /** 잘못된 도구 사용 횟수 (별점 계산용) */
  mistakes?: number;
  muted: boolean;
  completed: boolean;
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* 저장 실패는 조용히 무시 */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* 무시 */
  }
}
