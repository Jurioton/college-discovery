import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Find Your Perfect Engineering College
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Search, compare, and discover the best engineering colleges in India
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/colleges"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Colleges
        </Link>
        <Link
          href="/predictor"
          className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
        >
          Rank Predictor
        </Link>
      </div>
    </div>
  );
}