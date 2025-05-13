import { useState } from "react";
import OutputVisualizer from "./OutputVisualizer";

const FIELD_TYPES = ["string", "number", "boolean"];

function EntityExtractor() {
  const [inputText, setInputText] = useState("");
  const [fields, setFields] = useState([
    { name: "", type: "string", required: false, description: "" }
  ]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Add a new field to the schema
  const addField = () => {
    setFields([...fields, { name: "", type: "string", required: false, description: "" }]);
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
      if (f.required) required.push(f.name);
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      fontFamily: 'Inter, Arial, sans-serif',
      color: '#222',
      padding: 0,
      margin: 0
    }}>
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '32px 0 16px 0',
        marginBottom: 32,
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: -1,
          margin: 0,
          color: '#2d3748'
        }}>Entity Extractor</h1>
        <p style={{ color: '#64748b', fontSize: 18, margin: 0 }}>Extract structured data from text using AI</p>
      </header>
      <main style={{
        maxWidth: 600,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
        padding: 32,
        marginBottom: 48
      }}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block' }}>Input Text</label>
          <textarea
            rows={5}
            style={{
              width: '100%',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: 14,
              fontSize: 16,
              fontFamily: 'inherit',
              background: '#f1f5f9',
              resize: 'vertical',
              marginTop: 4
            }}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
        </div>
        <div style={{
          marginBottom: 28,
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#f8fafc',
          padding: 18
        }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block' }}>Define Entity Schema</label>
          {fields.map((field, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: 10,
              marginBottom: 10,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                placeholder="Field name"
                value={field.name}
                onChange={e => updateField(idx, "name", e.target.value)}
                style={{
                  flex: 2,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: '#fff'
                }}
              />
              <select
                value={field.type}
                onChange={e => updateField(idx, "type", e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: '#fff'
                }}
              >
                {FIELD_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                placeholder="Description"
                value={field.description}
                onChange={e => updateField(idx, "description", e.target.value)}
                style={{
                  flex: 3,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: '#fff'
                }}
              />
              <label style={{ flex: 1, fontSize: 14, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={e => updateField(idx, "required", e.target.checked)}
                  style={{ marginRight: 4 }}
                />
                Required
              </label>
              <button
                onClick={() => removeField(idx)}
                disabled={fields.length === 1}
                style={{
                  background: '#f87171',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 14px',
                  fontWeight: 600,
                  cursor: fields.length === 1 ? 'not-allowed' : 'pointer',
                  opacity: fields.length === 1 ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addField}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 15,
              marginTop: 6,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(37,99,235,0.08)'
            }}
          >
            Add Field
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? '#a5b4fc' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: 17,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            marginBottom: 24,
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
        <div style={{ margin: '32px 0 0 0' }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block' }}>Output Result</label>
          {output && (
            <OutputVisualizer output={output} />
          )}
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        color: '#64748b',
        fontSize: 15,
        padding: '24px 0 12px 0',
        background: 'none'
      }}>
        &copy; {new Date().getFullYear()} Entity Extractor.
      </footer>
    </div>
  );
}

export default EntityExtractor;

