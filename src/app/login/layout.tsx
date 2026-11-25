import Image from "next/image";
import { Logo } from "@/components/logo";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-wrap">
      <section className="mt-12 flex w-full flex-col items-center gap-8 p-4 lg:w-1/2 lg:border-r">
        <Logo large />
        <div className="w-full max-w-sm rounded-xl border bg-card shadow-sm">
          <h1 className="mx-4 -mt-6 mb-4 grid h-28 place-items-center rounded-xl bg-gray-900 text-2xl font-semibold text-white">
            Log In
          </h1>
          <div className="p-6 [&_button[type=submit]]:w-full">{children}</div>
        </div>
        <div className="my-8 text-center text-sm text-gray-500">
          <h2 className="mb-2">Other example logins</h2>
          {[
            "johnsmith",
            "michael.smith",
            "susan.jones",
            "david.brown",
            "emily.white",
            "christopher.wilson",
          ].map((username) => (
            <p key={username}>{username}</p>
          ))}
          <p className="mt-2">password: Summertime2025</p>
        </div>
      </section>
      <div className="hidden w-1/2 items-start justify-center bg-gray-200 p-4 lg:flex">
        <Image
          src="/calender.png"
          alt="Project planning illustration"
          width={700}
          height={700}
          className="h-auto max-h-[700px] w-full object-contain"
        />
      </div>
    </main>
  );
}
