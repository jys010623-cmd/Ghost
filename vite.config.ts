import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages(프로젝트 사이트)는 /Ghost/ 하위에서 서빙되므로 빌드 시 base 지정.
// 로컬 dev 는 루트(/)로 유지.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Ghost/" : "/",
  plugins: [react()],
}));
