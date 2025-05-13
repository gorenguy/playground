import { useState } from "react";
import { palette, sharedStyles } from './styles/theme';
import EntityExtractor from "./components/EntityExtractor/EntityExtractor";
import TemplatesManager from "./components/TemplatesManager/TemplatesManager";

function App() {
  const [screen, setScreen] = useState("extract");
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem("entity_templates");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTemplate, setActiveTemplate] = useState(null);

  const saveTemplates = (newTemplates) => {
    setTemplates(newTemplates);
    localStorage.setItem("entity_templates", JSON.stringify(newTemplates));
  };

  const handleUseTemplate = (tpl) => {
    setActiveTemplate(tpl);
    setScreen("extract");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: palette.background,
      fontFamily: sharedStyles.fontFamily,
      color: palette.text,
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: palette.headerDark, // white header
        boxShadow: palette.cardShadow,
        padding: '0 32px',
        height: 64,
        borderBottom: `1px solid ${palette.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <span style={{
          fontWeight: sharedStyles.fontWeightHeader,
          fontSize: 26,
          letterSpacing: -0.5,
          color: palette.primary,
          fontFamily: sharedStyles.fontFamily,
        }}>
          {/* Logo placeholder instead of EE Entity Extractor */}
          <span style={{
            display: 'inline-block',
            background: palette.primaryLight,
            color: palette.primary,
            borderRadius: 8,
            padding: '2px 12px',
            marginRight: 10,
            fontWeight: 700,
            fontSize: 22,
          }}>Logo</span>
        </span>
        <nav style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
          <button
            onClick={() => { setScreen("extract"); setActiveTemplate(null); }}
            style={{
              background: screen === 'extract' ? palette.primary : palette.backgroundAlt,
              color: screen === 'extract' ? palette.buttonText : palette.text,
              border: 'none',
              borderRadius: sharedStyles.borderRadius,
              padding: '8px 18px',
              fontWeight: 600,
              fontFamily: sharedStyles.fontFamily,
              fontSize: 16,
              boxShadow: screen === 'extract' ? '0 2px 8px rgba(219,76,63,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Extract
          </button>
          <button
            onClick={() => setScreen("templates")}
            style={{
              background: screen === 'templates' ? palette.primary : palette.backgroundAlt,
              color: screen === 'templates' ? palette.buttonText : palette.text,
              border: 'none',
              borderRadius: sharedStyles.borderRadius,
              padding: '8px 18px',
              fontWeight: 600,
              fontFamily: sharedStyles.fontFamily,
              fontSize: 16,
              boxShadow: screen === 'templates' ? '0 2px 8px rgba(219,76,63,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Templates
          </button>
        </nav>
      </header>
      <main style={{
        maxWidth: 900,
        margin: '40px auto',
        background: palette.card,
        borderRadius: sharedStyles.cardRadius,
        boxShadow: palette.cardShadow,
        padding: sharedStyles.cardPadding,
        minHeight: 400,
      }}>
        {screen === "extract" ? (
          <EntityExtractor
            templates={templates}
            saveTemplates={saveTemplates}
            onUseTemplate={handleUseTemplate}
            activeTemplate={activeTemplate}
          />
        ) : (
          <TemplatesManager
            templates={templates}
            saveTemplates={saveTemplates}
            onUseTemplate={handleUseTemplate}
          />
        )}
      </main>
    </div>
  );
}

export default App;

