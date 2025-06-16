"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo or Title */}
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          🚋 Tram Scheduler
        </Link>

        {/* Center: Navigation Links */}
        <div className="space-x-6">
          <Link
            href="/"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/calendar"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Calendar
          </Link>
        </div>

        {/* Right: Auth */}
        <div>
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
