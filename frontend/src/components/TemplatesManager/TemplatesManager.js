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
              <div style={{
                border: `1px solid ${palette.border}`,
                borderRadius: 12,
                background: palette.background,
                padding: 18,
                marginBottom: 12
              }}>
                <label style={{ fontWeight: sharedStyles.fontWeightBold, fontSize: 16, marginBottom: 8, display: 'block' }}>Fields</label>
                {tpl.fields && tpl.fields.length > 0 ? (
                  tpl.fields.map((field, fidx) => (
                    <div key={fidx} style={{
                      display: 'flex',
                      gap: 10,
                      marginBottom: 10,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      fontSize: 15
                    }}>
                      <span style={{ flex: 2, fontWeight: 600 }}>{field.name}</span>
                      <span style={{ flex: 1, color: palette.textSecondary }}>{field.type}</span>
                      <span style={{ flex: 3, color: palette.textSecondary }}>{field.description}</span>
                      <span style={{ flex: 1, color: field.required ? palette.primary : palette.textSecondary, fontWeight: 500 }}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: palette.textSecondary, fontStyle: 'italic' }}>No fields defined.</div>
                )}
              </div>
              <button onClick={() => onUseTemplate(tpl)} style={{ background: palette.primary, color: palette.buttonText, border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginRight: 8 }}>Use Template</button>
              <button onClick={() => deleteTemplate(idx)} style={{
                background: palette.danger,
                color: palette.buttonText,
                border: 'none',
                borderRadius: sharedStyles.borderRadius,
                padding: '8px 18px',
                fontWeight: sharedStyles.fontWeightBold,
                marginLeft: 4,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}>Delete</button>
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

