"use client";

import { useState } from "react";

interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  establishedYear: number;
  courses: { id: string; name: string; duration: string; fees: number }[];
  placements: { id: string; year: number; avgPackage: number; highestPackage: number }[];
  cutoffs: { id: string; examName: string; courseName: string; closingRank: number }[];
}

export default function ComparePage() {
  const [ids, setIds] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare() {
    setError("");
    setLoading(true);
    const res = await fetch(`/api/compare?ids=${ids}`);
    const data = await res.json();
    if (!data.success) {
      setError(data.error);
      setColleges([]);
    } else {
      setColleges(data.data.colleges);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare Colleges</h1>

      {/* Input */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Enter 2-3 college IDs separated by commas..."
          value={ids}
          onChange={(e) => setIds(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Compare
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Comparison Table */}
      {colleges.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm border text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 text-gray-600 w-40">Feature</th>
                {colleges.map((c) => (
                  <th key={c.id} className="text-left p-4 text-gray-800">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 text-gray-500 font-medium">Location</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">{c.city}, {c.state}</td>
                ))}
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 text-gray-500 font-medium">Type</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">{c.type}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 text-gray-500 font-medium">Rating</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">⭐ {c.rating}</td>
                ))}
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 text-gray-500 font-medium">Fees/yr</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">₹{(c.fees / 100000).toFixed(1)}L</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 text-gray-500 font-medium">Est. Year</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">{c.establishedYear}</td>
                ))}
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 text-gray-500 font-medium">Avg Package</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">
                    {c.placements[0] ? `₹${(c.placements[0].avgPackage / 100000).toFixed(1)}L` : "N/A"}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 text-gray-500 font-medium">Highest Package</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">
                    {c.placements[0] ? `₹${(c.placements[0].highestPackage / 100000).toFixed(1)}L` : "N/A"}
                  </td>
                ))}
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 text-gray-500 font-medium">Courses</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">
                    {c.courses.map((course) => course.name).join(", ")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-500 font-medium">Cutoffs</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-gray-700">
                    {c.cutoffs.map((cut) => `${cut.examName}: ${cut.closingRank}`).join(", ")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}