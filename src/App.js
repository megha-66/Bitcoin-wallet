import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SendBitcoin from './pages/SendBitcoin';
import ReceiveBitcoin from './pages/ReceiveBitcoin';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendBitcoin />} />
          <Route path="/receive" element={<ReceiveBitcoin />} />
          <Route path="/history" element={<TransactionHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

