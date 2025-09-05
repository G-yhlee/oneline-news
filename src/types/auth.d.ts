import "better-auth/client";
import "better-auth";

declare module "better-auth/client" {
  interface User {
    isValid?: boolean;
  }
}

declare module "better-auth" {
  interface User {
    isValid?: boolean;
  }
}