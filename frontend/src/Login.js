import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      setMessage('Login successful!');
      setError('');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setMessage('');
    }
  };

  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
