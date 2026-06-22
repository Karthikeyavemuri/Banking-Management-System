import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await api.get('/customers');
        setCustomers(custRes.data);
        
        const accRes = await api.get('/accounts');
        setAccounts(accRes.data);

        const txRes = await api.get('/transactions');
        setTransactions(txRes.data);
      } catch (err) {
        console.error("Admin fetch error", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-light">Admin Dashboard</h2>
      
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card stat-card text-center">
            <span className="stat-title">Total Customers</span>
            <span className="stat-value text-primary">{customers.length}</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card stat-card text-center">
            <span className="stat-title">Total Accounts</span>
            <span className="stat-value text-info">{accounts.length}</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card stat-card text-center">
            <span className="stat-title">System Liquidity</span>
            <span className="stat-value success">
              ${accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="glass-card">
            <h4 className="mb-3">Recent System Transactions</h4>
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Source Acc</th>
                    <th>Dest Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map(tx => (
                    <tr key={tx.id}>
                      <td>#{tx.id}</td>
                      <td>
                         <span className={`badge-custom ${tx.transactionType === 'DEPOSIT' ? 'badge-success' : tx.transactionType === 'WITHDRAWAL' ? 'badge-danger' : 'badge-primary'}`} style={{background: tx.transactionType==='TRANSFER'?'rgba(59,130,246,0.2)':'', color: tx.transactionType==='TRANSFER'?'#60a5fa':''}}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td>${tx.amount.toFixed(2)}</td>
                      <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                      <td>{tx.sourceAccount ? tx.sourceAccount.accountNumber : '-'}</td>
                      <td>{tx.destinationAccount ? tx.destinationAccount.accountNumber : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
