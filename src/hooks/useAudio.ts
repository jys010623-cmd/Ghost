import { useCallback, useState } from "react";
import { isMuted, setMuted } from "../utils/audio";

export function useAudio(initialMuted: boolean) {
  const [muted, setMutedState] = useState<boolean>(() => {
    setMuted(initialMuted);
    return initialMuted;
  });

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  }, []);

  return { muted: muted || isMuted(), toggleMuted };
}
