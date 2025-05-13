import { useState } from "react";

function EntityExtractor() {
  const [inputText, setInputText] = useState("");
  const [inputEntities, setInputEntities] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, entities: inputEntities })
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ margin: "20px 0" }}>
        <label>Input Text:</label>
        <br />
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
      </div>
      <div style={{ margin: "20px 0" }}>
        <label>Input Entities (JSON):</label>
        <br />
        <textarea
          rows={6}
          style={{ width: "100%" }}
          value={inputEntities}
          onChange={e => setInputEntities(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      <div style={{ margin: "20px 0" }}>
        <label>Output Result:</label>
        <br />
        <textarea
          rows={10}
          style={{ width: "100%" }}
          value={output}
          readOnly
        />
      </div>
    </div>
  );
}

export default EntityExtractor;

