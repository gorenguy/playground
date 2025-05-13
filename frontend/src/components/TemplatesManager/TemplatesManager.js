import { useState } from "react";
import { palette, sharedStyles } from '../../styles/theme';

function TemplatesManager({ templates, saveTemplates, onUseTemplate }) {
  const deleteTemplate = (idx) => {
    const updated = templates.filter((_, i) => i !== idx);
    saveTemplates(updated);
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
          color: palette.textHeader
        }}>Templates Manager</h1>
        <p style={{ color: palette.textSecondary, fontSize: 18, margin: 0 }}>Manage your entity extraction templates</p>
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
        {templates.length === 0 && <div style={{ color: palette.textSecondary }}>No templates saved.</div>}
        {templates.map((tpl, idx) => (
          <div key={idx} style={{ border: `1px solid ${palette.border}`, borderRadius: sharedStyles.cardRadius, padding: 24, marginBottom: 24, background: palette.backgroundAlt }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{tpl.name}</div>
              <pre style={{ background: palette.background, padding: 14, borderRadius: 8, fontSize: 15, marginBottom: 12 }}>{JSON.stringify(tpl.fields, null, 2)}</pre>
              <button onClick={() => onUseTemplate(tpl)} style={{ background: palette.primary, color: palette.buttonText, border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginRight: 8 }}>Use Template</button>
              <button onClick={() => deleteTemplate(idx)} style={{ background: palette.danger, color: palette.buttonText, border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        ))}
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

export default TemplatesManager;

