import React from "react";

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

export default OutputVisualizer;

