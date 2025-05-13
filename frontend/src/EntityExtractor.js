// This file has been moved to components/EntityExtractor/EntityExtractor.js
// Please use the new file location.

import { useState } from "react";

const FIELD_TYPES = ["string", "number", "boolean"];

function EntityExtractor() {
  const [inputText, setInputText] = useState("");
  const [fields, setFields] = useState([
    { name: "", type: "string", description: "" }
  ]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Add a new field to the schema
  const addField = () => {
    setFields([...fields, { name: "", type: "string", description: "" }]);
  };

  // Remove a field from the schema
  const removeField = idx => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  // Update a field's properties
  const updateField = (idx, key, value) => {
    setFields(fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  // Build OpenAPI 3.0 schema object
  const buildSchema = () => {
    const properties = {};
    const required = [];
    fields.forEach(f => {
      if (!f.name) return;
      const prop = { type: f.type };
      if (f.description) prop.description = f.description;
      properties[f.name] = prop;
      required.push(f.name); // All fields are required
    });
    const schema = { type: "object", properties };
    if (required.length) schema.required = required;
    return schema;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");
    try {
      const schema = buildSchema();
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, schema })
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
      <div style={{ margin: "20px 0", border: "1px solid #ccc", padding: 10 }}>
        <label>Define Entity Schema:</label>
        {fields.map((field, idx) => (
          <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              placeholder="Field name"
              value={field.name}
              onChange={e => updateField(idx, "name", e.target.value)}
              style={{ flex: 2 }}
            />
            <select
              value={field.type}
              onChange={e => updateField(idx, "type", e.target.value)}
              style={{ flex: 1 }}
            >
              {FIELD_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              placeholder="Description"
              value={field.description}
              onChange={e => updateField(idx, "description", e.target.value)}
              style={{ flex: 3 }}
            />
            <button
              onClick={() => removeField(idx)}
              disabled={fields.length === 1}
              style={{
                background: palette.danger,
                color: palette.buttonText,
                border: 'none',
                borderRadius: sharedStyles.borderRadius,
                padding: '7px 14px',
                fontWeight: sharedStyles.fontWeightBold,
                cursor: fields.length === 1 ? 'not-allowed' : 'pointer',
                opacity: fields.length === 1 ? 0.5 : 1,
                transition: 'opacity 0.2s',
                marginLeft: 8
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addField}>Add Field</button>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      <div style={{ margin: "20px 0" }}>
        <label>Output Result:</label>
        <br />
        {output && (
          <OutputVisualizer output={output} />
        )}
      </div>
    </div>
  );
}

// Beautiful output visualization component
function OutputVisualizer({ output }) {
  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    return <div style={{ color: 'red', fontWeight: 500 }}>{output}</div>;
  }
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return <div style={{ color: 'green', fontWeight: 500 }}>{parsed}</div>;
    }
  }
  // If the result is wrapped in a 'result' key, unwrap it
  if (parsed && typeof parsed === 'object' && parsed.result) {
    try {
      parsed = typeof parsed.result === 'string' ? JSON.parse(parsed.result) : parsed.result;
    } catch {
      parsed = parsed.result;
    }
  }
  if (!parsed || typeof parsed !== 'object') {
    return <div style={{ color: 'green', fontWeight: 500 }}>{String(parsed)}</div>;
  }
  // Render as table
  const entries = Object.entries(parsed);
  if (!entries.length) return <div>No data extracted.</div>;
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      background: '#f6f8fa',
      border: '1px solid #e1e4e8',
      borderRadius: 8,
      marginTop: 8
    }}>
      <thead>
        <tr style={{ background: '#eaecef' }}>
          <th style={{ textAlign: 'left', padding: 8, border: '1px solid #e1e4e8' }}>Field</th>
          <th style={{ textAlign: 'left', padding: 8, border: '1px solid #e1e4e8' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key}>
            <td style={{ padding: 8, border: '1px solid #e1e4e8', fontWeight: 500 }}>{key}</td>
            <td style={{ padding: 8, border: '1px solid #e1e4e8' }}>{String(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EntityExtractor;

