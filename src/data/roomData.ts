import type {
  CleanableItem,
  CleaningTool,
  CleanableType,
  RoomDef,
  ToolInfo,
} from "../types/game";
import { ASSETS } from "./assets";
import { asset } from "../utils/asset";
import {
  ATTIC_DIALOGUE,
  BATHROOM_DIALOGUE,
  BEDROOM_DIALOGUE,
  CHILD_ROOM_DIALOGUE,
  CRAYON_DIARY_MEMORY,
  FAMILY_PHOTO_MEMORY,
  GARDEN_DIALOGUE,
  KITCHEN_DIALOGUE,
  LIVING_ROOM_DIALOGUE,
  MUSIC_BOX_MEMORY,
  OLD_LETTERS_MEMORY,
  RECIPE_NOTE_MEMORY,
  RUBBER_DUCK_MEMORY,
  TIME_CAPSULE_MEMORY,
} from "./dialogueData";

export const ROOM_DIRTY_IMAGE = asset("/assets/rooms/living-room-dirty.webp");
export const ROOM_CLEAN_IMAGE = asset("/assets/rooms/living-room-clean.webp");

const roomImg = (name: string, variant: "dirty" | "clean") =>
  asset(`/assets/rooms/${name}-${variant}.webp`);

/** 도구 정의 — 손 / 걸레 / 먼지털이 / 빗자루 / 분무기 / 솔 / 갈퀴 */
export const TOOLS: ToolInfo[] = [
  { id: "hand", name: "손", icon: "🤚", image: ASSETS.tools.hand, shortcut: "1", hint: "쓰레기·잡초를 주워요" },
  { id: "cloth", name: "걸레", icon: "🧽", image: ASSETS.tools.cloth, shortcut: "2", hint: "얼룩을 닦아요" },
  { id: "duster", name: "먼지털이", icon: "🪶", image: ASSETS.tools.duster, shortcut: "3", hint: "거미줄을 걷어요" },
  { id: "broom", name: "빗자루", icon: "🧹", image: ASSETS.tools.broom, shortcut: "4", hint: "먼지를 쓸어요" },
  { id: "spray", name: "분무기", icon: "🧴", image: ASSETS.tools.spray, shortcut: "5", hint: "기름때를 닦아요" },
  { id: "brush", name: "솔", icon: "🪥", image: ASSETS.tools.brush, shortcut: "6", hint: "곰팡이를 문질러요" },
  { id: "rake", name: "갈퀴", icon: "🍂", image: ASSETS.tools.rake, shortcut: "7", hint: "낙엽을 긁어모아요" },
];

/** 방의 아이템이 실제로 요구하는 도구만 순서대로 반환 (방별 툴바용) */
export function toolsForItems(items: CleanableItem[]): ToolInfo[] {
  const needed = new Set(items.map((it) => it.requiredTool));
  return TOOLS.filter((t) => needed.has(t.id));
}

/** 클릭 한 번에 줍는 오염물 (문지르지 않음) */
export const PICKUP_TYPES: ReadonlySet<CleanableType> = new Set<CleanableType>([
  "trash",
  "weeds",
]);

/** 오염물 종류별 표시 정보 (플레이스홀더 이모지 + 색 + 필요 도구) */
export const CLEANABLE_STYLE: Record<
  CleanableType,
  { emoji: string; label: string; color: string; tool: CleaningTool }
> = {
  dust: { emoji: "🌫️", label: "먼지", color: "#a9a2b8", tool: "broom" },
  cobweb: { emoji: "🕸️", label: "거미줄", color: "#e7e3f2", tool: "duster" },
  trash: { emoji: "🗑️", label: "쓰레기", color: "#c98b5a", tool: "hand" },
  stain: { emoji: "🟤", label: "얼룩", color: "#6b4a34", tool: "cloth" },
  grease: { emoji: "🟫", label: "기름때", color: "#5a3d24", tool: "spray" },
  mold: { emoji: "🦠", label: "곰팡이", color: "#3d5a4a", tool: "brush" },
  leaves: { emoji: "🍂", label: "낙엽", color: "#b5701f", tool: "rake" },
  weeds: { emoji: "🌿", label: "잡초", color: "#5a7a3a", tool: "hand" },
};

