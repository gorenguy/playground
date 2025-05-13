import React from "react";
import { palette, sharedStyles } from '../../styles/theme';

function OutputVisualizer({ output }) {
  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    return <div style={{ color: palette.danger, fontWeight: sharedStyles.fontWeightBold }}>{output}</div>;
  }
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return <div style={{ color: 'green', fontWeight: sharedStyles.fontWeightBold }}>{parsed}</div>;
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
    return <div style={{ color: 'green', fontWeight: sharedStyles.fontWeightBold }}>{String(parsed)}</div>;
  }
  const entries = Object.entries(parsed);
  if (!entries.length) return <div>No data extracted.</div>;
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      background: palette.backgroundAlt,
      border: `1px solid ${palette.tableBorder}`,
      borderRadius: sharedStyles.borderRadius,
      marginTop: 8
    }}>
      <thead>
        <tr style={{ background: palette.tableHeader }}>
          <th style={{ textAlign: 'left', padding: 8, border: `1px solid ${palette.tableBorder}` }}>Field</th>
          <th style={{ textAlign: 'left', padding: 8, border: `1px solid ${palette.tableBorder}` }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key}>
            <td style={{ padding: 8, border: `1px solid ${palette.tableBorder}`, fontWeight: sharedStyles.fontWeightBold }}>{key}</td>
            <td style={{ padding: 8, border: `1px solid ${palette.tableBorder}` }}>{String(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OutputVisualizer;

