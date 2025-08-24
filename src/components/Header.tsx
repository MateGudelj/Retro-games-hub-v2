import Link from 'next/link';
import LoginButton from './LoginButton';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          RetroForge
        </Link>
        <nav className="space-x-4">
          <Link href="/forum" className="hover:text-gray-300">Forum</Link>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}