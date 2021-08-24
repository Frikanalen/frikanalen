/// <reference types="next" />
/// <reference types="next/types/global" />

import { Manager } from "modules/state/types";

// Augment Next.js NextPageContext
declare module "next/dist/next-server/lib/utils" {
  export interface NextPageContext {
    manager: Manager;
  }
}
