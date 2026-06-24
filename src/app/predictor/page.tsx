"use client";

import { useState } from "react";
import Link from "next/link";

interface Match {
  collegeId: string;
  name: string;
  city: string;
  state: string;
  type: string;
  courseName: string;
  closingRank: number;
  year: number;
}

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handlePredict() {
    setError("");
    setLoading(true);
    setSearched(false);

    const res = await fetch(`/api/predictor?exam=${encodeURIComponent(exam)}&rank=${rank}`);
    const data = await res.json();

    if (!data.success) {
      setError(data.error);
      setMatches([]);
    } else {
      setMatches(data.data.matches);
      setSearched(true);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">College Predictor</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter your exam and rank to find colleges you are eligible for
      </p>

      {/* Input */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-3">
        <select
          value={exam}
          onChange={(e) => setExam(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-48"
        >
          <option value="JEE Main">JEE Main</option>
          <option value="JEE Advanced">JEE Advanced</option>
          <option value="NEET">NEET</option>
          <option value="TNEA">TNEA</option>
        </select>
        <input
          type="number"
          placeholder="Enter your rank..."
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <button
          onClick={handlePredict}
          disabled={loading || !rank}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Colleges"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Results */}
      {searched && (
        <>
          {matches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-gray-500">No colleges found for this rank.</p>
              <p className="text-gray-400 text-sm mt-1">Try a higher rank number.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{matches.length} colleges found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                  <Link href={`/colleges/${match.collegeId}`} key={match.collegeId}>
                    <div className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800 text-sm leading-tight">
                          {match.name}
                        </h2>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded ml-2 shrink-0">
                          Eligible
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        {match.city}, {match.state}
                      </p>
                      <p className="text-gray-600 text-xs mb-1">
                        Course: <strong>{match.courseName}</strong>
                      </p>
                      <p className="text-gray-600 text-xs">
                        Closing Rank: <strong>{match.closingRank}</strong>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}