/** 잘못된 도구를 사용했을 때 안내 문구 */
export const WRONG_TOOL_MESSAGE: Record<CleanableType, string> = {
  dust: "이 먼지는 빗자루로 쓸어야 해요.",
  cobweb: "이 거미줄은 먼지털이로 걷어내야 해요.",
  trash: "이 쓰레기는 손으로 주워야 해요.",
  stain: "이 얼룩은 걸레로 여러 번 닦아야 해요.",
  grease: "이 기름때는 분무기로 뿌리고 닦아야 해요.",
  mold: "이 곰팡이는 솔로 문질러야 해요.",
  leaves: "이 낙엽은 갈퀴로 긁어모아야 해요.",
  weeds: "이 잡초는 손으로 뽑아야 해요.",
};

/** 표면 오염물(문지르기/긁기) 이미지 */
const dirt = (type: CleanableType, variant: number) => {
  const filenames: Partial<Record<CleanableType, string[]>> = {
    dust: ["dust-01.png", "dust-02.png", "dust-03.png", "dust-04.png"],
    cobweb: ["cobweb-corner-01.png", "cobweb-corner-02.png", "cobweb-wide-01.png", "cobweb-small-01.png"],
    stain: ["stain-floor-01.png", "stain-table-01.png", "stain-sofa-01.png", "stain-window-01.png", "stain-floor-02.png"],
    grease: ["grease-01.png", "grease-02.png", "grease-03.png"],
    mold: ["mold-01.png", "mold-02.png", "mold-03.png"],
    leaves: ["leaves-01.png", "leaves-02.png", "leaves-03.png"],
    weeds: ["weeds-01.png", "weeds-02.png", "weeds-03.png"],
  };
  const names = filenames[type] ?? ["dust-01.png"];
  return asset(`/assets/cleanables/${type}/${names[variant % names.length]}`);
};

/** 물건(쓰레기·장난감 등) 이미지 — trash 폴더의 개별 파일 */
const obj = (file: string) => asset(`/assets/cleanables/trash/${file}`);

// 값 상수
const V = { dust: 100, cobweb: 120, stain: 160, grease: 130, mold: 150, leaves: 110, pickup: 40 };

/** 거실 — 먼지4 · 거미줄2 · 쓰레기3 · 얼룩3 = 12개 */
export const LIVING_ROOM_ITEMS: CleanableItem[] = [
  { id: "dust-1", type: "dust", x: 22, y: 70, width: 12, rotation: -6, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 0) },
  { id: "dust-2", type: "dust", x: 47, y: 74, width: 14, scale: 1.1, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 1) },
  { id: "dust-3", type: "dust", x: 70, y: 72, width: 11, rotation: 8, scale: 0.9, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 2) },
  { id: "dust-4", type: "dust", x: 82, y: 64, width: 10, scale: 0.85, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 3) },
  { id: "cobweb-1", type: "cobweb", x: 9, y: 24, width: 15, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 0) },
  { id: "cobweb-2", type: "cobweb", x: 88, y: 24, width: 15, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 1) },
  { id: "trash-1", type: "trash", x: 34, y: 62, width: 9, rotation: -10, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-paper-01.png") },
  { id: "trash-2", type: "trash", x: 60, y: 68, width: 10, scale: 1.05, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-paper-02.png"), hasMemory: true },
  { id: "trash-3", type: "trash", x: 76, y: 55, width: 8, rotation: 12, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-book-01.png") },
  { id: "stain-1", type: "stain", x: 40, y: 50, width: 14, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 0) },
  { id: "stain-2", type: "stain", x: 55, y: 40, width: 11, rotation: -5, scale: 0.9, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 1) },
  { id: "stain-3", type: "stain", x: 18, y: 46, width: 12, flip: true, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 2) },
];

