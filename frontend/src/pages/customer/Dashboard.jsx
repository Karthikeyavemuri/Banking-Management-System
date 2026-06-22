import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const custRes = await api.get(`/customers/user/${user.id}`);
      setCustomer(custRes.data);
      
      const accRes = await api.get(`/accounts/customer/${custRes.data.id}`);
      setAccounts(accRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleOpenAccount = async (type) => {
    try {
      await api.post('/accounts', { customerId: customer.id, accountType: type });
      fetchData(); // refresh accounts
    } catch (error) {
      alert("Failed to open account. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-5 text-light">Loading Dashboard...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ fontWeight: 700 }}>Overview</h2>
      
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card stat-card">
            <span className="stat-title">Total Accounts</span>
            <span className="stat-value text-light">{accounts.length}</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card stat-card">
            <span className="stat-title">Total Balance</span>
            <span className="stat-value success">
              ${accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Accounts</h3>
        {customer && (
          <div>
            <button onClick={() => handleOpenAccount('SAVINGS')} className="btn-primary-custom me-2" style={{ padding: '8px 16px', fontSize: '14px' }}>Open Savings Account</button>
            <button onClick={() => handleOpenAccount('CURRENT')} className="btn-primary-custom" style={{ padding: '8px 16px', fontSize: '14px', background: '#3b82f6' }}>Open Current Account</button>
          </div>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="glass-card text-center p-5">
          <p className="text-secondary mb-3">You don't have any accounts yet. Open one to get started!</p>
        </div>
      ) : (
        <div className="row g-4">
          {accounts.map(acc => (
            <div key={acc.id} className="col-md-6 col-lg-4">
              <div className="glass-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-secondary fw-bold">{acc.accountType}</span>
                  <span className={`badge-custom ${acc.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    {acc.status}
                  </span>
                </div>
                <h4 className="text-light mb-1">{acc.accountNumber}</h4>
                <h2 className="success mb-0">${parseFloat(acc.balance).toFixed(2)}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
