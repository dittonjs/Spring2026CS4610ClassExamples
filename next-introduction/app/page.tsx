import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-9xl">Hello, world!</h1>
      <Link href="/about">About Page</Link>
      <Link href="/about/me">My About Page</Link>
    </div>
  );
}
