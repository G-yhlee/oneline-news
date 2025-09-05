import { createAuthClient } from "better-auth/client";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL!, // 백엔드 서버 URL (http://localhost:3333)
  basePath: "/auth", // 인증 관련 엔드포인트 기본 경로
  plugins: [
    anonymousClient(), // anonymous 클라이언트 플러그인
  ],
});
