import React, { useState, useEffect } from "react";
import "./App.css";

const PasswordGenerator = ({ switchPage }) => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [excludeChars, setExcludeChars] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [strength, setStrength] = useState("");

  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
    setPasswords(savedPasswords);
  }, []);

  useEffect(() => {
    localStorage.setItem("passwords", JSON.stringify(passwords));
  }, [passwords]);

  const generatePassword = (length, charset) => {
    let password = "";
    const filteredCharset = charset
      .split("")
      .filter((char) => !excludeChars.includes(char));
    const charsetLength = filteredCharset.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      password += filteredCharset[randomIndex];
    }
    return password;
  };

  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (/[a-z]/.test(password)) strengthScore++;
    if (/[A-Z]/.test(password)) strengthScore++;
    if (/[0-9]/.test(password)) strengthScore++;
    if (/[^a-zA-Z0-9]/.test(password)) strengthScore++;

    if (strengthScore === 1) return "Weak";
    if (strengthScore === 2) return "Medium";
    if (strengthScore >= 3) return "Strong";
  };

  const handleGenerate = () => {
    let charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    const newPassword = generatePassword(length, charset);
    setPassword(newPassword);

    const updatedPasswords = [...passwords, newPassword];
    if (updatedPasswords.length > 5) {
      updatedPasswords.shift(); // Remove the oldest password
    }

    setPasswords(updatedPasswords);
    setStrength(calculateStrength(newPassword));
  };

  const handleLengthChange = (event) => {
    setLength(parseInt(event.target.value, 10));
  };

  const handleExcludeCharsChange = (event) => {
    setExcludeChars(event.target.value);
  };

  const handleRandomize = () => {
    handleGenerate();
  };

  return (
    <div className="container">
      <h1>Smart Password Generator</h1>
      <div className="input-group">
        <label>Password Length: {length}</label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={handleLengthChange}
        />
      </div>
      <div className="input-group">
        <label>Exclude Characters:</label>
        <input
          type="text"
          value={excludeChars}
          onChange={handleExcludeCharsChange}
          placeholder="e.g. abc123"
        />
      </div>
      <div className="button-group">
        <button onClick={handleGenerate}>Generate Password</button>
        <button onClick={handleRandomize}>Randomize</button>
        <button onClick={switchPage}>Check Password Strength</button>
      </div>
      {password && (
        <div className="output-group">
          <h2>Generated Password:</h2>
          <p>{password}</p>
          <h3>Password Strength: {strength}</h3>
        </div>
      )}
      {passwords.length > 0 && (
        <div className="output-group">
          <h2>Saved Passwords:</h2>
          <ul>
            {passwords.map((pass, index) => (
              <li key={index}>{pass}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PasswordChecker = ({ switchPage }) => {
  const [inputPassword, setInputPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");

  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (/[a-z]/.test(password)) strengthScore++;
    if (/[A-Z]/.test(password)) strengthScore++;
    if (/[0-9]/.test(password)) strengthScore++;
    if (/[^a-zA-Z0-9]/.test(password)) strengthScore++;

    if (strengthScore === 1) return "Weak";
    if (strengthScore === 2) return "Medium";
    if (strengthScore >= 3) return "Strong";
  };

  const suggestStrongerPassword = (password) => {
    let suggestion = password;
    if (!/[A-Z]/.test(password)) suggestion += "A";
    if (!/[a-z]/.test(password)) suggestion += "a";
    if (!/[0-9]/.test(password)) suggestion += "1";
    if (!/[^a-zA-Z0-9]/.test(password)) suggestion += "@";

    return suggestion.length > password.length ? suggestion : password + "!";
  };

  const handleCheckStrength = () => {
    const strength = calculateStrength(inputPassword);
    setStrength(strength);

    if (strength !== "Strong") {
      setSuggestedPassword(suggestStrongerPassword(inputPassword));
    } else {
      setSuggestedPassword("");
    }
  };

  const handleInputChange = (event) => {
    setInputPassword(event.target.value);
  };

  return (
    <div className="container">
      <h1>Password Strength Checker</h1>
      <div className="input-group">
        <label>Enter Password:</label>
        <input type="text" value={inputPassword} onChange={handleInputChange} />
      </div>
      <div className="button-group">
        <button onClick={handleCheckStrength}>Check Strength</button>
        <button onClick={switchPage}>Back to Generator</button>
      </div>
      {strength && (
        <div className="output-group">
          <h2>Password Strength: {strength}</h2>
          {suggestedPassword && (
            <>
              <h3>Suggested Stronger Password:</h3>
              <p>{suggestedPassword}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("generator");

  const switchPage = () => {
    setCurrentPage(currentPage === "generator" ? "checker" : "generator");
  };

  return (
    <>
      {currentPage === "generator" ? (
        <PasswordGenerator switchPage={switchPage} />
      ) : (
        <PasswordChecker switchPage={switchPage} />
      )}
    </>
  );
};

export default App;
