import React from "react";
import { palette, sharedStyles } from '../../styles/theme';

function OutputVisualizer({ output, fields }) {
  // Normalize output to object
  let data;
  if (typeof output === 'string') {
    try { data = JSON.parse(output); }
    catch { return <div style={{ color: palette.danger, fontWeight: sharedStyles.fontWeightBold }}>{output}</div>; }
  } else {
    data = output;
  }
  // Handle top-level result or nested .result
  if (data && typeof data === 'object' && data.result !== undefined) {
    try { data = typeof data.result === 'string' ? JSON.parse(data.result) : data.result; }
    catch { data = data.result; }
  }
  // Handle batch results
  if (data && Array.isArray(data.results) && data.results.length > 1) {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', background: palette.backgroundAlt, border: `1px solid ${palette.tableBorder}`, borderRadius: sharedStyles.borderRadius, marginTop: 8 }}>
        <thead>
          <tr style={{ background: palette.tableHeader }}>
            {fields.map(f => f.name).map(name => (
              <th key={name} style={{ textAlign: 'left', padding: 8, border: `1px solid ${palette.tableBorder}` }}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.results.map((item, i) => (
            <tr key={i}>
              {fields.map(f => (
                <td key={f.name} style={{ padding: 8, border: `1px solid ${palette.tableBorder}` }}>{String(item[f.name] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // Single item
  let parsed = data;
  if (!parsed || typeof parsed !== 'object') {
    return <div style={{ color: 'green', fontWeight: sharedStyles.fontWeightBold }}>{String(parsed)}</div>;
  }
  // Order entries by fields and include extras
  let entries;
  if (fields && Array.isArray(fields) && fields.length > 0) {
    entries = fields
      .filter(f => f.name && Object.prototype.hasOwnProperty.call(parsed, f.name))
      .map(f => [f.name, parsed[f.name]]);
    // Add any extra keys not in fields at the end
    const extra = Object.entries(parsed).filter(([k]) => !fields.some(f => f.name === k));
    entries = [...entries, ...extra];
  } else {
    entries = Object.entries(parsed);
  }
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

