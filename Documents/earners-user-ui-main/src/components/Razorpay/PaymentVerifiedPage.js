import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentVerifiedPage.css"; // Import the unique CSS file

const PaymentVerifiedPage = () => {
  const navigate = useNavigate();

  const handleDoneClick = () => {
    navigate("/home"); // Navigate to the Home route
  };

  return (
    <div className="payment-verified-container-custom">
      <div className="payment-card-custom">
        <div className="icon-container-custom">
          <i className="right-arrow-icon-custom">✔</i>
        </div>
        <h2 className="verified-title-custom">Payment Verified!</h2>
        <p className="verified-message-custom">
          Your payment has been successfully processed.
        </p>
        <button onClick={handleDoneClick} className="done-button-custom">
          Done
        </button>
      </div>
    </div>
  );
};

export default PaymentVerifiedPage;
