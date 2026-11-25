"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export function ProjectRouteLabel() {
  const board = useSelectedLayoutSegment() === "active";

  return <span>{board ? "Active Sprint" : "Issues"}</span>;
}
