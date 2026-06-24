"use client";

import { useState, useEffect } from "react";

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

interface CollegeOption {
  id: string;
  name: string;
  city: string;
}

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<CollegeOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAll() {
      const res = await fetch("/api/colleges?limit=50");
      const data = await res.json();
      if (data.success) setAllColleges(data.data.colleges);
    }
    fetchAll();
  }, []);

  function handleSelect(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  }

  async function handleCompare() {
    if (selected.length < 2) {
      setError("Please select at least 2 colleges");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch(`/api/compare?ids=${selected.join(",")}`);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Compare Colleges</h1>
      <p className="text-gray-500 text-sm mb-6">Select 2 or 3 colleges to compare side by side</p>

      {/* College Selector */}
      <div className="bg-white p-5 rounded-lg shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700 text-sm">
            Select Colleges ({selected.length}/3)
          </h2>
          {selected.length > 0 && (
            <button
              onClick={() => { setSelected([]); setColleges([]); }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allColleges.map((college) => {
            const isSelected = selected.includes(college.id);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={college.id}
                onClick={() => handleSelect(college.id)}
                disabled={isDisabled}
                className="text-left p-3 rounded-lg border text-sm transition-colors"
                style={{
                  backgroundColor: isSelected ? "#EFF6FF" : "#F8FAFC",
                  borderColor: isSelected ? "#1D4ED8" : "#E2E8F0",
                  color: isDisabled ? "#94A3B8" : "#0F172A",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                <p className="font-medium">{college.name}</p>
                <p className="text-xs text-gray-400">{college.city}</p>
                {isSelected && (
                  <p className="text-xs mt-1" style={{ color: "#1D4ED8" }}>✓ Selected</p>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleCompare}
          disabled={selected.length < 2 || loading}
          className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#1D4ED8" }}
        >
          {loading ? "Comparing..." : "Compare Selected"}
        </button>
      </div>

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