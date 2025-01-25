import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;

    try {
      // Request OTP
      const response = await axios.post("http://127.0.0.1:8000/api/send_otp", { email });

      console.log(response.data); // Log the response for debugging

      if (response.data.success) {
        setOtpSent(true);
        setError("");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Error sending OTP");
    }
  };

  const handleOtpVerify = async () => {
    const { email } = formData;
  
    try {
      // Verify OTP
      const response = await axios.post("http://127.0.0.1:8000/api/verify_otp", { email, otp });
  
      console.log(response.data); // Log the OTP verification response
  
      if (response.data.success) {
        setError("");
        // Proceed with registration after OTP verification
        await axios.post("http://127.0.0.1:8000/api/registration", formData);
        navigate("/login"); // Navigate to Login after successful registration
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Error verifying OTP");
    }
  };
  

  const handleLoginRedirect = () => {
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to Hospital Registration Page!</h1>
      {!otpSent ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Send OTP
          </button>
        </form>
      ) : (
        <div style={styles.form}>
          <h2 style={styles.header}>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleOtpVerify} style={styles.button}>
            Verify OTP
          </button>
        </div>
      )}
      <button onClick={handleLoginRedirect} style={styles.loginButton}>
        Login In
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "50px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#F3F3F3",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "12px 20px",
    margin: "10px 0",
    width: "80%",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    backgroundColor: "#FF9900", // Amazon's yellow-orange theme
    color: "#fff",
    border: "none",
    padding: "10px 30px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
  loginButton: {
    backgroundColor: "#4CAF50", // Green button for Login In
    color: "#fff",
    border: "none",
    padding: "10px 30px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontSize: "16px",
  },
};

export default Register;
