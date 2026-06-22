import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-box">
        <h2 className="text-center mb-4" style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h2>
        {error && <div className="alert alert-danger" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary">Username</label>
            <input 
              type="text" 
              className="input-custom" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary">Password</label>
            <input 
              type="password" 
              className="input-custom" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary-custom w-100 mb-3">Sign In</button>
        </form>
        <p className="text-center text-secondary">
          Don't have an account? <Link to="/register" className="text-decoration-none" style={{ color: 'var(--accent-primary)' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