/** 침실 — 먼지3 · 거미줄4 · 쓰레기3 · 얼룩3 = 13개 */
export const BEDROOM_ITEMS: CleanableItem[] = [
  { id: "bed-dust-1", type: "dust", x: 30, y: 76, width: 13, rotation: -4, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 0) },
  { id: "bed-dust-2", type: "dust", x: 58, y: 80, width: 12, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 2) },
  { id: "bed-dust-3", type: "dust", x: 80, y: 72, width: 10, rotation: 6, scale: 0.9, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 1) },
  { id: "bed-cobweb-1", type: "cobweb", x: 8, y: 24, width: 16, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 0) },
  { id: "bed-cobweb-2", type: "cobweb", x: 90, y: 24, width: 16, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 1) },
  { id: "bed-cobweb-3", type: "cobweb", x: 12, y: 40, width: 12, scale: 0.9, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 2) },
  { id: "bed-cobweb-4", type: "cobweb", x: 86, y: 44, width: 11, flip: true, scale: 0.9, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 3) },
  { id: "bed-trash-1", type: "trash", x: 40, y: 66, width: 9, rotation: 8, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-book-01.png") },
  { id: "bed-trash-2", type: "trash", x: 64, y: 58, width: 10, scale: 1.05, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-paper-01.png"), hasMemory: true },
  { id: "bed-trash-3", type: "trash", x: 24, y: 60, width: 8, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-cup-01.png") },
  { id: "bed-stain-1", type: "stain", x: 48, y: 48, width: 15, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 0) },
  { id: "bed-stain-2", type: "stain", x: 66, y: 38, width: 12, rotation: 4, scale: 0.9, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 2) },
  { id: "bed-stain-3", type: "stain", x: 30, y: 42, width: 12, flip: true, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 1) },
];

/** 부엌 — 기름때3 · 얼룩2 · 먼지2 · 거미줄2 · 쓰레기2 = 11개 */
export const KITCHEN_ITEMS: CleanableItem[] = [
  { id: "kit-grease-1", type: "grease", x: 44, y: 44, width: 13, maxCleanValue: V.grease, currentCleanValue: V.grease, requiredTool: "spray", image: dirt("grease", 0) },
  { id: "kit-grease-2", type: "grease", x: 63, y: 46, width: 12, flip: true, maxCleanValue: V.grease, currentCleanValue: V.grease, requiredTool: "spray", image: dirt("grease", 1) },
  { id: "kit-grease-3", type: "grease", x: 30, y: 42, width: 10, scale: 0.9, maxCleanValue: V.grease, currentCleanValue: V.grease, requiredTool: "spray", image: dirt("grease", 2) },
  { id: "kit-stain-1", type: "stain", x: 50, y: 66, width: 14, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 0) },
  { id: "kit-stain-2", type: "stain", x: 78, y: 70, width: 11, flip: true, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 4) },
  { id: "kit-dust-1", type: "dust", x: 34, y: 74, width: 12, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 1) },
  { id: "kit-dust-2", type: "dust", x: 62, y: 78, width: 11, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 3) },
  { id: "kit-cobweb-1", type: "cobweb", x: 10, y: 24, width: 14, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 0) },
  { id: "kit-cobweb-2", type: "cobweb", x: 89, y: 24, width: 14, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 2) },
  { id: "kit-trash-1", type: "trash", x: 82, y: 60, width: 11, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-dishes-01.png"), hasMemory: true },
  { id: "kit-trash-2", type: "trash", x: 40, y: 60, width: 9, rotation: -8, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-bag-01.png") },
];

/** 욕실 — 곰팡이4 · 얼룩2 · 먼지1 · 거미줄2 · 쓰레기2 = 11개 */
export const BATHROOM_ITEMS: CleanableItem[] = [
  { id: "bath-mold-1", type: "mold", x: 20, y: 40, width: 13, maxCleanValue: V.mold, currentCleanValue: V.mold, requiredTool: "brush", image: dirt("mold", 0) },
  { id: "bath-mold-2", type: "mold", x: 45, y: 44, width: 14, flip: true, maxCleanValue: V.mold, currentCleanValue: V.mold, requiredTool: "brush", image: dirt("mold", 1) },
  { id: "bath-mold-3", type: "mold", x: 68, y: 42, width: 12, maxCleanValue: V.mold, currentCleanValue: V.mold, requiredTool: "brush", image: dirt("mold", 2) },
  { id: "bath-mold-4", type: "mold", x: 84, y: 56, width: 11, scale: 0.9, maxCleanValue: V.mold, currentCleanValue: V.mold, requiredTool: "brush", image: dirt("mold", 0) },
  { id: "bath-stain-1", type: "stain", x: 40, y: 68, width: 14, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 3) },
  { id: "bath-stain-2", type: "stain", x: 66, y: 72, width: 11, flip: true, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 0) },
  { id: "bath-dust-1", type: "dust", x: 30, y: 78, width: 11, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 2) },
  { id: "bath-cobweb-1", type: "cobweb", x: 9, y: 24, width: 13, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 3) },
  { id: "bath-cobweb-2", type: "cobweb", x: 90, y: 24, width: 13, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 0) },
  { id: "bath-trash-1", type: "trash", x: 24, y: 62, width: 8, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-bottle-01.png"), hasMemory: true },
  { id: "bath-trash-2", type: "trash", x: 74, y: 60, width: 9, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-towel-01.png") },
];

/** 아이방 — 쓰레기(장난감)4 · 먼지2 · 얼룩2 · 거미줄1 = 9개 */
export const CHILD_ROOM_ITEMS: CleanableItem[] = [
  { id: "chd-toy-1", type: "trash", x: 36, y: 64, width: 11, rotation: -6, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("toy-blocks-01.png") },
  { id: "chd-toy-2", type: "trash", x: 58, y: 68, width: 10, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("toy-ball-01.png") },
  { id: "chd-toy-3", type: "trash", x: 72, y: 60, width: 12, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("toy-bear-01.png"), hasMemory: true },
  { id: "chd-toy-4", type: "trash", x: 46, y: 74, width: 9, rotation: 10, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-paper-02.png") },
  { id: "chd-dust-1", type: "dust", x: 26, y: 72, width: 12, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 0) },
  { id: "chd-dust-2", type: "dust", x: 82, y: 70, width: 11, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 3) },
  { id: "chd-stain-1", type: "stain", x: 44, y: 50, width: 13, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 2) },
  { id: "chd-stain-2", type: "stain", x: 64, y: 44, width: 11, flip: true, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 1) },
  { id: "chd-cobweb-1", type: "cobweb", x: 88, y: 24, width: 14, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 1) },
];

