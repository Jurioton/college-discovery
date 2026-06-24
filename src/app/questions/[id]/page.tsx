"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Answer {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
}

interface Question {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
  college: { id: string; name: string } | null;
  answers: Answer[];
}

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function fetchQuestion() {
    const res = await fetch(`/api/questions/${id}`);
    const data = await res.json();
    if (data.success) setQuestion(data.data);
    setLoading(false);
  }

  async function handleAnswer() {
    setError("");
    setPosting(true);
    const res = await fetch(`/api/questions/${id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: answerBody }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error);
    } else {
      setAnswerBody("");
      fetchQuestion();
    }
    setPosting(false);
  }

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!question) return <p className="text-center text-gray-500">Question not found</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Question */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{question.title}</h1>
        {question.college && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mb-3 inline-block">
            {question.college.name}
          </span>
        )}
        <p className="text-gray-600 mt-3">{question.body}</p>
        <p className="text-xs text-gray-400 mt-4">Asked by {question.author.name}</p>
      </div>

      {/* Answers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {question.answers.length} Answers
        </h2>
        {question.answers.length === 0 ? (
          <p className="text-gray-400 text-sm">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-4">
            {question.answers.map((a) => (
              <div key={a.id} className="border-b pb-4">
                <p className="text-gray-700 text-sm">{a.body}</p>
                <p className="text-xs text-gray-400 mt-2">Answered by {a.author.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Answer */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Post an Answer</h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>
        )}
        <textarea
          placeholder="Write your answer here..."
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none mb-3"
        />
        <button
          onClick={handleAnswer}
          disabled={posting || !answerBody}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </div>
  );
}