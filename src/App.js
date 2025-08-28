import React, { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import Result from "./components/Result";

import "./App.css";
function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="App">
      <div className="container">
        {!result ? (
          <Questionnaire setResult={setResult} />
        ) : (
          <Result result={result} />
        )}
      </div>
    </div>
  );
}

export default App;
