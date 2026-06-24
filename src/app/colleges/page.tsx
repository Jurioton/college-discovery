"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  establishedYear: number;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function fetchColleges() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (type) params.set("type", type);

    const res = await fetch(`/api/colleges?${params.toString()}`);
    const data = await res.json();
    setColleges(data.data.colleges);
    setTotal(data.data.pagination.total);
    setLoading(false);
  }

  useEffect(() => {
    fetchColleges();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Engineering Colleges</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-40"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-40"
        >
          <option value="">All Types</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
        </select>
        <button
          onClick={fetchColleges}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">{total} colleges found</p>

      {/* College Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((college) => (
            <Link href={`/colleges/${college.id}`} key={college.id}>
              <div className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-gray-800 text-sm leading-tight">
                    {college.name}
                  </h2>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded ml-2 shrink-0">
                    {college.type}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-3">
                  {college.city}, {college.state}
                </p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>⭐ {college.rating}</span>
                  <span>₹{(college.fees / 100000).toFixed(1)}L/yr</span>
                  <span>Est. {college.establishedYear}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}