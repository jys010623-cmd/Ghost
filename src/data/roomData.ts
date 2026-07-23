import type { CleanableItem, CleaningTool, CleanableType, ToolInfo } from "../types/game";
import { ASSETS } from "./assets";

export const ROOM_DIRTY_IMAGE = "/assets/rooms/living-room-dirty.webp";
export const ROOM_CLEAN_IMAGE = "/assets/rooms/living-room-clean.webp";

export const ROOM_GOAL = "거실을 깨끗하게 만들기";

/** 도구 정의 — 손 / 걸레 / 먼지털이 / 빗자루 */
export const TOOLS: ToolInfo[] = [
  { id: "hand", name: "손", icon: "🤚", image: ASSETS.tools.hand, shortcut: "1", hint: "쓰레기를 주워요" },
  { id: "cloth", name: "걸레", icon: "🧽", image: ASSETS.tools.cloth, shortcut: "2", hint: "얼룩을 닦아요" },
  { id: "duster", name: "먼지털이", icon: "🪶", image: ASSETS.tools.duster, shortcut: "3", hint: "거미줄을 걷어요" },
  { id: "broom", name: "빗자루", icon: "🧹", image: ASSETS.tools.broom, shortcut: "4", hint: "먼지를 쓸어요" },
];

/** 오염물 종류별 표시 정보 (플레이스홀더 이모지 + 색) */
export const CLEANABLE_STYLE: Record<
  CleanableType,
  { emoji: string; label: string; color: string; tool: CleaningTool }
> = {
  dust: { emoji: "🌫️", label: "먼지", color: "#a9a2b8", tool: "broom" },
  cobweb: { emoji: "🕸️", label: "거미줄", color: "#e7e3f2", tool: "duster" },
  trash: { emoji: "🗑️", label: "쓰레기", color: "#c98b5a", tool: "hand" },
  stain: { emoji: "🟤", label: "얼룩", color: "#6b4a34", tool: "cloth" },
};

/** 잘못된 도구를 사용했을 때 안내 문구 */
export const WRONG_TOOL_MESSAGE: Record<CleanableType, string> = {
  dust: "이 먼지는 빗자루로 쓸어야 해요.",
  cobweb: "이 거미줄은 먼지털이로 걷어내야 해요.",
  trash: "이 쓰레기는 손으로 주워야 해요.",
  stain: "이 얼룩은 걸레로 여러 번 닦아야 해요.",
};

const imgFor = (type: CleanableType, variant: number) => {
  const filenames: Record<CleanableType, string[]> = {
    dust: ["dust-01.png", "dust-02.png", "dust-03.png", "dust-04.png"],
    cobweb: ["cobweb-corner-01.png", "cobweb-corner-02.png"],
    trash: ["trash-paper-01.png", "trash-paper-02.png", "trash-book-01.png"],
    stain: ["stain-floor-01.png", "stain-table-01.png", "stain-sofa-01.png"],
  };
  return `/assets/cleanables/${type}/${filenames[type][variant]}`;
};

/** 거실 청소 오브젝트 — 먼지4 · 거미줄2 · 쓰레기3 · 얼룩3 = 12개 */
export const LIVING_ROOM_ITEMS: CleanableItem[] = [
  // 먼지 (빗자루)
  { id: "dust-1", type: "dust", x: 22, y: 74, width: 12, rotation: -6, scale: 1, maxCleanValue: 100, currentCleanValue: 100, requiredTool: "broom", image: imgFor("dust", 0) },
  { id: "dust-2", type: "dust", x: 47, y: 82, width: 14, scale: 1.1, flip: true, maxCleanValue: 100, currentCleanValue: 100, requiredTool: "broom", image: imgFor("dust", 1) },
  { id: "dust-3", type: "dust", x: 70, y: 78, width: 11, rotation: 8, scale: 0.9, maxCleanValue: 100, currentCleanValue: 100, requiredTool: "broom", image: imgFor("dust", 2) },
  { id: "dust-4", type: "dust", x: 82, y: 66, width: 10, scale: 0.85, flip: true, maxCleanValue: 100, currentCleanValue: 100, requiredTool: "broom", image: imgFor("dust", 3) },

  // 거미줄 (먼지털이) — 보통 모서리 위쪽
  { id: "cobweb-1", type: "cobweb", x: 9, y: 12, width: 15, scale: 1, maxCleanValue: 120, currentCleanValue: 120, requiredTool: "duster", image: imgFor("cobweb", 0) },
  { id: "cobweb-2", type: "cobweb", x: 88, y: 14, width: 15, flip: true, maxCleanValue: 120, currentCleanValue: 120, requiredTool: "duster", image: imgFor("cobweb", 1) },

  // 쓰레기 (손) — 클릭해서 줍기, 하나는 추억을 숨김
  { id: "trash-1", type: "trash", x: 34, y: 62, width: 9, rotation: -10, maxCleanValue: 40, currentCleanValue: 40, requiredTool: "hand", image: imgFor("trash", 0) },
  { id: "trash-2", type: "trash", x: 60, y: 68, width: 10, scale: 1.05, maxCleanValue: 40, currentCleanValue: 40, requiredTool: "hand", image: imgFor("trash", 1), hasMemory: true },
  { id: "trash-3", type: "trash", x: 76, y: 55, width: 8, rotation: 12, flip: true, maxCleanValue: 40, currentCleanValue: 40, requiredTool: "hand", image: imgFor("trash", 2) },

  // 얼룩 (걸레) — 여러 번 문질러야 함
  { id: "stain-1", type: "stain", x: 40, y: 50, width: 14, scale: 1, maxCleanValue: 160, currentCleanValue: 160, requiredTool: "cloth", image: imgFor("stain", 0) },
  { id: "stain-2", type: "stain", x: 55, y: 40, width: 11, rotation: -5, scale: 0.9, maxCleanValue: 160, currentCleanValue: 160, requiredTool: "cloth", image: imgFor("stain", 1) },
  { id: "stain-3", type: "stain", x: 18, y: 46, width: 12, flip: true, maxCleanValue: 160, currentCleanValue: 160, requiredTool: "cloth", image: imgFor("stain", 2) },
];

/** 청소 진행도(0~100)에 따른 깨끗한 배경 opacity 보간 */
export function cleanBackgroundOpacity(progress: number): number {
  const stops: [number, number][] = [
    [0, 0],
    [30, 0.15],
    [60, 0.35],
    [90, 0.6],
    [100, 1],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, o0] = stops[i];
    const [p1, o1] = stops[i + 1];
    if (progress <= p1) {
      const t = (progress - p0) / (p1 - p0 || 1);
      return o0 + (o1 - o0) * t;
    }
  }
  return 1;
}
