import React, { useState } from "react";

function ChangePasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const response = await fetch("/api/gameverse/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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
      <h1>Change Your Password</h1>

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

      <form onSubmit={handleSubmit}>
        <label htmlFor="oldPassword">Password:</label>
        <input type="password" id="oldPassword" name="oldPassword" required />

        <label htmlFor="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" required />

        <label htmlFor="confirmPassword">New Password Again:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />

        <button type="submit" className="changePassword-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
