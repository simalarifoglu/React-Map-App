import "../../style/auth.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/state/authState";
import { useNavigate } from "react-router-dom";
import { clearObjects } from "../redux/state/mapObjectsState";
import { vectorSource } from "../utils/MapView";
import { loginSuccessAndReset } from "../redux/state/authState";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };  
  const [emailError, setEmailError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!isValidEmail(email)) {
      setEmailError("Geçerli bir e-posta adresi girin.");
      return;
    }
  
    setEmailError("");
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const response = await fetch("https://localhost:7176/api/Auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }
  
      dispatch(clearObjects());
      vectorSource.clear();
  
      const userData = {
        email: data.email,
        role: data.role,
        id: data.id,
        username: data.username,
      };
  
      await dispatch(loginSuccessAndReset(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/map");
  
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  
  

  return (
    <main className="auth-container">
      <form className="auth-section" onSubmit={handleLogin}>
        <div className="auth-title">LOGIN</div>

        <div className="auth-input-group">
          <input
            type="email"
            placeholder="E-mail"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>

        <div className="auth-remember-me">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>

        <button type="submit" className="auth-button">
          LOGIN
        </button>

        <p className="auth-bottom-text">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>

        {errorMessage && <p className="auth-error-message">{errorMessage}</p>}
        {successMessage && <p className="auth-success-message">{successMessage}</p>}

      </form>
    </main>
  );
}
