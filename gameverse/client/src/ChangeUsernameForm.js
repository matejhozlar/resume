import React, { useState } from "react";

function ChangeUsernameForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch(
      "http://localhost:5000/gameverse/change-username",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ChangeUsernameForm;
