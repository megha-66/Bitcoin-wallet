import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import './styles.css'; // Assuming you’ll add the styles here

function ReceiveBitcoin() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch a new address from the backend
    axios.get(`http://localhost:5000/api/address/${address}`)
      .then(response => {
        setAddress(response.data.address);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch address');
        setLoading(false);
      });
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="receive-container">
      <h1>Receive Bitcoin</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="address-container">
          <p>Send Bitcoin to this address:</p>
          <div className="address-box">
            <p>{address}</p>
            <button onClick={handleCopyAddress} className="copy-button">
              Copy Address
            </button>
          </div>
          <QRCode value={address} />
        </div>
      )}
    </div>
  );
}

export default ReceiveBitcoin;

