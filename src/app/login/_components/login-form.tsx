"use client";

import { ActionForm } from "@/components/action-form";
import { loginAction } from "../_lib/login.action";
import { loginSchema } from "@/lib/schemas";

export function LoginForm() {
  return (
    <ActionForm
      action={loginAction}
      schema={loginSchema}
      defaults={{ username: "johndoe", password: "Summertime2025" }}
      fields={[
        { name: "username", label: "Username", wide: true },
        { name: "password", label: "Password", type: "password", wide: true },
      ]}
      submitLabel="Log In"
    />
  );
}
