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
