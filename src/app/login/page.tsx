import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./_components/login-form";

export default async function Login() {
  await connection();

  const session = await auth();

  if (session?.user) redirect("/dashboard");

  return <LoginForm />;
}
