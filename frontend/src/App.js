import { useEffect, useState } from "react";
import EntityExtractor from "./EntityExtractor";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>React + FastAPI</h1>
      <p>{message}</p>
      <EntityExtractor />
    </div>
  );
}

export default App;

