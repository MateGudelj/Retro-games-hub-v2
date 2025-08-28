import Link from "next/link";
import LoginButton from "./LoginButton";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          RetroForge
        </Link>
        {/* On small screens, items stack. On medium screens (md) and up, they go back to being a row. */}
        <nav className="flex flex-col md:flex-row md:space-x-4 items-center gap-2 md:gap-0">
          <Link href="/forum" className="hover:text-gray-300">
            Forum
          </Link>
          <Link href="/blog" className="hover:text-gray-300">
            Blog
          </Link>
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
