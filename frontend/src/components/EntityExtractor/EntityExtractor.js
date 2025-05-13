import { useState, useEffect } from "react";
import OutputVisualizer from "./OutputVisualizer";
import { palette, sharedStyles } from '../../styles/theme';

const FIELD_TYPES = ["string", "number", "boolean"];

function EntityExtractor({ templates, saveTemplates, activeTemplate }) {
  const [inputFile, setInputFile] = useState(null);
  const [fields, setFields] = useState([
    { name: "", type: "string", required: false, description: "" }
  ]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Load template fields if activeTemplate changes
  useEffect(() => {
    if (activeTemplate) {
      setFields(activeTemplate.fields);
      setTemplateName(activeTemplate.name);
    }
  }, [activeTemplate]);

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
    if (!inputFile) {
      setOutput("Please upload a file.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const schema = buildSchema();
      const formData = new FormData();
      formData.append("file", inputFile);
      formData.append("schema", JSON.stringify(schema));
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
    setLoading(false);
  };

  const saveCurrentTemplate = () => {
    if (!templateName.trim()) return;
    const newTemplates = [
      ...templates.filter(t => t.name !== templateName.trim()),
      { name: templateName.trim(), fields }
    ];
    saveTemplates(newTemplates);
    setTemplateName("");
  };

  const loadTemplate = (tpl) => {
    setFields(tpl.fields);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.backgroundAlt} 100%)`,
      fontFamily: sharedStyles.fontFamily,
      color: palette.text,
      padding: 0,
      margin: 0
    }}>
      <header style={{
        background: palette.card,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '32px 0 16px 0',
        marginBottom: 32,
        textAlign: 'center',
        borderBottom: `1px solid ${palette.border}`
      }}>
        <h1 style={{
          fontWeight: sharedStyles.fontWeightHeader,
          fontSize: 36,
          letterSpacing: -1,
          margin: 0,
          color: palette.text
        }}>
          Extraction
        </h1>
        <div style={{
          fontSize: 18,
          color: palette.textSecondary,
          marginTop: 8
        }}>
          Extract entities from your files using a custom schema
        </div>
      </header>
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        background: palette.card,
        borderRadius: sharedStyles.cardRadius,
        boxShadow: palette.cardShadow,
        padding: sharedStyles.cardPadding,
        marginBottom: sharedStyles.cardMarginBottom
      }}>
        <div style={{
          marginBottom: 28,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          background: palette.background,
          padding: 18,
          boxSizing: 'border-box'
        }}>
          <label style={{ fontWeight: sharedStyles.fontWeightBold, fontSize: 16, marginBottom: 8, display: 'block' }}>Templates</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <select
              onChange={e => {
                const idx = e.target.value;
                if (idx !== "") loadTemplate(templates[idx]);
              }}
              value=""
              style={{
                border: `1px solid ${palette.borderAlt}`,
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 15,
                background: palette.card,
                minWidth: 180
              }}
            >
              <option value="">Load template...</option>
              {templates.map((tpl, idx) => (
                <option key={tpl.name} value={idx}>{tpl.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              style={{
                border: `1px solid ${palette.borderAlt}`,
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 15,
                background: palette.card,
                minWidth: 180
              }}
            />
            <button
              onClick={saveCurrentTemplate}
              style={{
                background: palette.primary,
                color: palette.card,
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: sharedStyles.fontWeightBold,
                fontSize: 15,
                boxShadow: '0 1px 4px rgba(37,99,235,0.08)'
              }}
            >
              Save Template
            </button>
          </div>
        </div>
        <div style={{
          marginBottom: 28,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          background: palette.background,
          padding: 18,
          boxSizing: 'border-box'
        }}>
          <label style={{ fontWeight: sharedStyles.fontWeightBold, fontSize: 16, marginBottom: 8, display: 'block' }}>Define Entity Schema</label>
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
                  border: `1px solid ${palette.borderAlt}`,
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: palette.card
                }}
              />
              <select
                value={field.type}
                onChange={e => updateField(idx, "type", e.target.value)}
                style={{
                  flex: 1,
                  border: `1px solid ${palette.borderAlt}`,
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: palette.card
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
                  border: `1px solid ${palette.borderAlt}`,
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 15,
                  background: palette.card
                }}
              />
              <label style={{ flex: 1, fontSize: 14, color: palette.textSecondary, display: 'flex', alignItems: 'center', gap: 4 }}>
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
                  background: palette.danger,
                  color: palette.card,
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 14px',
                  fontWeight: sharedStyles.fontWeightBold,
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
              background: palette.primary,
              color: palette.card,
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontWeight: sharedStyles.fontWeightBold,
              fontSize: 15,
              marginTop: 6,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(37,99,235,0.08)'
            }}
          >
            Add Field
          </button>
        </div>
        <div style={{
          marginBottom: 28,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          background: palette.background,
          padding: 18,
          boxSizing: 'border-box'
        }}>
          <label style={{ fontWeight: sharedStyles.fontWeightBold, fontSize: 16, marginBottom: 8, display: 'block' }}>Upload File</label>
          <input
            type="file"
            onChange={e => setInputFile(e.target.files[0])}
            style={{
              width: '100%',
              border: `1px solid ${palette.borderAlt}`,
              borderRadius: sharedStyles.borderRadius,
              padding: 10,
              fontSize: 16,
              background: palette.inputBackground,
              marginTop: 4,
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? palette.primaryLight : palette.primary,
            color: palette.card,
            border: 'none',
            borderRadius: sharedStyles.borderRadius,
            padding: '12px 32px',
            fontWeight: sharedStyles.fontWeightBold,
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
          <label style={{ fontWeight: sharedStyles.fontWeightBold, fontSize: 16, marginBottom: 8, display: 'block' }}>Output Result</label>
          {output && (
            <OutputVisualizer output={output} />
          )}
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        color: palette.textSecondary,
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

