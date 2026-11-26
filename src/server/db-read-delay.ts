import "server-only";

import { setTimeout } from "node:timers/promises";

export function delayDatabaseRead() {
  return setTimeout(2_000);
}
