"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/colleges" className="text-xl font-bold text-blue-600">
          CollegeDiscover
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600 items-center">
          <Link href="/colleges" className="hover:text-blue-600">Colleges</Link>
          <Link href="/compare" className="hover:text-blue-600">Compare</Link>
          <Link href="/predictor" className="hover:text-blue-600">Predictor</Link>
          <Link href="/questions" className="hover:text-blue-600">Q&A</Link>
          <Link href="/saved" className="hover:text-blue-600">Saved</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}