import { Manager } from "modules/state/types";

// Augment Next.js NextPageContext
declare module "next/dist/shared/lib/utils" {
  export interface NextPageContext {
    manager: Manager;
  }
}