/** 다락방 — 먼지3 · 거미줄4 · 쓰레기(상자)3 · 얼룩1 = 11개 */
export const ATTIC_ITEMS: CleanableItem[] = [
  { id: "att-dust-1", type: "dust", x: 30, y: 72, width: 14, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 0) },
  { id: "att-dust-2", type: "dust", x: 54, y: 76, width: 13, flip: true, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 1) },
  { id: "att-dust-3", type: "dust", x: 76, y: 70, width: 11, maxCleanValue: V.dust, currentCleanValue: V.dust, requiredTool: "broom", image: dirt("dust", 2) },
  { id: "att-cobweb-1", type: "cobweb", x: 8, y: 24, width: 16, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 0) },
  { id: "att-cobweb-2", type: "cobweb", x: 91, y: 24, width: 16, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 1) },
  { id: "att-cobweb-3", type: "cobweb", x: 14, y: 36, width: 13, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 2) },
  { id: "att-cobweb-4", type: "cobweb", x: 84, y: 38, width: 12, flip: true, maxCleanValue: V.cobweb, currentCleanValue: V.cobweb, requiredTool: "duster", image: dirt("cobweb", 3) },
  { id: "att-trash-1", type: "trash", x: 40, y: 60, width: 12, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-box-01.png"), hasMemory: true },
  { id: "att-trash-2", type: "trash", x: 64, y: 62, width: 12, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-box-02.png") },
  { id: "att-trash-3", type: "trash", x: 52, y: 52, width: 9, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-newspaper-01.png") },
  { id: "att-stain-1", type: "stain", x: 26, y: 54, width: 12, maxCleanValue: V.stain, currentCleanValue: V.stain, requiredTool: "cloth", image: dirt("stain", 4) },
];

/** 마당 — 낙엽3 · 잡초3 · 쓰레기2 = 8개 */
export const GARDEN_ITEMS: CleanableItem[] = [
  { id: "gar-leaves-1", type: "leaves", x: 36, y: 66, width: 15, maxCleanValue: V.leaves, currentCleanValue: V.leaves, requiredTool: "rake", image: dirt("leaves", 0) },
  { id: "gar-leaves-2", type: "leaves", x: 58, y: 72, width: 16, flip: true, maxCleanValue: V.leaves, currentCleanValue: V.leaves, requiredTool: "rake", image: dirt("leaves", 1) },
  { id: "gar-leaves-3", type: "leaves", x: 74, y: 62, width: 13, maxCleanValue: V.leaves, currentCleanValue: V.leaves, requiredTool: "rake", image: dirt("leaves", 2) },
  { id: "gar-weeds-1", type: "weeds", x: 26, y: 58, width: 10, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: dirt("weeds", 0) },
  { id: "gar-weeds-2", type: "weeds", x: 48, y: 54, width: 11, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: dirt("weeds", 1) },
  { id: "gar-weeds-3", type: "weeds", x: 66, y: 50, width: 10, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: dirt("weeds", 2), hasMemory: true },
  { id: "gar-trash-1", type: "trash", x: 40, y: 78, width: 12, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-branch-01.png") },
  { id: "gar-trash-2", type: "trash", x: 80, y: 74, width: 10, flip: true, maxCleanValue: V.pickup, currentCleanValue: V.pickup, requiredTool: "hand", image: obj("trash-pot-01.png") },
];

/** 게임에 등장하는 방들 (순서대로 진행) */
export const ROOMS: RoomDef[] = [
  {
    id: "living-room",
    name: "거실",
    goal: "거실을 깨끗하게 만들기",
    theme: "livingRoom",
    dirtyImage: ROOM_DIRTY_IMAGE,
    cleanImage: ROOM_CLEAN_IMAGE,
    items: LIVING_ROOM_ITEMS,
    dialogue: LIVING_ROOM_DIALOGUE,
    memory: FAMILY_PHOTO_MEMORY,
  },
  {
    id: "bedroom",
    name: "침실",
    goal: "침실을 포근하게 되살리기",
    theme: "bedroom",
    dirtyImage: roomImg("bedroom", "dirty"),
    cleanImage: roomImg("bedroom", "clean"),
    items: BEDROOM_ITEMS,
    dialogue: BEDROOM_DIALOGUE,
    memory: MUSIC_BOX_MEMORY,
  },
  {
    id: "kitchen",
    name: "부엌",
    goal: "부엌 기름때를 말끔히 닦기",
    theme: "livingRoom",
    dirtyImage: roomImg("kitchen", "dirty"),
    cleanImage: roomImg("kitchen", "clean"),
    items: KITCHEN_ITEMS,
    dialogue: KITCHEN_DIALOGUE,
    memory: RECIPE_NOTE_MEMORY,
  },
  {
    id: "bathroom",
    name: "욕실",
    goal: "욕실 곰팡이를 없애기",
    theme: "livingRoom",
    dirtyImage: roomImg("bathroom", "dirty"),
    cleanImage: roomImg("bathroom", "clean"),
    items: BATHROOM_ITEMS,
    dialogue: BATHROOM_DIALOGUE,
    memory: RUBBER_DUCK_MEMORY,
  },
  {
    id: "child-room",
    name: "아이방",
    goal: "아이방을 정리하기",
    theme: "livingRoom",
    dirtyImage: roomImg("child-room", "dirty"),
    cleanImage: roomImg("child-room", "clean"),
    items: CHILD_ROOM_ITEMS,
    dialogue: CHILD_ROOM_DIALOGUE,
    memory: CRAYON_DIARY_MEMORY,
  },
  {
    id: "attic",
    name: "다락방",
    goal: "다락방 먼지를 걷어내기",
    theme: "livingRoom",
    dirtyImage: roomImg("attic", "dirty"),
    cleanImage: roomImg("attic", "clean"),
    items: ATTIC_ITEMS,
    dialogue: ATTIC_DIALOGUE,
    memory: OLD_LETTERS_MEMORY,
  },
  {
    id: "garden",
    name: "마당",
    goal: "마당을 되살리기",
    theme: "bedroom",
    dirtyImage: roomImg("garden", "dirty"),
    cleanImage: roomImg("garden", "clean"),
    items: GARDEN_ITEMS,
    dialogue: GARDEN_DIALOGUE,
    memory: TIME_CAPSULE_MEMORY,
  },
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
