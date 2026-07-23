/** asset-manifest.json 의 경로들을 코드에서 쓰기 위한 중앙 모듈. */
export const ASSETS = {
  title: {
    background: "/assets/title/title-background.webp",
    mongsil: "/assets/title/title-mongsil.png",
  },
  tools: {
    hand: "/assets/tools/tool-hand.png",
    cloth: "/assets/tools/tool-cloth.png",
    duster: "/assets/tools/tool-duster.png",
    broom: "/assets/tools/tool-broom.png",
  },
  effects: {
    sparkleSmall01: "/assets/effects/sparkle-small-01.png",
    sparkleSmall02: "/assets/effects/sparkle-small-02.png",
    sparkleCluster: "/assets/effects/sparkle-cluster.png",
    cleanShine: "/assets/effects/clean-shine.png",
    ghostGlow: "/assets/effects/ghost-glow.png",
    memoryGlow: "/assets/effects/memory-glow.png",
    dustParticle: "/assets/effects/dust-particle.png",
  },
  ui: {
    dialogueGhostFrame: "/assets/ui/dialogue-ghost-frame.png",
    memoryCardDecoration: "/assets/ui/memory-card-decoration.png",
    roomCompleteDecoration: "/assets/ui/room-complete-decoration.png",
    objectiveIcon: "/assets/ui/objective-icon.png",
    progressLeaf: "/assets/ui/progress-leaf.png",
  },
  memories: {
    familyPhotoFound: "/assets/memories/family-photo-found.png",
    familyPhotoRestored: "/assets/memories/family-photo-restored.png",
  },
  overlays: {
    warm30: "/assets/rooms/overlays/warm-light-30.png",
    warm60: "/assets/rooms/overlays/warm-light-60.png",
    warm90: "/assets/rooms/overlays/warm-light-90.png",
    window: "/assets/rooms/overlays/window-light.png",
    fireplace: "/assets/rooms/overlays/fireplace-glow.png",
  },
} as const;
