import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function TransactionHistory({ address }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const fetchTransactionHistory = () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    fetch(`https://mempool.space/testnet4/api/address/${address}/txs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching transaction history');
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleButtonClick = () => {
    setShowHistory(true);
    fetchTransactionHistory();
  };

  return (
    <div className="container-trans">
      <div className="card-trans">
        <h1 className="card-header-trans">Transaction History</h1>

        {/* Show Transaction History Button */}
        {!showHistory ? (
          <button onClick={handleButtonClick} className="button-showhist">
            Show Transaction History
          </button>
        ) : (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : transactions.length === 0 ? (
              <p>No transactions found for this address.</p>
            ) : (
              <ul>
                {transactions.map((transaction) => (
                  <li key={transaction.txid}>
                    {transaction.status?.confirmed ? (
                      <span style={{ color: 'black' }}>Confirmed</span>
                    ) : (
                      <span style={{ color: 'black' }}>Pending</span>
                    )}
                    {' '} - {transaction.vin.length} Inputs, {transaction.vout.length} Outputs
                    {' '} - {transaction.fee / 100000000} BTC fee
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Send Money Button */}
        <div className="send-money-container">
          <button className="send-money-button" onClick={() => navigate('/send')}>
            Send Money
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
