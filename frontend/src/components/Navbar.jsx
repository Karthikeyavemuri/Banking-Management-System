import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="navbar-brand text-decoration-none">NexusBank</Link>
      <div>
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="text-light">Hello, {user.username}</span>
            {user.roles && user.roles.includes('ROLE_ADMIN') ? (
              <Link to="/admin" className="text-light text-decoration-none">Admin Panel</Link>
            ) : (
              <>
                <Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link>
                <Link to="/transactions" className="text-light text-decoration-none">Transactions</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn-primary-custom" style={{ padding: '6px 16px', fontSize: '14px' }}>Logout</button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn-primary-custom text-decoration-none">Login</Link>
            <Link to="/register" className="btn-primary-custom text-decoration-none" style={{ background: 'transparent', border: '1px solid var(--accent-primary)' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
