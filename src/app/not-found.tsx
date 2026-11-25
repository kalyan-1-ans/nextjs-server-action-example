import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg space-y-4 p-12">
      <h1 className="text-2xl font-semibold">This page isn't available</h1>
      <p className="text-muted-foreground">It may have been removed, or you may not have access.</p>
      <Link href="/dashboard" className="text-primary">
        Back to projects →
      </Link>
    </main>
  );
}
