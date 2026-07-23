# 몽실의 방 에셋 사용 가이드

## 1. 아트 콘셉트와 시점

모든 에셋은 부드러운 2.5D 손그림풍과 약 35도 쿼터뷰를 기준으로 한다. 배경은 16:9, 캐릭터·오브젝트는 투명 PNG다. 몽실의 고정 디자인은 `ART_STYLE_GUIDE.md`를 따른다.

## 2. 배경 사용

```ts
const dirty = "/assets/rooms/living-room-dirty.webp";
const clean = "/assets/rooms/living-room-clean.webp";
```

두 이미지는 동일한 2048×1152 구조다. 같은 위치에 겹친 뒤 청소 진행도에 맞춰 깨끗한 배경의 `opacity`만 올린다.

```css
.room-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 3. 조명 오버레이

`rooms/overlays`의 PNG는 배경과 같은 2048×1152 좌표계다. `mix-blend-mode: screen`은 선택 사항이며, 기본 `opacity` 합성만으로도 동작한다. `warm-light-30/60/90`은 진행 단계용이고 `window-light`, `fireplace-glow`는 국소 강조용이다.

## 4. 청소 오브젝트 권장 크기

- 먼지·얼룩·작은 쓰레기: 화면 너비의 7–14%
- 모서리 거미줄: 12–18%
- 넓은 거미줄: 18–28%
- 큰 상자·책: 8–12%

각 파일에는 충분한 투명 여백이 있으므로 CSS의 `width`, `rotate`, `scale`, `opacity`로 자연스럽게 변형한다.

## 5. 몽실 사용

기본 경로는 `/assets/ghosts/mongsil/`이다. 표정 파일은 모두 1024×1024이며 캐릭터 중심과 비율이 고정되어 있다. `thankful`은 완료 대화, `sleep`은 대기·타이틀, `surprised`는 70% 전후 진행 구간에 권장한다.

## 6. 애니메이션

`animation/idle-float-01..06.png`는 1024×1024 프레임이며 8–10fps 왕복 재생을 권장한다. `happy-bounce-01..04.png`는 10–12fps 반복에 적합하다. 이미지 프레임 대신 CSS 이동을 사용할 경우 다음 값이 안전하다.

```css
@keyframes mongsil-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2.5%); }
}
```

표정 파일에 CSS 이동을 적용하는 방식이 가장 선명하고 용량도 작다.

## 7. 도구 아이콘

- `tool-hand`: 쓰레기 줍기
- `tool-cloth`: 얼룩 닦기
- `tool-duster`: 거미줄 제거
- `tool-broom`: 먼지 쓸기

모두 512×512이며 버튼 배경은 포함하지 않는다.

## 8. 효과와 UI 장식

효과는 `/assets/effects/`, UI 장식은 `/assets/ui/`에서 불러온다. 효과 PNG는 회전·크기·투명도 애니메이션에 맞춰 설계됐다. UI 장식 파일은 완성 패널이 아니므로 React/CSS 박스 위에 작은 장식으로 배치한다.

## 9. 알파 주의사항

모든 투명 에셋은 RGBA PNG다. 브라우저에서 가장자리 번짐을 피하려면 `image-rendering`을 강제하지 말고 기본 보간을 사용한다. 반투명 광원과 얼룩은 불투명 배경 위에 먼저 테스트한다.

## 10. 메모리 아이템

`family-photo-found.png`와 `family-photo-restored.png`는 동일한 프레임·각도·구도다. 발견 상태에서 복원 상태로 교체하거나 짧은 교차 페이드한다.

## 11. 타이틀

`title-background.webp` 위에 `title-mongsil.png`를 별도 레이어로 배치한다. 배경 자체에는 제목, 로고, 버튼이 포함되지 않는다.

## 12. 코드 경로

모든 런타임 경로는 Vite의 `public` 기준 절대경로(`/assets/...`)다. 전체 경로 목록은 `/assets/asset-manifest.json`에서 읽을 수 있다.

## 13. 제작 방식

핵심 거실과 캐릭터는 OpenAI 내장 이미지 생성/편집 방식으로 제작했다. 투명 에셋은 단색 크로마 키 배경을 제거하고 알파를 검수했다. 조명 오버레이와 애니메이션 프레임은 기준 이미지의 좌표와 캐릭터 정체성을 보존하기 위해 로컬에서 결정적으로 파생했다.
