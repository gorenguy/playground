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

  const saveTemplates = (newTemplates) => {
    setTemplates(newTemplates);
    localStorage.setItem("entity_templates", JSON.stringify(newTemplates));
  };

  return (
    <div>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: palette.card,
        boxShadow: palette.cardShadow,
        padding: '0 40px',
        height: 72,
        borderBottom: `1px solid ${palette.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <span style={{
          fontWeight: sharedStyles.fontWeightHeader,
          fontSize: 28,
          letterSpacing: -1,
          color: palette.primary,
        }}>
          Entity Extractor
        </span>
        <nav style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button
            onClick={() => setScreen("extract")}
            style={{
              background: screen === "extract" ? palette.primary : 'transparent',
              color: screen === "extract" ? palette.buttonText : palette.text,
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: sharedStyles.fontWeightBold,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            Extraction
          </button>
          <button
            onClick={() => setScreen("templates")}
            style={{
              background: screen === "templates" ? palette.primary : 'transparent',
              color: screen === "templates" ? palette.buttonText : palette.text,
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: sharedStyles.fontWeightBold,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            Templates
          </button>
        </nav>
      </header>
      {screen === "extract" ? (
        <EntityExtractor
          templates={templates}
          saveTemplates={saveTemplates}
        />
      ) : (
        <TemplatesManager
          templates={templates}
          saveTemplates={saveTemplates}
        />
      )}
    </div>
  );
}

export default App;

