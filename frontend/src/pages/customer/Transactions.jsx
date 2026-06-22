import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  
  const [txData, setTxData] = useState({
    type: 'DEPOSIT',
    amount: '',
    remarks: '',
    destinationAccountNumber: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const custRes = await api.get(`/customers/user/${user.id}`);
        const accRes = await api.get(`/accounts/customer/${custRes.data.id}`);
        setAccounts(accRes.data);
        if (accRes.data.length > 0) {
          setSelectedAccount(accRes.data[0].accountNumber);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    if (selectedAccount) {
      fetchHistory(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchHistory = async (accNum) => {
    try {
      const res = await api.get(`/transactions/history/${accNum}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTxChange = (e) => {
    setTxData({ ...txData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      let endpoint = '';
      let payload = { amount: parseFloat(txData.amount), remarks: txData.remarks };

      if (txData.type === 'DEPOSIT') {
        endpoint = '/transactions/deposit';
        payload.destinationAccountNumber = selectedAccount;
      } else if (txData.type === 'WITHDRAW') {
        endpoint = '/transactions/withdraw';
        payload.sourceAccountNumber = selectedAccount;
      } else if (txData.type === 'TRANSFER') {
        endpoint = '/transactions/transfer';
        payload.sourceAccountNumber = selectedAccount;
        payload.destinationAccountNumber = txData.destinationAccountNumber;
      }

      await api.post(endpoint, payload);
      setMessage(`${txData.type} successful!`);
      fetchHistory(selectedAccount);
      setTxData({ ...txData, amount: '', remarks: '', destinationAccountNumber: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Transaction failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-light">Transactions</h2>
      
      <div className="row g-4">
        {/* Transaction Form */}
        <div className="col-lg-5">
          <div className="glass-card">
            <h4 className="mb-3">Perform Transaction</h4>
            
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-secondary">Select Account</label>
                <select 
                  className="input-custom form-select" 
                  value={selectedAccount} 
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} - {acc.accountType} (${acc.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-secondary">Transaction Type</label>
                <select className="input-custom form-select" name="type" value={txData.type} onChange={handleTxChange}>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAW">Withdraw</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              {txData.type === 'TRANSFER' && (
                <div className="mb-3">
                  <label className="text-secondary">Destination Account Number</label>
                  <input type="text" className="input-custom" name="destinationAccountNumber" value={txData.destinationAccountNumber} onChange={handleTxChange} required />
                </div>
              )}

              <div className="mb-3">
                <label className="text-secondary">Amount ($)</label>
                <input type="number" step="0.01" min="0.01" className="input-custom" name="amount" value={txData.amount} onChange={handleTxChange} required />
              </div>

              <div className="mb-4">
                <label className="text-secondary">Remarks</label>
                <input type="text" className="input-custom" name="remarks" value={txData.remarks} onChange={handleTxChange} />
              </div>

              <button type="submit" className="btn-primary-custom w-100">Submit Transaction</button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="col-lg-7">
          <div className="glass-card" style={{ height: '100%', overflowY: 'auto', maxHeight: '600px' }}>
            <h4 className="mb-3">Recent History</h4>
            {history.length === 0 ? (
              <p className="text-secondary">No transactions found for this account.</p>
            ) : (
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                      <td>
                        <span className={`badge-custom ${tx.transactionType === 'DEPOSIT' || (tx.transactionType === 'TRANSFER' && tx.destinationAccount?.accountNumber === selectedAccount) ? 'badge-success' : 'badge-danger'}`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className={tx.transactionType === 'DEPOSIT' || (tx.transactionType === 'TRANSFER' && tx.destinationAccount?.accountNumber === selectedAccount) ? 'success fw-bold' : 'danger fw-bold'}>
                        {tx.transactionType === 'DEPOSIT' || (tx.transactionType === 'TRANSFER' && tx.destinationAccount?.accountNumber === selectedAccount) ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                      <td className="text-secondary">{tx.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
