"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  establishedYear: number;
  overview: string;
  courses: { id: string; name: string; duration: string; fees: number }[];
  placements: { id: string; year: number; avgPackage: number; highestPackage: number; topRecruiters: string[] }[];
  reviews: { id: string; rating: number; comment: string; authorName: string }[];
  cutoffs: { id: string; examName: string; courseName: string; openingRank: number; closingRank: number; year: number }[];
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollege() {
      const res = await fetch(`/api/colleges/${id}`);
      const data = await res.json();
      setCollege(data.data);
      setLoading(false);
    }
    fetchCollege();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!college) return <p className="text-center text-gray-500">College not found</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{college.name}</h1>
            <p className="text-gray-500 mt-1">{college.city}, {college.state}</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">
            {college.type}
          </span>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          <span>⭐ {college.rating}</span>
          <span>₹{(college.fees / 100000).toFixed(1)}L/yr</span>
          <span>Est. {college.establishedYear}</span>
        </div>
        <p className="mt-4 text-gray-600 text-sm">{college.overview}</p>
      </div>

      {/* Courses */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Courses Offered</h2>
        <div className="space-y-2">
          {college.courses.map((course) => (
            <div key={course.id} className="flex justify-between text-sm border-b pb-2">
              <span className="text-gray-700">{course.name}</span>
              <span className="text-gray-500">{course.duration}</span>
              <span className="text-gray-500">₹{(course.fees / 100000).toFixed(1)}L/yr</span>
            </div>
          ))}
        </div>
      </div>

      {/* Placements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Statistics</h2>
        {college.placements.map((p) => (
          <div key={p.id} className="text-sm space-y-2">
            <div className="flex gap-6">
              <span className="text-gray-600">Year: <strong>{p.year}</strong></span>
              <span className="text-gray-600">Avg: <strong>₹{(p.avgPackage / 100000).toFixed(1)}L</strong></span>
              <span className="text-gray-600">Highest: <strong>₹{(p.highestPackage / 100000).toFixed(1)}L</strong></span>
            </div>
            <p className="text-gray-500">Top Recruiters: {p.topRecruiters.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Cutoffs */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cutoff Ranks</h2>
        <div className="space-y-2">
          {college.cutoffs.map((c) => (
            <div key={c.id} className="flex justify-between text-sm border-b pb-2">
              <span className="text-gray-700">{c.examName}</span>
              <span className="text-gray-600">{c.courseName}</span>
              <span className="text-gray-500">{c.openingRank} - {c.closingRank}</span>
              <span className="text-gray-400">{c.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Reviews</h2>
        <div className="space-y-3">
          {college.reviews.map((r) => (
            <div key={r.id} className="border-b pb-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{r.authorName}</span>
                <span>⭐ {r.rating}/5</span>
              </div>
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}