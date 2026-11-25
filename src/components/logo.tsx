import Image from "next/image";
import Link from "next/link";

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <Link href="/dashboard" aria-label="Jura projects">
      <Image
        src="/logo.svg"
        alt="Jura"
        width={132}
        height={100}
        className={large ? "mx-auto h-52 w-auto" : "h-20 w-auto"}
        priority
      />
    </Link>
  );
}
