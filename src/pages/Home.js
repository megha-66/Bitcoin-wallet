import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import for navigation
import ReceiveBitcoin from './ReceiveBitcoin';  
import TransactionHistory from './TransactionHistory';  
import './styles.css';

function Home() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0.0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();  // Hook for navigation

  useEffect(() => {
    fetch("http://localhost:5000/create-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Wallet Data:", data);
        if (data.address) {
          setAddress(data.address);
          setBalance(data.balance || '0.0');  
        } else {
          throw new Error("Invalid response format");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err.message);
        setError(`Error fetching Bitcoin address: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => alert('Address copied to clipboard!'))
        .catch((err) => alert('Failed to copy address: ' + err));
    }
  };

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="card-header">Home</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="main-heading">Your Bitcoin Wallet</h1>

        {/* Receive Bitcoin Section */}
        <section className="receive-container">
          <h2>Receive Bitcoin</h2>
          <div className="address-container">
            <p><strong> Your Address:</strong> {address}</p>
            <button onClick={handleCopyAddress}>Copy Address</button>
          </div>
        </section>

        {/* Transaction History Section */}
        <section className="transaction-history">
          <h2 className = "th-heading"></h2>
          <TransactionHistory address={address} />
        </section>

        

      </div>
    </div>
  );
}

export default Home;
