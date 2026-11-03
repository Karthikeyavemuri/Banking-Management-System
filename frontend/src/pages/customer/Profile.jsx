import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [customerData, setCustomerData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (user?.id) {
      api.get(`/customers/user/${user.id}`)
        .then(res => {
          setCustomerData(res.data);
          setProfileForm({
            fullName: res.data.fullName || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            dateOfBirth: res.data.dateOfBirth || '',
          });
        })
        .catch(() => setProfileMsg({ text: 'Failed to load profile data.', type: 'error' }));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!customerData?.id) return;
    setProfileLoading(true);
    setProfileMsg({ text: '', type: '' });
    try {
      const payload = {
        ...customerData,
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        address: profileForm.address,
        dateOfBirth: profileForm.dateOfBirth,
      };
      const res = await api.put(`/customers/${customerData.id}`, payload);
      setCustomerData(res.data);
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg({ text: '', type: '' });
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ text: 'Password changed successfully!', type: 'success' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password. Please try again.';
      setPasswordMsg({ text: msg, type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div className="glass-card" style={{
          display: 'flex', alignItems: 'center', gap: '24px',
          marginBottom: '32px', padding: '32px',
          background: 'linear-gradient(135deg, rgba(6,78,59,0.7), rgba(2,44,34,0.9))',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: '700', color: 'white',
            flexShrink: 0, boxShadow: '0 0 24px rgba(16,185,129,0.4)',
          }}>
            {getInitials(customerData?.fullName || user?.username)}
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
              {customerData?.fullName || user?.username}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
              @{user?.username}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {customerData?.email || user?.email}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge-custom badge-success" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
              ✦ Active Customer
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['info', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.25s ease',
                background: activeTab === tab
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : 'rgba(6,78,59,0.4)',
                color: 'white',
                boxShadow: activeTab === tab ? '0 0 18px rgba(16,185,129,0.4)' : 'none',
                transform: activeTab === tab ? 'translateY(-2px)' : 'none',
              }}
            >
              {tab === 'info' ? '👤 Personal Info' : '🔒 Security'}
            </button>
          ))}
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'info' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '28px', color: 'var(--accent-success)' }}>
              Personal Information
            </h2>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    id="profile-fullname"
                    className="input-custom"
                    type="text"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                {/* Email (read-only) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Email Address <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem' }}>(read-only)</span>
                  </label>
                  <input
                    id="profile-email"
                    className="input-custom"
                    type="email"
                    value={customerData?.email || ''}
                    readOnly
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    className="input-custom"
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Date of Birth
                  </label>
                  <input
                    id="profile-dob"
                    className="input-custom"
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                {/* Address (full width) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Address
                  </label>
                  <input
                    id="profile-address"
                    className="input-custom"
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              {profileMsg.text && (
                <div style={{
                  marginTop: '20px', padding: '12px 16px', borderRadius: '10px',
                  background: profileMsg.type === 'success'
                    ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                  color: profileMsg.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
                  border: `1px solid ${profileMsg.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  fontSize: '0.9rem',
                }}>
                  {profileMsg.type === 'success' ? '✓ ' : '✕ '}{profileMsg.text}
                </div>
              )}

              <button
                id="profile-save-btn"
                type="submit"
                className="btn-primary-custom"
                disabled={profileLoading}
                style={{ marginTop: '28px', width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', color: 'var(--accent-success)' }}>
              Change Password
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>
              Choose a strong password you haven't used before.
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Old Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Current Password
                  </label>
                  <input
                    id="pwd-old"
                    className="input-custom"
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                {/* New Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    New Password
                  </label>
                  <input
                    id="pwd-new"
                    className="input-custom"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>

                {/* Confirm New Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>
                    Confirm New Password
                  </label>
                  <input
                    id="pwd-confirm"
                    className="input-custom"
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password"
                    required
                  />
                  {passwordForm.newPassword && passwordForm.confirmPassword && (
                    <span style={{
                      fontSize: '0.8rem',
                      color: passwordForm.newPassword === passwordForm.confirmPassword
                        ? 'var(--accent-success)' : 'var(--accent-danger)',
                    }}>
                      {passwordForm.newPassword === passwordForm.confirmPassword
                        ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </span>
                  )}
                </div>
              </div>

              {passwordMsg.text && (
                <div style={{
                  marginTop: '20px', padding: '12px 16px', borderRadius: '10px',
                  background: passwordMsg.type === 'success'
                    ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                  color: passwordMsg.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
                  border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  fontSize: '0.9rem',
                }}>
                  {passwordMsg.type === 'success' ? '✓ ' : '✕ '}{passwordMsg.text}
                </div>
              )}

              <button
                id="pwd-change-btn"
                type="submit"
                className="btn-primary-custom"
                disabled={passwordLoading}
                style={{ marginTop: '28px', width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
