# 몽실의 방 — 유령 청소 힐링 게임 (MVP)

Unity 없이 **React + Vite + TypeScript** 로 만든 2.5D 유령 청소 힐링 게임 프로토타입입니다.
오래된 거실에 사는 외로운 유령 **몽실**을 위해 방을 청소해 따뜻한 공간으로 되돌려 줍니다.
유령은 적이 아니라 NPC이며, 청소가 끝나도 사라지지 않고 깨끗해진 방에서 편히 잠듭니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

## 조작

- **도구 선택**: 화면 하단 툴바 클릭 또는 키보드 `1` 손 · `2` 걸레 · `3` 먼지털이 · `4` 빗자루
- **청소**: 오염물을 누르거나 문지르기 (마우스/터치 모두 지원 · Pointer Events)
  - 먼지 → 빗자루로 쓸기 · 거미줄 → 먼지털이로 걷기 · 얼룩 → 걸레로 여러 번 닦기 · 쓰레기 → 손으로 줍기
  - 잘못된 도구를 쓰면 안내 문구가 뜨고 청소되지 않습니다.
- 상단 우측: 🔊 배경음 음소거 토글 · ↺ 게임 초기화

## 구현된 기능

- 레이어 구조 게임 화면 (배경 · 장식 · 오염물 · 유령 · 이펙트 · UI), 퍼센트 좌표 기반
- 진행도에 따라 깨끗한 배경이 서서히 나타나고 어두운 필터가 옅어지는 전환
- 데이터 기반 오염물 12개 (먼지4 · 거미줄2 · 쓰레기3 · 얼룩3), 위치/크기/회전/반전 다양화
- 각 오브젝트의 청소 수치 기반 전체 진행도 계산 + 남은 오염물 수 표시
- 유령 몽실: 둥둥 떠다니기 + 좌우 기울기 + 방 안 여러 위치 순회 + 진행도별 표정 변화
- 대화 시스템: 첫 대화, 구간별(0–29/30–69/70–99/100%) 1회 대사, 완료 대사 (대화 중 청소 입력 차단)
- 추억 아이템: 특정 쓰레기를 치우면 "낡은 가족사진" 발견 팝업
- 청소 완료 연출: 따뜻한 조명 + 반짝이 파티클 + 유령 행복 점프 + 완료 카드 + 다음 방 버튼
- 시작 화면 / 결과 카드 / localStorage 저장·이어하기 / 초기화
- 반응형 16:9 스테이지, 세로 화면 가로 권장 안내, `prefers-reduced-motion` 대응, aria-label·progressbar 등 접근성

## 에셋 교체 경로

이미지·사운드는 **모두 선택 사항**이며, 없으면 CSS 플레이스홀더와 무음으로 정상 동작합니다.
아래 경로에 파일을 넣으면 자동으로 실제 에셋이 사용됩니다. (자세한 내용은 `public/assets/README.md`)

| 종류 | 경로 |
| --- | --- |
| 방 배경 (더러움/깨끗함) | `public/assets/rooms/living-room-dirty.webp`, `living-room-clean.webp` |
| 유령 표정 | `public/assets/ghosts/mongsil-{normal,sad,happy,surprised,sleep}.png` |
| 오염물 | `public/assets/cleanables/{dust,cobweb,trash,stain}.png` |
| 사운드 | `public/assets/audio/{bgm-room,clean-dust,clean-stain,trash-pickup,ghost-happy,room-complete}.mp3` |

## 현재 플레이스홀더로 처리된 부분

- **방 배경**: CSS 그라디언트로 그린 쿼터뷰 방(벽 + 원근 바닥 + 러그 + 창문)
- **유령 몽실**: 표정별 CSS 블롭(눈·볼·입) — 대화창/모달에서는 이모지 얼굴
- **오염물**: 종류별 색상 블롭 + 이모지(🌫️ 🕸️ 🗑️ 🟤)
- **사운드**: 파일이 없으면 조용히 무시 (오류 없음)

## 폴더 구조

```
src/
├── components/
│   ├── game/  GameScene · RoomBackground · CleanableItem · Ghost · CleaningEffects
│   ├── ui/    ToolBar · ProgressPanel · DialogueBox · MemoryPopup · CompletionModal · Toast
│   └── common/ StartScreen · GhostFace
├── data/   roomData · ghostData · dialogueData
├── hooks/  useGameProgress · useCleaning · useGhostMovement · useAudio
├── types/  game.ts
├── utils/  audio.ts · storage.ts
└── styles/ tokens.css · global.css
```

## 추후 추가하면 좋은 기능

- 침실 등 추가 방 해금 및 방별 데이터 세트
- 실제 일러스트·효과음 에셋 적용
- 청소 파티클(먼지 흩날림) 및 도구별 커서/사운드 다양화
- 추억 컬렉션(도감) 화면과 몽실의 이야기 확장
- 청소 완료도에 따른 별점/보상 시스템

## 빌드 테스트 결과

`npm run build` 성공 — `tsc -b` 타입 체크 통과, 67개 모듈 변환, 콘솔 오류 없음.
브라우저 실사용 검증 완료: 시작 → 대화 → 청소(진행도·잘못된 도구 안내) → 추억 발견 → 저장/이어하기까지 정상 동작.
