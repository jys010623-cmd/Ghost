import { useState } from "react";
import type { CleaningTool, ToolInfo } from "../../types/game";
import { TOOLS } from "../../data/roomData";
import styles from "./ToolBar.module.css";

interface ToolBarProps {
  selected: CleaningTool;
  onSelect: (tool: CleaningTool) => void;
}

function ToolIcon({ tool }: { tool: ToolInfo }) {
  const [imgOk, setImgOk] = useState(true);
  if (imgOk) {
    return (
      <img
        className={styles.iconImg}
        src={tool.image}
        alt=""
        draggable={false}
        onError={() => setImgOk(false)}
      />
    );
  }
  return (
    <span className={styles.icon} aria-hidden="true">
      {tool.icon}
    </span>
  );
}

export function ToolBar({ selected, onSelect }: ToolBarProps) {
  return (
    <div className={styles.bar} role="toolbar" aria-label="청소 도구 선택">
      {TOOLS.map((tool) => {
        const active = tool.id === selected;
        return (
          <button
            key={tool.id}
            type="button"
            className={`${styles.tool} ${active ? styles.active : ""}`}
            aria-pressed={active}
            aria-label={`${tool.name} (단축키 ${tool.shortcut}) — ${tool.hint}`}
            onClick={() => onSelect(tool.id)}
            style={{ position: "relative" }}
          >
            {active && (
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
            )}
            <ToolIcon tool={tool} />
            <span className={styles.name}>{tool.name}</span>
            <span className={styles.key} aria-hidden="true">
              {tool.shortcut}
            </span>
          </button>
        );
      })}
    </div>
  );
}
