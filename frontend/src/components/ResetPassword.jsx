import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../utils/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setError("Invalid or missing reset token");
      setValidatingToken(false);
      return;
    }

    fetch(buildApiUrl("/auth/password-reset/validate/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setError(data.error || "Invalid or expired reset token");
        }
      })
      .catch(() => {
        setError("Failed to validate reset token");
      })
      .finally(() => {
        setValidatingToken(false);
      });
  }, [token]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    fetch(buildApiUrl("/auth/password-reset/confirm/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token, 
        new_password: newPassword 
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || data.new_password?.[0] || "Failed to reset password");
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(data.message || "Password reset successful!");
        setNewPassword("");
        setConfirmPassword("");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (validatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Reset Password</h2>
          <p style={{ textAlign: "center", color: "#666" }}>
            Validating reset token...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Reset Password</h2>
          <div className="error-message">
            {error || "Invalid or expired reset token"}
          </div>
          <button 
            className="btn btn__primary btn__lg"
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Reset Password</h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Enter your new password below.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="input input__lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="input input__lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Confirm new password"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn__primary btn__lg"
          disabled={loading || success}
        >
          {loading ? "Resetting..." : success ? "Redirecting..." : "Reset Password"}
        </button>

        {success && (
          <p style={{ textAlign: "center", color: "#28a745", marginTop: "1rem" }}>
            Redirecting to login page...
          </p>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
