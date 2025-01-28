import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
  
      if (response.data.success) {
        setMessage('Login successful!');
        setError('');
        localStorage.setItem("email", email);
        localStorage.setItem("role", response.data.role);
  
        const role = response.data.role;
        if (role === 'Doctor') {
          navigate('/dochomepage');
        } else if (role === 'Staff') {
          navigate('/staffhomepage');
        } else {
          navigate('/');
        }
      } else {
        setError(response.data.message || 'Invalid credentials. Please try again.');
        setMessage('');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Your account is locked. Try again after 30 minutes.');
      } else {
        console.error('Error during login:', err);
        setError('Error during login. Please try again.');
      }
      setMessage('');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.header}>Hospital Management System</h1>
        <h2 style={styles.subHeader}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <button onClick={handleForgotPassword} style={styles.forgotPasswordButton}>Forgot Password?</button>
        {message && <p style={styles.successMessage}>{message}</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    color: '#2d3748',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '24px',
    textAlign: 'center',
  },
  subHeader: {
    color: '#4a5568',
    marginBottom: '20px',
    fontSize: '18px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    backgroundColor: '#4299e1',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    color: '#4299e1',
    border: 'none',
    padding: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    marginTop: '20px',
    textAlign: 'center',
    width: '100%',
  },
  successMessage: {
    color: '#38a169',
    fontSize: '14px',
    marginTop: '20px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f0fff4',
    borderRadius: '5px',
    border: '1px solid #9ae6b4',
  },
  errorMessage: {
    color: '#e53e3e',
    fontSize: '14px',
    marginTop: '20px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#fff5f5',
    borderRadius: '5px',
    border: '1px solid #fc8181',
  },
};

export default Login;