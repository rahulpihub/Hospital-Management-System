import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

function Admin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    privilege: '',
  });
  const [message, setMessage] = useState('');

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setMessage('Invalid email format. Only @gmail.com is allowed.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: '',
          privilege: '',
        });
      } else {
        setMessage(result.message || 'Failed to create account.');
      }
    } catch (error) {
      setMessage('An error occurred while creating the account.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNavigation = () => {
    navigate('/admin-create-account');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Registration</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          style={styles.input}
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Staff">Staff</option>
        </select>
        <select
          style={styles.input}
          name="privilege"
          value={formData.privilege}
          onChange={handleChange}
          required
        >
          <option value="">Select Privilege</option>
          <option value="Full Privilege">Full Privilege</option>
          <option value="Moderate Privilege">Moderate Privilege</option>
          <option value="Basic Privilege">Basic Privilege</option>
        </select>
        <button type="submit" style={styles.button}>
          Create Account
        </button>
      </form>
      <button onClick={handleNavigation} style={{ ...styles.button, marginTop: '10px' }}>
        Navigate to Create Account Page
      </button>
      {message && <p style={message.includes('error') ? styles.errorMessage : styles.successMessage}>{message}</p>}
    </div>
  );
}

export default Admin;
