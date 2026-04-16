import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "topic 값이 필요합니다." });
    }

    const prompt = `
너는 한국어 블로그 포스팅 작성 전문가다.

아래 주제로 폐기물 처리 관련 블로그 초안을 작성해라.

주제: ${topic}

조건:
- 한국어로 작성
- 제목 포함
- 도입문 1개
- 본문 소제목 3개 이상
- 마무리 문단 포함
- 읽기 쉽게 자연스럽게 작성
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const outputText = response.output_text || "결과가 비어 있습니다.";

    return res.status(200).json({ result: outputText });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    return res.status(500).json({
      error: "서버 내부 오류가 발생했습니다."
    });
  }
}
