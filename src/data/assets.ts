import { asset } from "../utils/asset";

/** asset-manifest.json 의 경로들을 코드에서 쓰기 위한 중앙 모듈. */
export const ASSETS = {
  title: {
    background: asset("/assets/title/title-background.webp"),
    mongsil: asset("/assets/title/title-mongsil.png"),
  },
  tools: {
    hand: asset("/assets/tools/tool-hand.png"),
    cloth: asset("/assets/tools/tool-cloth.png"),
    duster: asset("/assets/tools/tool-duster.png"),
    broom: asset("/assets/tools/tool-broom.png"),
  },
  effects: {
    sparkleSmall01: asset("/assets/effects/sparkle-small-01.png"),
    sparkleSmall02: asset("/assets/effects/sparkle-small-02.png"),
    sparkleCluster: asset("/assets/effects/sparkle-cluster.png"),
    cleanShine: asset("/assets/effects/clean-shine.png"),
    ghostGlow: asset("/assets/effects/ghost-glow.png"),
    memoryGlow: asset("/assets/effects/memory-glow.png"),
    dustParticle: asset("/assets/effects/dust-particle.png"),
  },
  // 청소 시 튀기는 티끌 파티클 (에셋이 없으면 CSS 점으로 대체된다)
  particles: {
    dust: [
      asset("/assets/effects/dust-particle.png"),
      asset("/assets/cleanables/dust/dust-puff-01.png"),
      asset("/assets/cleanables/dust/dust-puff-02.png"),
    ],
    sparkle: [
      asset("/assets/effects/sparkle-small-01.png"),
      asset("/assets/effects/sparkle-small-02.png"),
    ],
  },
  // 몽실 프레임 애니메이션 (프레임 로드 실패 시 정적 표정 이미지로 폴백)
  ghostAnim: {
    idleFloat: [
      asset("/assets/ghosts/mongsil/animation/idle-float-01.png"),
      asset("/assets/ghosts/mongsil/animation/idle-float-02.png"),
      asset("/assets/ghosts/mongsil/animation/idle-float-03.png"),
      asset("/assets/ghosts/mongsil/animation/idle-float-04.png"),
      asset("/assets/ghosts/mongsil/animation/idle-float-05.png"),
      asset("/assets/ghosts/mongsil/animation/idle-float-06.png"),
    ],
    happyBounce: [
      asset("/assets/ghosts/mongsil/animation/happy-bounce-01.png"),
      asset("/assets/ghosts/mongsil/animation/happy-bounce-02.png"),
      asset("/assets/ghosts/mongsil/animation/happy-bounce-03.png"),
      asset("/assets/ghosts/mongsil/animation/happy-bounce-04.png"),
    ],
  },
  ui: {
    dialogueGhostFrame: asset("/assets/ui/dialogue-ghost-frame.png"),
    memoryCardDecoration: asset("/assets/ui/memory-card-decoration.png"),
    roomCompleteDecoration: asset("/assets/ui/room-complete-decoration.png"),
    objectiveIcon: asset("/assets/ui/objective-icon.png"),
    progressLeaf: asset("/assets/ui/progress-leaf.png"),
  },
  memories: {
    familyPhotoFound: asset("/assets/memories/family-photo-found.png"),
    familyPhotoRestored: asset("/assets/memories/family-photo-restored.png"),
  },
  overlays: {
    warm30: asset("/assets/rooms/overlays/warm-light-30.png"),
    warm60: asset("/assets/rooms/overlays/warm-light-60.png"),
    warm90: asset("/assets/rooms/overlays/warm-light-90.png"),
    window: asset("/assets/rooms/overlays/window-light.png"),
    fireplace: asset("/assets/rooms/overlays/fireplace-glow.png"),
  },
} as const;
