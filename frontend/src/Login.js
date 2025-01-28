import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
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
        localStorage.setItem("email", email); // Store email in localStorage
        localStorage.setItem("role", response.data.role); // Store user role in localStorage
  
        // Navigate based on the role
        const role = response.data.role;
        if (role === 'Doctor') {
          navigate('/dochomepage'); // Navigate to doctor homepage
        } else if (role === 'Staff') {
          navigate('/staffhomepage'); // Navigate to staff homepage
        } else {
          navigate('/'); 
        }
      } else {
        setError(response.data.message || 'Invalid credentials. Please try again.');
        setMessage('');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // If the account is locked, show an appropriate message
        setError('Your account is locked. Try again after 30 minutes.');
      } else {
        console.error('Error during login:', err);
        setError('Error during login. Please try again.');
      }
      setMessage('');
    }
  };
  

  // Navigate to forgot password page
  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Hospital Management System - Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <button onClick={handleForgotPassword} style={styles.forgotPasswordButton}>Forgot Password</button>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
}

// Styles for the component
const styles = {
  container: {
    marginTop: '50px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F3F3F3',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: 'auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#333',
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '12px 20px',
    margin: '10px 0',
    width: '80%',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    backgroundColor: '#FF9900',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
  forgotPasswordButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
  successMessage: {
    color: 'green',
    fontSize: '16px',
    marginTop: '20px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default Login;
