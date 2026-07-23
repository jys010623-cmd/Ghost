const STORAGE_KEY = "mongsil-cleaning-save-v1";

export interface SaveData {
  phase: "start" | "playing";
  cleanValues: Record<string, number>;
  shownStages: number[];
  introSeen: boolean;
  memoryFound: boolean;
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
