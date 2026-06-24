"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedCollege {
  id: string;
  college: {
    id: string;
    name: string;
    city: string;
    state: string;
    fees: number;
    rating: number;
    type: string;
  };
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchSaved() {
    const res = await fetch("/api/saved");
    const data = await res.json();
    if (!data.success) {
      setError("Please login to view saved colleges");
    } else {
      setSaved(data.data.saved);
    }
    setLoading(false);
  }

  async function handleUnsave(collegeId: string) {
    const res = await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setSaved((prev) => prev.filter((s) => s.college.id !== collegeId));
    }
  }

  useEffect(() => {
    fetchSaved();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 mb-4">{error}</p>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Colleges</h1>

      {saved.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 mb-4">No saved colleges yet</p>
          <Link href="/colleges" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Browse Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-gray-800 text-sm leading-tight">
                  {item.college.name}
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded ml-2 shrink-0">
                  {item.college.type}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-3">
                {item.college.city}, {item.college.state}
              </p>
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span>⭐ {item.college.rating}</span>
                <span>₹{(item.college.fees / 100000).toFixed(1)}L/yr</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/colleges/${item.college.id}`}
                  className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-xs hover:bg-blue-100"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleUnsave(item.college.id)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}