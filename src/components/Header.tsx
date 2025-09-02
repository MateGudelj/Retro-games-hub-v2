"use client";

import { useState } from "react";
import Link from "next/link";
import LoginButton from "./LoginButton";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800 text-slate-100 p-4 border-b border-slate-700 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/images/logo5.png"
            alt="RGH Logo"
            width={40}
            height={40}
            className="h-8 w-auto" // Control the size with height
          />
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        <nav
          className={`
            flex flex-col md:flex-row
            items-center gap-4
            absolute md:static
            top-16 left-0
            w-full md:w-auto
            bg-slate-800 md:bg-transparent
            p-4 md:p-0
            border-b border-slate-700 md:border-none
            transition-all duration-300 ease-in-out
            transform origin-top
            
          
              ${
                isMenuOpen
                  ? "opacity-100 scale-100 visible pointer-events-auto"
                  : "opacity-0 scale-95 invisible pointer-events-none"
              }

 
            /* These classes ensure it's always visible and full-size on desktop */
            md:visible md:opacity-100 md:scale-100 md:pointer-events-auto
          `}
        >
          <Link
            href="/forum"
            className="hover:text-slate-300 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Forum
          </Link>
          <Link
            href="/forum/marketplace"
            className="hover:text-slate-300 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            href="/blog"
            className="hover:text-slate-300 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
