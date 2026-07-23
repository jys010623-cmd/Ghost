/**
 * public/ 정적 파일 경로에 Vite base(예: "/" 또는 "/Ghost/")를 붙인다.
 * GitHub Pages 처럼 하위 경로에서 서빙될 때 이미지 404 를 막아준다.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
