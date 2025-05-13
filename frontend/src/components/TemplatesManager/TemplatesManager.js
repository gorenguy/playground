import { useState } from "react";

function TemplatesManager({ templates, saveTemplates }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFields, setEditFields] = useState([]);

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditName(templates[idx].name);
    setEditFields(templates[idx].fields);
  };

  const saveEdit = () => {
    const updated = templates.map((tpl, idx) =>
      idx === editingIdx ? { name: editName, fields: editFields } : tpl
    );
    saveTemplates(updated);
    setEditingIdx(null);
  };

  const deleteTemplate = (idx) => {
    const updated = templates.filter((_, i) => i !== idx);
    saveTemplates(updated);
    setEditingIdx(null);
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
        }}>Templates Manager</h1>
        <p style={{ color: '#64748b', fontSize: 18, margin: 0 }}>Manage your entity extraction templates</p>
      </header>
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
        padding: 48,
        marginBottom: 48
      }}>
        {templates.length === 0 && <div style={{ color: '#64748b' }}>No templates saved.</div>}
        {templates.map((tpl, idx) => (
          <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 24, background: '#f8fafc' }}>
            {editingIdx === idx ? (
              <div>
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ fontSize: 18, marginBottom: 8, width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, padding: 8, background: '#fff' }} />
                <pre style={{ background: '#f1f5f9', padding: 14, borderRadius: 8, fontSize: 15, marginBottom: 12 }}>{JSON.stringify(editFields, null, 2)}</pre>
                <button onClick={saveEdit} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginRight: 8 }}>Save</button>
                <button onClick={() => setEditingIdx(null)} style={{ background: '#e2e8f0', color: '#222', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }}>Cancel</button>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{tpl.name}</div>
                <pre style={{ background: '#f1f5f9', padding: 14, borderRadius: 8, fontSize: 15, marginBottom: 12 }}>{JSON.stringify(tpl.fields, null, 2)}</pre>
                <button onClick={() => startEdit(idx)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginRight: 8 }}>Edit</button>
                <button onClick={() => deleteTemplate(idx)} style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }}>Delete</button>
              </div>
            )}
          </div>
        ))}
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

export default TemplatesManager;

