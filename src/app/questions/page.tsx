"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
  _count: { answers: number };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function fetchQuestions() {
    const res = await fetch("/api/questions");
    const data = await res.json();
    if (data.success) setQuestions(data.data.questions);
    setLoading(false);
  }

  async function handlePost() {
    setError("");
    setPosting(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error);
    } else {
      setTitle("");
      setBody("");
      fetchQuestions();
    }
    setPosting(false);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Q&A Discussion</h1>

      {/* Ask Question Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ask a Question</h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>
        )}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Question title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Describe your question in detail..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
          />
          <button
            onClick={handlePost}
            disabled={posting || !title || !body}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Question"}
          </button>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link href={`/questions/${q.id}`} key={q.id}>
              <div className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer">
                <h2 className="font-semibold text-gray-800 mb-1">{q.title}</h2>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{q.body}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Asked by {q.author.name}</span>
                  <span>{q._count.answers} answers</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}