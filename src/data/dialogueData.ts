import type { DialogueContent, MemoryItem } from "../types/game";
import { GHOST_NAME } from "./ghostData";

/** 게임 시작 시 첫 대화 */
export const INTRO_DIALOGUE: DialogueContent = {
  id: "intro",
  name: GHOST_NAME,
  mood: "sad",
  lines: [
    "여기서 계속 자고 있었는데,\n먼지가 너무 많아서 잠을 잘 수가 없어…",
    "혹시 조금만 도와줄 수 있을까?\n방을 함께 깨끗하게 만들어줘.",
  ],
};

/** 진행 구간별 중간 대사 (인덱스 0:sad 1:normal 2:surprised 3:완료) */
export const STAGE_DIALOGUES: DialogueContent[] = [
  { id: "stage-0", name: GHOST_NAME, mood: "sad", lines: ["먼지가 너무 많아서 잠을 잘 수가 없어…"] },
  { id: "stage-1", name: GHOST_NAME, mood: "normal", lines: ["조금씩 예전 모습이 돌아오는 것 같아."] },
  { id: "stage-2", name: GHOST_NAME, mood: "surprised", lines: ["방이 점점 따뜻해지고 있어!"] },
  {
    id: "stage-3",
    name: GHOST_NAME,
    mood: "happy",
    lines: [
      "와… 방이 다시 따뜻해졌어.",
      "이제 여기서 편하게 잘 수 있겠다.\n정말 고마워!",
    ],
  },
];

export const COMPLETION_DIALOGUE = STAGE_DIALOGUES[3];

/** 추억 아이템 — 낡은 가족사진 */
export const FAMILY_PHOTO_MEMORY: MemoryItem = {
  id: "family-photo",
  title: "낡은 가족사진",
  description: "몽실이 이 집에서 가장 좋아했던 순간이 담겨 있습니다.",
  icon: "🖼️",
};
