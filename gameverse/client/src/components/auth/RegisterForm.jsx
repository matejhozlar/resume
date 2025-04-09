import React, { useState } from "react";

function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatedPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => {
        setSuccess("");
        onRegister(null);
      }, 3000);
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="repeatedPassword">Repeat Password:</label>
        <input
          type="password"
          name="repeatedPassword"
          value={formData.repeatedPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="changePassword-btn">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onRegister(null)}
          className="link-button"
        >
          Sign in here
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
