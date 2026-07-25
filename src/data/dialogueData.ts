import type { MemoryItem, RoomDialogue } from "../types/game";
import { GHOST_NAME } from "./ghostData";
import { ASSETS } from "./assets";

/** 거실 대사 (stages 인덱스 0:sad 1:normal 2:surprised 3:완료→다음 방 힌트) */
export const LIVING_ROOM_DIALOGUE: RoomDialogue = {
  intro: {
    id: "living-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "여기서 계속 잠들어 있었는데,\n먼지가 너무 많아서 도무지 잠을 잘 수가 없어…",
      "혹시 조금만 도와줄래?\n이 집을 함께 깨끗하게 치워줘.",
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
        "이상하지, 여기 있으니 왠지 마음이 놓여.\n안쪽 침실도 함께 가볼까?",
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
      "여긴 침실이네. 침대가 놓여 있어.",
      "먼지랑 거미줄이 잔뜩이야.\n다시 포근하게 되돌려주자.",
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
        "포근하다… 이 침대, 왠지 낯설지가 않아.",
        "기분 탓이겠지? 다음은 부엌으로 가보자.",
      ],
    },
  ],
};

/** 부엌 대사 */
export const KITCHEN_DIALOGUE: RoomDialogue = {
  intro: {
    id: "kitchen-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "여긴 부엌이야. 식탁이 놓여 있네.",
      "레인지랑 조리대에 기름때가 잔뜩이야.\n분무기로 뿌리고 닦아보자.",
    ],
  },
  stages: [
    { id: "kitchen-0", name: GHOST_NAME, mood: "sad", lines: ["기름때가 너무 끈적해…"] },
    { id: "kitchen-1", name: GHOST_NAME, mood: "normal", lines: ["조리대가 반짝이기 시작했어!"] },
    { id: "kitchen-2", name: GHOST_NAME, mood: "surprised", lines: ["따뜻한 저녁 냄새가 나는 것 같아!"] },
    {
      id: "kitchen-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "부엌이 반짝여! 그런데 이 냄새…\n어쩐지 그리운걸.",
        "여기서 누군가랑 밥을 먹었던 것 같기도 해.\n이번엔 욕실로 가보자.",
      ],
    },
  ],
};

/** 욕실 대사 */
export const BATHROOM_DIALOGUE: RoomDialogue = {
  intro: {
    id: "bathroom-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "타일 사이사이 곰팡이가 잔뜩 폈어.",
      "솔로 박박 문질러야 지워질 거야.\n조금 힘들지도 몰라.",
    ],
  },
  stages: [
    { id: "bathroom-0", name: GHOST_NAME, mood: "sad", lines: ["곰팡이 냄새가 가득해…"] },
    { id: "bathroom-1", name: GHOST_NAME, mood: "normal", lines: ["타일이 하얗게 돌아오고 있어!"] },
    { id: "bathroom-2", name: GHOST_NAME, mood: "surprised", lines: ["거울이 다시 맑아졌어!"] },
    {
      id: "bathroom-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "우와 개운해! …근데 정말 이상해.",
        "이 집 구석구석이 자꾸 익숙하게 느껴져.\n다음은 아이방이야.",
      ],
    },
  ],
};

/** 아이방 대사 */
export const CHILD_ROOM_DIALOGUE: RoomDialogue = {
  intro: {
    id: "child-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "여긴 아이 방인가 봐. 장난감이 많네.",
      "여기저기 흩어져 있어.\n하나씩 주워서 정리해줄래?",
    ],
  },
  stages: [
    { id: "child-0", name: GHOST_NAME, mood: "sad", lines: ["장난감이 먼지를 뒤집어썼어…"] },
    { id: "child-1", name: GHOST_NAME, mood: "normal", lines: ["바닥이 보이기 시작했어!"] },
    { id: "child-2", name: GHOST_NAME, mood: "surprised", lines: ["별자리 모빌이 다시 반짝여!"] },
    {
      id: "child-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "정리 끝! 이 장난감이랑 그림들…\n어쩐지 내가 아는 것 같아.",
        "이제 다락방만 남았어. 가보자.",
      ],
    },
  ],
};

