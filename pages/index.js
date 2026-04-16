import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("주제를 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "생성 중 오류가 발생했습니다.");
      }

      setResult(data.result);
    } catch (error) {
      setResult(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "720px", margin: "60px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>폐기물 포스팅 자동 생성 웹앱</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        주제를 입력한 뒤 버튼을 누르면 포스팅 초안을 생성합니다.
      </p>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="예: 서울 폐기물 처리 비용 안내"
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "12px"
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "12px 18px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: loading ? "#999" : "#111",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "생성 중..." : "포스팅 생성"}
      </button>

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          minHeight: "220px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
          whiteSpace: "pre-wrap",
          lineHeight: "1.7"
        }}
      >
        {result || "여기에 결과가 표시됩니다."}
      </div>
    </main>
  );
}
