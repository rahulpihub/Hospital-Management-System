import React, { useState } from 'react';

function Admin() {
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div>
          <label>Access Privilege:</label>
          <select name="privilege" value={formData.privilege} onChange={handleChange} required>
            <option value="">Select Privilege</option>
            <option value="Full Privilege">Full Privilege</option>
            <option value="Moderate Privilege">Moderate Privilege</option>
            <option value="Basic Privilege">Basic Privilege</option>
          </select>
        </div>
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Admin;
