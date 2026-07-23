import type { CleaningTool } from "../../types/game";
import { TOOLS } from "../../data/roomData";
import styles from "./ToolBar.module.css";

interface ToolBarProps {
  selected: CleaningTool;
  onSelect: (tool: CleaningTool) => void;
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
            <span className={styles.icon} aria-hidden="true">
              {tool.icon}
            </span>
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
