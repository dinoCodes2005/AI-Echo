"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/login/",
        formData
      );
      if (response.status == 200) {
        console.log("success");
      }
      setSuccessMessage("Registration Successful");
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      navigate("/default/");
    } catch (error) {
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((field) => {
          const errorMessages = error.response.data[field];
          if (errorMessages && errorMessages.length > 0) {
            setError(errorMessages[0]);
          }
        });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Login</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your username"
              />
            </div>

            <div style={styles.inputContainer}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Sign in
          </button>
        </form>
        {error && (
          <p className="bg-red-700/70 text-white my-2 rounded-md p-2 ">
            {error}
          </p>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a", // Dark black
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    backgroundColor: "#121212", // Dark gray
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#a0a0a0",
    marginTop: "8px",
  },
  form: {
    marginTop: "32px",
  },
  inputGroup: {
    marginBottom: "24px",
  },
  inputContainer: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#d0d0d0",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#1e1e1e",
    border: "1px solid #333333",
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0d2b66", // Dark blue
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#a0a0a0",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
};

export default LoginPage;
