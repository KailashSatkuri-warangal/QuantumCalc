import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import "./calculator.css";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const buttons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];

  const operators = ["+", "-", "*", "/"];

  // Append value with operator validation
  const handleClick = (value) => {
    if (
      operators.includes(value) &&
      (input === "" || operators.includes(input.slice(-1)))
    ) return; // prevent multiple operators
    setInput((prev) => prev + value);
  };

  const handleClear = () => setInput("");

  const handleCalculate = () => {
    try {
      const result = evaluate(input).toString();
      setHistory((prev) => [...prev, { expr: input, result }]);
      setInput(""); // clear input after calculation
    } catch {
      setInput("Error");
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if ("0123456789.".includes(e.key)) handleClick(e.key);
      if (operators.includes(e.key)) handleClick(e.key);
      if (e.key === "Enter") handleCalculate();
      if (e.key === "Backspace") setInput((prev) => prev.slice(0, -1));
      if (e.key.toLowerCase() === "c") handleClear();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [input]);

  // Optional: click history to reuse result
  const handleHistoryClick = (value) => {
    setInput(value);
  };

  return (
    <div className={`calculator-container ${darkMode ? "dark" : "light"}`}>
      <div className="theme-toggle">
        <span className="toggle-icon">{darkMode ? "🌙" : "☀️"}</span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>

      <h2>Calculator</h2>
      <input
        type="text"
        value={input}
        className="calculator-input"
        readOnly
        placeholder="0"
      />

      <div className="button-grid">
        {buttons.flat().map((btn) => (
          <button
            key={btn}
            className={
              operators.includes(btn)
                ? "operator"
                : btn === "="
                ? "equals-btn"
                : ""
            }
            onClick={() =>
              btn === "=" ? handleCalculate() : handleClick(btn)
            }
          >
            {btn}
          </button>
        ))}
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-panel">
          <h3>History</h3>
          <ul>
            {history
              .slice(-10)
              .reverse()
              .map((h, idx) => (
                <li key={idx} onClick={() => handleHistoryClick(h.result)}>
                  <span className="expr">{h.expr}</span> ={" "}
                  <span className="result">{h.result}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
