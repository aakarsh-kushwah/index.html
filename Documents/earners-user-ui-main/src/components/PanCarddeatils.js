import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from 'react-icons/fa'; // Import icon
import "./PanCarddetails.css";

const PanCardUpdate = () => {
  const [panCardNumber, setPanCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePanCard = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePanCard(panCardNumber)) {
      setError("Invalid PAN card format. Please enter a valid PAN card number.");
      return;
    }

    setError("");
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.put(
        `${process.env.REACT_APP_PROTOCOL}/api/withdrawal/user-pan-card-update`,
        { panCardNumber, bank_name: bankName, account_number: accountNumber, IFSc_Code: ifscCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Details updated successfully!");
      navigate("/wallet");
    } catch (err) {
      setError("Failed to update details. Please try again.");
    }
  };

  return (
    <div className="finance-bg">
      <div className="finance-container">
        <h2 className="finance-title">Update Your Bank Details 🏦</h2>
        <div className="finance-disclaimer">
          <FaExclamationTriangle className="finance-icon-warn" />
          <p>
            <strong>Important:</strong> A valid PAN card is required for withdrawals over ₹13,000 to comply with tax regulations.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="finance-form">
          <div className="finance-form-group">
            <label htmlFor="panCardNumber">PAN Card Number <span className="finance-required">*</span></label>
            <input
              type="text"
              id="panCardNumber"
              value={panCardNumber}
              onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength="10"
              required
            />
          </div>

          <div className="finance-form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., State Bank of India"
            />
          </div>

          <div className="finance-form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Your bank account number"
            />
          </div>

          <div className="finance-form-group">
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g., SBIN0000001"
            />
          </div>
          
          {error && <p className="finance-message finance-error">{error}</p>}
          {message && <p className="finance-message finance-success">{message}</p>}

          <button type="submit" className="finance-submit-button">
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default PanCardUpdate;