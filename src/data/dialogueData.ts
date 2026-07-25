import type { MemoryItem, RoomDialogue } from "../types/game";
import { GHOST_NAME } from "./ghostData";
import { ASSETS } from "./assets";

/** 거실 대사 (stages 인덱스 0:sad 1:normal 2:surprised 3:완료) */
export const LIVING_ROOM_DIALOGUE: RoomDialogue = {
  intro: {
    id: "living-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "여기서 계속 자고 있었는데,\n먼지가 너무 많아서 잠을 잘 수가 없어…",
      "혹시 조금만 도와줄 수 있을까?\n거실을 함께 깨끗하게 만들어줘.",
    ],
  },
  stages: [
    { id: "living-0", name: GHOST_NAME, mood: "sad", lines: ["먼지가 너무 많아서 잠을 잘 수가 없어…"] },
    { id: "living-1", name: GHOST_NAME, mood: "normal", lines: ["조금씩 예전 모습이 돌아오는 것 같아."] },
    { id: "living-2", name: GHOST_NAME, mood: "surprised", lines: ["거실이 점점 따뜻해지고 있어!"] },
    {
      id: "living-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "와… 거실이 다시 따뜻해졌어.",
        "그런데… 안쪽 침실도 오랫동안 방치돼 있었어.\n거기도 함께 가볼까?",
      ],
    },
  ],
};

/** 침실 대사 */
export const BEDROOM_DIALOGUE: RoomDialogue = {
  intro: {
    id: "bedroom-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "여기가 내가 제일 아끼던 침실이야.",
      "먼지랑 거미줄로 뒤덮여서…\n포근했던 그 느낌이 하나도 안 남았어.",
    ],
  },
  stages: [
    { id: "bedroom-0", name: GHOST_NAME, mood: "sad", lines: ["이불에서 먼지 냄새가 나…"] },
    { id: "bedroom-1", name: GHOST_NAME, mood: "normal", lines: ["오, 침대가 다시 보이기 시작했어!"] },
    { id: "bedroom-2", name: GHOST_NAME, mood: "surprised", lines: ["창으로 달빛이 들어오고 있어!"] },
    {
      id: "bedroom-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "이제 정말 포근해졌어.",
        "덕분에 오랜만에 푹 잘 수 있겠어.\n정말, 정말 고마워.",
      ],
    },
  ],
};

/** 추억 — 거실: 낡은 가족사진 */
export const FAMILY_PHOTO_MEMORY: MemoryItem = {
  id: "family-photo",
  title: "낡은 가족사진",
  description: "몽실이 이 집에서 가장 좋아했던 순간이 담겨 있습니다.",
  icon: "🖼️",
  image: ASSETS.memories.familyPhotoFound,
  roomId: "living-room",
  roomLabel: "거실",
};

/** 추억 — 침실: 자장가 오르골 */
export const MUSIC_BOX_MEMORY: MemoryItem = {
  id: "music-box",
  title: "낡은 오르골",
  description: "태엽을 감으면, 몽실이 매일 밤 듣던 자장가가 흘러나옵니다.",
  icon: "🎵",
  roomId: "bedroom",
  roomLabel: "침실",
};
