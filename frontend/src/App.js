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
      <nav style={{ display: 'flex', gap: 16, padding: 16, background: '#f1f5f9' }}>
        <button onClick={() => setScreen("extract")}>Extraction</button>
        <button onClick={() => setScreen("templates")}>Templates</button>
      </nav>
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

