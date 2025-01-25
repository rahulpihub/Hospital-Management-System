import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (clear user session, etc.)
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page!</h1>
      <p style={styles.greeting}>You're logged in successfully!</p>
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
};

export default Home;
