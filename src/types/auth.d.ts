import "better-auth/client";

declare module "better-auth/client" {
  interface User {
    isValid?: boolean;
  }
}