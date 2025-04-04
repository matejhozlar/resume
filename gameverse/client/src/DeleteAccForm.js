import React, { useState } from "react";

function DeleteAccount() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill out both password fields.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    // 🔐 Server-side password verification
    try {
      const response = await fetch("/gameverse/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Incorrect password.");
        setSuccess("");
        return;
      }

      // ✅ Password verified — move to confirmation step
      setError("");
      setSuccess("");
      setStep(2);
    } catch (err) {
      setError("Could not verify password. Please try again.");
      setSuccess("");
    }
  };

  const handleFinalConfirmation = async (e) => {
    e.preventDefault();

    if (confirmationText !== "CONFIRM") {
      setError('You must type "CONFIRM" to proceed.');
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("/gameverse/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.success);
        setError("");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(result.error || "Failed to delete account.");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error. Try again later.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h1 className="glitch">Delete Account</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="deleteAccSubmit">
            Submit
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleFinalConfirmation}>
          <p style={{ marginBottom: "20px", fontSize: "12px" }}>
            This action is <strong>permanent</strong>. Type{" "}
            <span style={{ color: "red" }}>CONFIRM</span> below to proceed.
          </p>

          <label htmlFor="confirmation">Type "CONFIRM"</label>
          <input
            id="confirmation"
            type="text"
            required
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />

          <button type="submit" className="danger-btn">
            Delete Account
          </button>
        </form>
      )}
    </div>
  );
}

export default DeleteAccount;
