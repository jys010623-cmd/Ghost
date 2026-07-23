import { useRef, useState, type PointerEvent } from "react";
import type { CleanableItem as CleanableItemData } from "../../types/game";
import { CLEANABLE_STYLE } from "../../data/roomData";
import type { InteractPhase } from "../../hooks/useCleaning";
import styles from "./CleanableItem.module.css";

interface CleanableItemProps {
  item: CleanableItemData;
  disabled: boolean;
  onInteract: (item: CleanableItemData, phase: InteractPhase) => void;
}

export function CleanableItem({ item, disabled, onInteract }: CleanableItemProps) {
  const [imgOk, setImgOk] = useState(true);
  const pressed = useRef(false);
  const style = CLEANABLE_STYLE[item.type];

  const ratio = item.currentCleanValue / item.maxCleanValue;
  const opacity = Math.max(0, ratio);

  const handleDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    pressed.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* 무시 */
    }
    onInteract(item, "down");
  };

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || !pressed.current) return;
    // 눌린 상태에서 이동할 때만 문지르기 (버튼 눌림 확인)
    if (e.buttons === 0 && e.pointerType === "mouse") {
      pressed.current = false;
      return;
    }
    onInteract(item, "move");
  };

  const endPress = () => {
    pressed.current = false;
  };

  const label = `${style.label} (${item.currentCleanValue > 0 ? "청소 필요" : "청소 완료"})`;

  return (
    <div
      className={styles.item}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        opacity,
        transform: `translate(-50%, -50%) rotate(${item.rotation ?? 0}deg) scale(${item.scale ?? 1}) scaleX(${item.flip ? -1 : 1})`,
      }}
      role="button"
      aria-label={label}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onPointerCancel={endPress}
    >
      {imgOk ? (
        <img
          src={item.image}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "auto", pointerEvents: "none" }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <div
          className={styles.blob}
          style={{
            background: `radial-gradient(circle at 35% 30%, ${style.color}cc, ${style.color}55)`,
          }}
        >
          <span className={styles.emoji}>{style.emoji}</span>
        </div>
      )}
    </div>
  );
}
