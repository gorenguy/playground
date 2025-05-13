import { useState } from "react";
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
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '0 40px',
        height: 72,
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: -1,
          color: '#2563eb',
        }}>
          Entity Extractor
        </span>
        <nav style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button
            onClick={() => setScreen("extract")}
            style={{
              background: screen === "extract" ? '#2563eb' : 'transparent',
              color: screen === "extract" ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: 600,
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
              background: screen === "templates" ? '#2563eb' : 'transparent',
              color: screen === "templates" ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: 600,
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

