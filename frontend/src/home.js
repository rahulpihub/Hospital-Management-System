import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // State to store the email

  useEffect(() => {
    // Get the email from localStorage or sessionStorage after successful login
    const storedEmail = localStorage.getItem("email"); // Assuming email is stored in localStorage
    if (storedEmail) {
      setEmail(storedEmail); // Set the email state
    } else {
      setError("No email found. Please log in again.");
      navigate("/login"); // Redirect to login if no email is found
    }
  }, [navigate]);

  // Handle logout request
  const handleLogout = async () => {
    try {
      // Check if email exists before sending the request
      if (!email) {
        setError("Email is required for logout.");
        return;
      }

      // Sending the logout request with the email
      const response = await axios.post("http://127.0.0.1:8000/api/logout", { email });

      if (response.data.success) {
        setMessage("Logout successful!");
        setError("");
        localStorage.removeItem("email"); // Optionally clear the email from storage
        navigate("/login"); // Navigate to Login page after successful logout
      } else {
        setError(response.data.message || "Error during logout. Please try again.");
        setMessage("");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Error during logout. Please try again.");
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>The Hospital Dashboard!</h1>
      <p style={styles.greeting}>You're logged in successfully!</p>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#F3F3F3",
    borderRadius: "8px",
    margin: "auto",
    maxWidth: "600px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "28px",
  },
  greeting: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#FF9900", // Amazon's yellow-orange theme
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    marginBottom: "10px",
  },
};

export default Home;
