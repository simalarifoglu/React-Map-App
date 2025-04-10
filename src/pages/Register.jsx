import "../../style/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };  
  const [emailError, setEmailError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setEmailError("Geçerli bir e-posta adresi girin.");
      return;
    }
    setEmailError("");    
    setErrorMessage("");
    setSuccessMessage("");

    const response = await fetch("https://localhost:7176/api/Auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("Registration successful! You can now log in.");
      navigate("/login");
    } else {
      setErrorMessage(data.message || "Registration failed!");
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-section" onSubmit={handleRegister}>
        <div className="auth-title">REGISTER</div>
        <div className="auth-input-group">
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <input
            type="email"
            placeholder="E-mail"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {emailError && <p className="auth-error-message">{emailError}</p>}

        <div className="auth-input-group">
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button">
          REGISTER
        </button>

        <p className="auth-bottom-text">
          Already have an account ?{" "}
          <a href="/login">Log In</a>
        </p>
        {errorMessage && <p className="auth-error-message">{errorMessage}</p>}
        {successMessage && <p className="auth-success-message">{successMessage}</p>}
      </form>
    </main>
  );
}
