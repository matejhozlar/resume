import React, { useState } from "react";

function ChangeUsernameForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newUsername = form.get("newUsername");

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
    } else {
      setError(result.error || "Something went wrong.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h1>Change Your Username</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="newUsername">New Username:</label>
        <input type="text" id="newUsername" name="newUsername" required />

        <button type="submit" className="changePassword-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangeUsernameForm;
