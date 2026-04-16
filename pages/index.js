import React, { useMemo, useRef, useState } from "react";

const wasteTypes = [
  "이사폐기물",
  "쓰레기집 정리",
  "고독사정리",
  "유품정리",
  "생활폐기물",
  "대형폐기물",
  "사업장폐기물",
  "건설폐기물",
];

const toneStyles = [
  { value: "친근형", desc: "부드럽고 편하게 읽히는 스타일" },
  { value: "전문형", desc: "작업 이해도와 과정 강조" },
  { value: "영업형", desc: "문의 유도를 살린 스타일" },
  { value: "현장형", desc: "현장감과 작업 흐름 강조" },
  { value: "절제형", desc: "담담하고 신중한 표현" },
];

function fileListToArray(fileList) {
  return Array.from(fileList || []);
}

function makePreview(files) {
  return files.map((file) => ({
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    url: URL.createObjectURL(file),
  }));
}

function generatePost({
  wasteType,
  toneStyle,
  mainPoint,
  beforeCount,
  afterCount,
  proMode,
}) {
  const introByTone = {
    친근형: `이번 ${wasteType} 현장은 직접 정리하시기엔 부담이 큰 편이어서 순서대로 하나씩 작업 진행했습니다.`,
    전문형: `이번 ${wasteType} 현장은 현장 상태를 먼저 확인한 뒤 구역별 우선순위를 나눠 작업 진행했습니다.`,
    영업형: `비슷한 ${wasteType} 문의가 많은 만큼 참고하시기 좋도록 실제 작업 흐름 기준으로 정리했습니다.`,
    현장형: `이번 ${wasteType} 현장은 작업 전 사진부터 물량과 동선 체크 먼저 하고 바로 작업 들어갔습니다.`,
    절제형: `이번 ${wasteType} 현장은 현장 특성에 맞춰 신중하게 작업 진행했습니다.`,
  };

  const beforeLine =
    beforeCount > 1
      ? `작업 전 사진 ${beforeCount}장을 기준으로 구역별 상태를 나눠 확인했고, 한 번에 밀어붙이기보다 정리 우선순위부터 잡고 작업 시작했습니다.`
      : `작업 전 사진 ${beforeCount}장 기준으로 전체적으로 정리가 필요한 상태였고, 먼저 손대야 할 구간부터 순서 잡아 작업 시작했습니다.`;

  const processLine = `이번 ${wasteType} 작업은 무작정 치우는 방식이 아니라, 동선 확보하고 분류 작업 같이 진행하면서 반출 순서까지 맞춰 정리했습니다. 물량이 있는 현장은 초반 흐름을 어떻게 잡느냐에 따라 결과가 달라져서, 처음부터 작업 순서 맞춰 진행했습니다.`;

  const pointLine = mainPoint.trim()
    ? `특히 이번 현장에서는 ${mainPoint.trim()} 부분을 가장 중요하게 보고 작업 진행했습니다.`
    : `별도 요청사항이 없는 경우에는 현장 상태 기준으로 가장 효율적인 방식으로 작업 진행했습니다.`;

  const afterLine =
    afterCount > 1
      ? `작업 후 사진 ${afterCount}장을 보면 각도별로 정리 완료 상태를 확인할 수 있고, 공간 전체가 훨씬 깔끔하게 정돈되도록 마무리했습니다.`
      : `작업 후 사진 ${afterCount}장 기준으로 정리 완료 상태가 분명하게 보이고, 전체적으로 깔끔하게 마무리했습니다.`;

  const closeLine = `작업 완료 후에는 단순히 폐기물만 빼낸 것이 아니라 공간이 다시 사용 가능한 상태가 되도록 정리 마무리했습니다. 전후 차이가 분명한 현장일수록 작업 결과에 대한 만족도도 높아집니다.`;

  let cta = "비용은 비교해보시고 마지막에 연락 주셔도 됩니다.";
  if (toneStyle === "영업형") cta = "여러 업체 비교 후 선택하셔도 괜찮습니다.";

  let result = `${wasteType} 작업 실제 진행 사례입니다.

${introByTone[toneStyle]}

${beforeLine}

${processLine}

${pointLine}

${afterLine}

${closeLine}

${cta}`;

  if (proMode) {
    result = result
      .replaceAll("작업 진행했습니다", "작업 진행 후 깔끔하게 마무리했습니다")
      .replaceAll("작업 시작했습니다", "작업 시작 후 순서대로 정리 완료했습니다")
      .replaceAll("정리했습니다", "정리 완료했습니다")
      .replaceAll("마무리했습니다", "마무리까지 확실하게 완료했습니다");
  }

  return result;
}

