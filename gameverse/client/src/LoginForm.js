import React, { useState } from "react";

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      onLogin(data.user);
    } else {
      setError(data.error || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h1>Sign In</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} required />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="changePassword-btn">
          Sign In
        </button>
      </form>

      <p>
        Don&apos;t have an account yet?{" "}
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToRegister}
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
