import React, { useState } from "react";

function ChangeUsernameForm() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
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

      setError("");
      setSuccess("");
      setStep(2);
    } catch (err) {
      setError("Could not verify password. Please try again.");
      setSuccess("");
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      setError("New username cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/gameverse/change-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newUsername,
          validateOnly: true,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Username not available.");
        setSuccess("");
        return;
      }

      setError("");
      setSuccess("");
      setStep(3);
    } catch (err) {
      setError("Server error. Try again later.");
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
      const response = await fetch("/gameverse/change-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newUsername }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.success);
        setError("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(result.error || "Something went wrong.");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error. Try again later.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h1>Change Your Username</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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

          <button type="submit" className="changePassword-btn">
            Verify
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleUsernameSubmit}>
          <label htmlFor="newUsername">New Username:</label>
          <input
            type="text"
            id="newUsername"
            name="newUsername"
            required
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <button type="submit" className="changePassword-btn">
            Continue
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleFinalConfirmation}>
          <p style={{ marginBottom: "20px", fontSize: "12px" }}>
            Please type <span style={{ color: "red" }}>CONFIRM</span> to
            finalize changing your username to <strong>{newUsername}</strong>.
          </p>

          <label htmlFor="confirmationText">Type "CONFIRM":</label>
          <input
            id="confirmationText"
            type="text"
            required
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />

          <button type="submit" className="changePassword-btn">
            Change Username
          </button>
        </form>
      )}
    </div>
  );
}

export default ChangeUsernameForm;
