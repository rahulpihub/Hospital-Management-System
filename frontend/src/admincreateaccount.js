import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminCreateAccount() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    qualification: '',
    experience: '',
    certification: '',
    license: '',
    role: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // This will log the form data. Replace with API call if needed.
    setMessage('Account created successfully!');
    setFormData({
      name: '',
      email: '',
      specialization: '',
      qualification: '',
      experience: '',
      certification: '',
      license: '',
      role: '',
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create Account</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          style={styles.input}
        />
        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience (in years)"
          style={styles.input}
        />
        <input
          type="text"
          name="certification"
          value={formData.certification}
          onChange={handleChange}
          placeholder="Certification"
          style={styles.input}
        />
        <input
          type="text"
          name="license"
          value={formData.license}
          onChange={handleChange}
          placeholder="License Number"
          style={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Role</option>
          <option value="Doctor">Doctor</option>
          <option value="Staff">Staff</option>
          <option value="Nurse">Nurse</option>
        </select>
        <button type="submit" style={styles.button}>
          Create Account
        </button>
      </form>
      {message && <p style={styles.successMessage}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '50px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F9F9F9',
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
    padding: '10px 15px',
    margin: '10px 0',
    width: '100%',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  successMessage: {
    color: 'green',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default AdminCreateAccount;
