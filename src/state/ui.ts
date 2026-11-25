"use client";

import { atom } from "jotai";

// Only dialog selection belongs in Jotai. Issue and sprint data come from the server.
type ProjectDialog = { type: "issue"; issueId: string | null } | { type: "sprint" } | null;

export const projectDialogAtom = atom<ProjectDialog>(null);
