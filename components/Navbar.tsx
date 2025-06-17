"use client";

import Link from "next/link";
import { useState } from "react";
import AuthButtons from "./AuthButtons";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          🚋 Tram Scheduler
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/calendar" className="hover:text-gray-300">
            Calendar
          </Link>
          <AuthButtons />
        </div>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3">
          <Link href="/" className="block hover:text-gray-300">
            Home
          </Link>
          <Link href="/calendar" className="block hover:text-gray-300">
            Calendar
          </Link>
          <AuthButtons />
        </div>
      )}
    </nav>
  );
}
