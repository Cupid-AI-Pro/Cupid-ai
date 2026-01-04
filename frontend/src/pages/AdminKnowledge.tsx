import { useEffect, useState } from "react";

export default function AdminKnowledge() {
  const [keywords, setKeywords] = useState("");
  const [answer, setAnswer] = useState("");
  const [priority, setPriority] = useState(1);
  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/knowledge/all");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!keywords || !answer) return;

    await fetch("http://localhost:5000/api/knowledge/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: keywords.split(",").map(k => k.trim().toLowerCase()),
        answer,
        priority
      })
    });

    setKeywords("");
    setAnswer("");
    load();
  };

  const del = async (id: string) => {
    await fetch(`http://localhost:5000/api/knowledge/${id}`, {
      method: "DELETE"
    });
    load();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cupid Knowledge Base</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Reply"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-full mb-2"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />

        <button
          onClick={add}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      <div className="space-y-3">
        {data.map(k => (
          <div key={k._id} className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">
              {k.keywords.join(", ")} (priority {k.priority})
            </div>
            <div className="mt-1">{k.answer}</div>
            <button
              onClick={() => del(k._id)}
              className="text-red-500 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
