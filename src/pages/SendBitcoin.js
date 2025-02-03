import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sendstyles.css';
import axios from 'axios';

function SendBitcoin({ balance = "0.0" }) {  // Default balance if not provided
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidBitcoinAddress = (address) => {
    const regex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return regex.test(address);
  };

  const handleSendBitcoin = (e) => {
    e.preventDefault();

    if (!isValidBitcoinAddress(address)) {
      setError('Invalid Bitcoin address');
      return;
    }

    if (isNaN(amount) || amount <= 0 || parseFloat(amount) > parseFloat(balance)) {
      setError('Please enter a valid amount within balance limit');
      return;
    }

    setError('');
    alert(`Transaction sent to ${address} with amount ${amount} BTC`);

    axios.post('http://localhost:5000/send-bitcoin', { address, amount })
      .then(response => {
        alert(`Transaction successful! TxID: ${response.data.txid}`);
        navigate('/');
      })
      .catch(err => {
        alert('Transaction failed: ' + err.message);
      });
  };

  return (
    <>
      {/* Page Title */}
      <h1 className="page-title">Send Bitcoin</h1>

      {/* Form Container */}
      <div className="send-container">
        <div className="current-balance">
          <h3>Balance: {balance} BTC</h3>
        </div>

        <div className="send-input-group">
          <label>Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter recipient address"
            className="amt-input-box"
          />
        </div>

        <div className="send-input-group">
          <label>Amount (in BTC)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="amt-input-box"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button onClick={handleSendBitcoin} className="send-button">
          Send Bitcoin
        </button>
      </div>

      {/* Back to Home Button */}
      <button className="back-button" onClick={() => navigate('/')}>⬅ Back to Home</button>
    </>
  );
}

export default SendBitcoin;
