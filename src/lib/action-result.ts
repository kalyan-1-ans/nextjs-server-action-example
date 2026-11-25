export type ActionResult = { ok?: boolean; error?: string; message?: string };

export type FormValues = Record<string, string>;

export type FormAction = (previous: ActionResult, values: FormValues) => Promise<ActionResult>;
