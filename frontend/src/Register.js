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
      console.log("Email:", email); // Debugging the email value

      // Request OTP
      const response = await axios.post(
        "http://127.0.0.1:8000/api/send_otp", 
        { email } // sending email in the request body as JSON
      );

      if (response.data.success) {
        setOtpSent(true);
        setError("");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending OTP");
    }
  };

  const handleOtpVerify = async () => {
    const { email } = formData;

    try {
      // Verify OTP
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify_otp", 
        { email, otp }
      );

      if (response.data.success) {
        setError("");
        // Proceed with registration
        await axios.post("http://127.0.0.1:8000/api/registration", formData);
        navigate("/login"); // Navigate to Login after successful registration
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying OTP");
    }
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h1>Register</h1>
      {!otpSent ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <button type="submit" style={{ padding: "10px 20px" }}>Send OTP</button>
        </form>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <button onClick={handleOtpVerify} style={{ padding: "10px 20px" }}>
            Verify OTP
          </button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
