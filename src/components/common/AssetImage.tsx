import { useState, type CSSProperties } from "react";

interface AssetImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

/** 장식용 이미지 — 파일이 없으면 조용히 사라진다(레이아웃 영향 없음). */
export function AssetImage({ src, alt = "", className, style }: AssetImageProps) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      onError={() => setOk(false)}
    />
  );
}