function PreviewGrid({ items }) {
  if (!items.length) return null;

  return (
    <div style={styles.previewWrap}>
      {items.map((item, idx) => (
        <div key={`${item.name}-${idx}`} style={styles.previewCard}>
          <img src={item.url} alt={item.name} style={styles.previewImg} />
          <div style={styles.previewTextBox}>
            <div style={styles.previewName}>{item.name}</div>
            <div style={styles.previewSize}>{item.size}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const [beforeFiles, setBeforeFiles] = useState([]);
  const [afterFiles, setAfterFiles] = useState([]);
  const [wasteType, setWasteType] = useState("");
  const [toneStyle, setToneStyle] = useState("친근형");
  const [mainPoint, setMainPoint] = useState("");
  const [result, setResult] = useState("");
  const [proMode, setProMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const beforePreview = useMemo(() => makePreview(beforeFiles), [beforeFiles]);
  const afterPreview = useMemo(() => makePreview(afterFiles), [afterFiles]);

  const selectedToneDesc =
    toneStyles.find((t) => t.value === toneStyle)?.desc || "";

  const handleGenerate = () => {
    if (!beforeFiles.length || !afterFiles.length || !wasteType) {
      alert("작업 전 사진, 작업 후 사진, 폐기물 종류를 모두 입력해주세요.");
      return;
    }

    const generated = generatePost({
      wasteType,
      toneStyle,
      mainPoint,
      beforeCount: beforeFiles.length,
      afterCount: afterFiles.length,
      proMode,
    });

    setResult(generated);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearFiles = (type) => {
    if (type === "before") {
      setBeforeFiles([]);
      if (beforeInputRef.current) beforeInputRef.current.value = "";
    } else {
      setAfterFiles([]);
      if (afterInputRef.current) afterInputRef.current.value = "";
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>폐기물 포스팅 생성기</h1>
          <p style={styles.subTitle}>
            작업 전/후 사진과 항목만 입력하면 바로 복붙 가능한 포스팅 초안을 생성합니다.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>입력 폼</h2>

            <div style={styles.section}>
              <div style={styles.rowBetween}>
                <label style={styles.label}>1. 작업 전 사진 업로드</label>
                <button style={styles.smallButton} onClick={() => clearFiles("before")}>
                  비우기
                </button>
              </div>

              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setBeforeFiles(fileListToArray(e.target.files))}
              />

              <button
                style={styles.uploadBox}
                onClick={() => beforeInputRef.current?.click()}
              >
                작업 전 사진 선택
                <div style={styles.uploadSub}>여러 장 업로드 가능</div>
              </button>

              <PreviewGrid items={beforePreview} />
            </div>

            <div style={styles.section}>
              <div style={styles.rowBetween}>
                <label style={styles.label}>2. 작업 후 사진 업로드</label>
                <button style={styles.smallButton} onClick={() => clearFiles("after")}>
                  비우기
                </button>
              </div>

              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setAfterFiles(fileListToArray(e.target.files))}
              />

              <button
                style={styles.uploadBox}
                onClick={() => afterInputRef.current?.click()}
              >
                작업 후 사진 선택
                <div style={styles.uploadSub}>여러 장 업로드 가능</div>
              </button>

              <PreviewGrid items={afterPreview} />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>3. 폐기물 종류 선택</label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                style={styles.select}
              >
                <option value="">폐기물 종류를 선택하세요</option>
                {wasteTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>4. 말투 선택</label>
              <select
                value={toneStyle}
                onChange={(e) => setToneStyle(e.target.value)}
                style={styles.select}
              >
                {toneStyles.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.value}
                  </option>
                ))}
              </select>
              <div style={styles.helpText}>현재 선택: {selectedToneDesc}</div>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>5. 가장 중요한 포인트</label>
              <input
                value={mainPoint}
                onChange={(e) => setMainPoint(e.target.value)}
                placeholder="예: 물량이 많았지만 빠르게 정리한 점"
                style={styles.input}
              />
              <div style={styles.helpText}>없으면 비워두셔도 됩니다.</div>
            </div>

            <div style={styles.section}>
              <label style={styles.checkWrap}>
                <input
                  type="checkbox"
                  checked={proMode}
                  onChange={(e) => setProMode(e.target.checked)}
                />
                <span>현장 전문가 말투 강화 (PRO)</span>
              </label>
            </div>

            <button style={styles.generateButton} onClick={handleGenerate}>
              6. 대본 만들기
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.rowBetween}>
              <h2 style={styles.cardTitle}>결과 출력</h2>
              <button style={styles.copyButton} onClick={handleCopy}>
                {copied ? "복사 완료" : "전체 복사"}
              </button>
            </div>

            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="여기에 생성된 포스팅 결과가 표시됩니다."
              style={styles.textarea}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "16px",
    boxSizing: "border-box",
    fontFamily:
      'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#111827",
  },
  subTitle: {
    margin: "8px 0 0 0",
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: 1.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
  },
  section: {
    marginTop: "18px",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "8px",
  },
  uploadBox: {
    width: "100%",
    minHeight: "92px",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
    padding: "16px",
  },
  uploadSub: {
    marginTop: "6px",
    fontSize: "12px",
    fontWeight: 400,
    color: "#6b7280",
  },
  select: {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    padding: "0 14px",
    fontSize: "15px",
    background: "#fff",
  },
  input: {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    padding: "0 14px",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  helpText: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#6b7280",
  },
  checkWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#111827",
    fontWeight: 600,
  },
  generateButton: {
    width: "100%",
    height: "52px",
    borderRadius: "16px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "8px",
  },
  copyButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  smallButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  textarea: {
    width: "100%",
    minHeight: "700px",
    marginTop: "16px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    padding: "16px",
    fontSize: "15px",
    lineHeight: 1.8,
    boxSizing: "border-box",
    resize: "vertical",
    background: "#f8fafc",
  },
  previewWrap: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    padding: "8px 2px 2px 2px",
    marginTop: "10px",
  },
  previewCard: {
    minWidth: "120px",
    maxWidth: "120px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#fff",
    flexShrink: 0,
  },
  previewImg: {
    width: "100%",
    height: "88px",
    objectFit: "cover",
    display: "block",
    background: "#e5e7eb",
  },
  previewTextBox: {
    padding: "8px",
  },
  previewName: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  previewSize: {
    fontSize: "10px",
    color: "#6b7280",
    marginTop: "4px",
  },
};