/** 다락방 대사 */
export const ATTIC_DIALOGUE: RoomDialogue = {
  intro: {
    id: "attic-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "먼지가 제일 두껍게 쌓인 곳이야.",
      "거미줄도 많고… 낡은 상자들이 잔뜩이지.\n조심히 치워보자.",
    ],
  },
  stages: [
    { id: "attic-0", name: GHOST_NAME, mood: "sad", lines: ["먼지 때문에 앞이 잘 안 보여…"] },
    { id: "attic-1", name: GHOST_NAME, mood: "normal", lines: ["창으로 햇살이 들어와!"] },
    { id: "attic-2", name: GHOST_NAME, mood: "surprised", lines: ["오래된 물건들이 반짝여!"] },
    {
      id: "attic-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "다락방까지 깨끗해졌어.\n편지 속 이름들이… 왜 이렇게 낯익지?",
        "나, 혹시… 아니야.\n마지막으로 마당에 나가보자.",
      ],
    },
  ],
};

/** 마당 대사 (마지막 방) */
export const GARDEN_DIALOGUE: RoomDialogue = {
  intro: {
    id: "garden-intro",
    name: GHOST_NAME,
    mood: "sad",
    lines: [
      "밖으로 나오니 마당이 있네.",
      "낙엽이랑 잡초가 무성해.\n갈퀴로 긁고, 잡초는 손으로 뽑아줘.",
    ],
  },
  stages: [
    { id: "garden-0", name: GHOST_NAME, mood: "sad", lines: ["잔디가 낙엽에 다 가려졌어…"] },
    { id: "garden-1", name: GHOST_NAME, mood: "normal", lines: ["초록 잔디가 보이기 시작했어!"] },
    { id: "garden-2", name: GHOST_NAME, mood: "surprised", lines: ["노을빛이 정말 예쁘다!"] },
    {
      id: "garden-3",
      name: GHOST_NAME,
      mood: "happy",
      lines: [
        "온 집이 다시 따뜻해졌어.",
        "먼지를 다 걷어내고 나니…\n이제야 알 것 같아.",
      ],
    },
  ],
};

/** 추억 — 거실: 낡은 가족사진 */
export const FAMILY_PHOTO_MEMORY: MemoryItem = {
  id: "family-photo",
  title: "낡은 가족사진",
  description: "창밖을 함께 바라보는 가족의 뒷모습. 어딘가 낯익은 풍경입니다.",
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
  image: ASSETS.memories.musicBox,
  roomId: "bedroom",
  roomLabel: "침실",
};

/** 추억 — 부엌: 손때 묻은 레시피 노트 */
export const RECIPE_NOTE_MEMORY: MemoryItem = {
  id: "recipe-note",
  title: "손때 묻은 레시피 노트",
  description: "엄마의 글씨로 적힌, 온 가족이 좋아하던 저녁 메뉴들.",
  icon: "📓",
  image: ASSETS.memories.recipeNote,
  roomId: "kitchen",
  roomLabel: "부엌",
};

/** 추억 — 욕실: 빛바랜 고무오리 */
export const RUBBER_DUCK_MEMORY: MemoryItem = {
  id: "rubber-duck",
  title: "빛바랜 고무오리",
  description: "매일 저녁 목욕 시간마다 함께였던 작은 친구.",
  icon: "🦆",
  image: ASSETS.memories.rubberDuck,
  roomId: "bathroom",
  roomLabel: "욕실",
};

/** 추억 — 아이방: 크레용 그림일기 */
export const CRAYON_DIARY_MEMORY: MemoryItem = {
  id: "crayon-diary",
  title: "크레용 그림일기",
  description: "삐뚤빼뚤한 그림 속에, 웃고 있는 가족이 그려져 있습니다.",
  icon: "🖍️",
  image: ASSETS.memories.crayonDiary,
  roomId: "child-room",
  roomLabel: "아이방",
};

/** 추억 — 다락: 리본으로 묶인 편지 뭉치 */
export const OLD_LETTERS_MEMORY: MemoryItem = {
  id: "old-letters",
  title: "오래된 편지 뭉치",
  description: "멀리 있어도 서로를 잊지 않았던, 따뜻한 안부들.",
  icon: "✉️",
  image: ASSETS.memories.oldLetters,
  roomId: "attic",
  roomLabel: "다락방",
};

/** 추억 — 마당: 흙 묻은 타임캡슐 */
export const TIME_CAPSULE_MEMORY: MemoryItem = {
  id: "time-capsule",
  title: "묻어둔 타임캡슐",
  description: "언젠가 다시 열어보자던 약속이 담긴 작은 양철통.",
  icon: "🕰️",
  image: ASSETS.memories.timeCapsule,
  roomId: "garden",
  roomLabel: "마당",
};
