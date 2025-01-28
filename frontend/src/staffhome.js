import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function StaffHome() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      setError("No email found. Please log in again.")
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = async () => {
    try {
      if (!email) {
        setError("Email is required for logout.")
        return
      }

      const response = await axios.post("http://127.0.0.1:8000/api/logout", { email })

      if (response.data.success) {
        setMessage("Logout successful!")
        setError("")
        localStorage.removeItem("email")
        navigate("/login")
      } else {
        setError(response.data.message || "Error during logout. Please try again.")
        setMessage("")
      }
    } catch (err) {
      console.error("Error during logout:", err)
      setError("Error during logout. Please try again.")
      setMessage("")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>Staff Dashboard</h2>
        <nav style={styles.sidebarNav}>
          <ul style={styles.sidebarNavList}>
            <li>
              <a href="#dashboard" style={styles.sidebarNavLink}>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#patients" style={styles.sidebarNavLink}>
                Patients
              </a>
            </li>
            <li>
              <a href="#appointments" style={styles.sidebarNavLink}>
                Appointments
              </a>
            </li>
            <li>
              <a href="#records" style={styles.sidebarNavLink}>
                Medical Records
              </a>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      <main style={styles.content}>
        <h1 style={styles.header}>The Hospital's Staff Dashboard!</h1>
        <p style={styles.greeting}>You're logged in successfully!</p>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <div style={styles.dashboardGrid}>
          <div style={styles.dashboardCard}>
            <h2 style={styles.cardHeader}>Today's Overview</h2>
            <p style={styles.cardContent}>10 Appointments</p>
            <p style={styles.cardContent}>5 New Patients</p>
          </div>
          <div style={styles.dashboardCard}>
            <h2 style={styles.cardHeader}>Total Patients</h2>
            <p style={styles.cardContent}>1,234</p>
          </div>
          <div style={styles.dashboardCard}>
            <h2 style={styles.cardHeader}>Upcoming Appointments</h2>
            <p style={styles.cardContent}>Next: John Doe at 2:30 PM</p>
          </div>
          <div style={styles.dashboardCard}>
            <h2 style={styles.cardHeader}>Recent Records</h2>
            <p style={styles.cardContent}>3 Updated Today</p>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f4f8",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    color: "#2c3e50",
    marginBottom: "30px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  sidebarNav: {
    flex: 1,
  },
  sidebarNavList: {
    listStyleType: "none",
    padding: 0,
  },
  sidebarNavLink: {
    color: "#4a5568",
    textDecoration: "none",
    fontSize: "1rem",
    display: "block",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  logoutButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  content: {
    flex: 1,
    padding: "30px",
  },
  header: {
    color: "#2d3748",
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "28px",
  },
  greeting: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#4a5568",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  dashboardCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardHeader: {
    color: "#2d3748",
    fontSize: "1.2rem",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  cardContent: {
    color: "#4a5568",
    fontSize: "1rem",
    marginBottom: "5px",
  },
  error: {
    color: "#e53e3e",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#fff5f5",
    borderRadius: "5px",
    border: "1px solid #fc8181",
  },
  success: {
    color: "#38a169",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f0fff4",
    borderRadius: "5px",
    border: "1px solid #9ae6b4",
  },
}

export default StaffHome;