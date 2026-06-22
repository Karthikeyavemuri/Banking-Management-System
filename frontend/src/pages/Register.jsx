import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', fullName: '', phone: '', address: '', dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-box" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4" style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create an Account</h2>
        {error && <div className="alert alert-danger" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-secondary">Username</label>
            <input type="text" className="input-custom" name="username" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary">Email</label>
            <input type="email" className="input-custom" name="email" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary">Password</label>
            <input type="password" className="input-custom" name="password" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary">Full Name</label>
            <input type="text" className="input-custom" name="fullName" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary">Phone Number</label>
            <input type="text" className="input-custom" name="phone" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary">Date of Birth</label>
            <input type="date" className="input-custom" name="dateOfBirth" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label text-secondary">Address</label>
            <textarea className="input-custom" name="address" rows="2" onChange={handleChange} required></textarea>
          </div>
          <div className="col-12 mt-4">
            <button type="submit" className="btn-primary-custom w-100">Register</button>
          </div>
        </form>
        <p className="text-center text-secondary mt-3">
          Already have an account? <Link to="/login" className="text-decoration-none" style={{ color: 'var(--accent-primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
