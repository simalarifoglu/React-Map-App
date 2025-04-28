import "../../style/auth.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7176/api/Auth/forgot-password', { email });
      setMessage('Password reset link sent to your email.');
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset link.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      await axios.post('https://localhost:7176/api/Auth/reset-password', {
        token,
        newPassword,
      });
      setMessage('Password reset successfully! You can now login.');
    } catch (error) {
      console.error(error);
      setMessage('Error resetting password.');
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-section" onSubmit={token ? handleResetPassword : handleForgotPassword}>
        <div className="auth-title">{token ? "Reset Password" : "Forgot Password"}</div>

        {token ? (
          <>
            <div className="auth-input-group">
              <input
                type="password"
                placeholder="New Password"
                className="auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Your Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="auth-button">
          {token ? "Reset Password" : "Send Reset Link"}
        </button>

        {message && (
          <p className={message.includes("successfully") ? "auth-success-message" : "auth-error-message"}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}

export default ForgotPassword;
