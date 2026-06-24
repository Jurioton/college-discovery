"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const navLinks = [
    { href: "/colleges", label: "Colleges" },
    { href: "/compare", label: "Compare" },
    { href: "/predictor", label: "Predictor" },
    { href: "/questions", label: "Q&A" },
    { href: "/saved", label: "Saved" },
  ];

  return (
    <nav style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/colleges" style={{ color: "#1D4ED8" }} className="text-xl font-bold tracking-tight">
          College<span style={{ color: "#0EA5E9" }}>Discover</span>
        </Link>
        <div className="flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: pathname === link.href ? "#1D4ED8" : "#64748B",
                backgroundColor: pathname === link.href ? "#EFF6FF" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#1D4ED8" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}