import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PaymentVerifiedPage from "./PaymentVerifiedPage";
import "./RazorpayPayment.css";

const RazorpayPayment = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile from localStorage
  useEffect(() => {
    const userProfileData = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfileData) {
      setUserProfile(userProfileData);
    }
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      // Step 1: Create order
      const { data: orderData } = await axios.post(
        `${process.env.REACT_APP_PROTOCOL}/api/order/new-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if order creation failed
      if (!orderData?.data?.razorpay_order_id) {
        const errorMessage = orderData?.message || "Order creation failed. Please try again.";
        alert(errorMessage);
        return;
      }
  
      // Step 2: Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.data.total_amount * 100, // Amount in paise
        currency: "INR",
        name: "earnerswave",
        description: "Product Purchase",
        order_id: orderData.data.razorpay_order_id,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${process.env.REACT_APP_PROTOCOL}/api/order/payment-verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            if (verificationResponse.data.status) {
              const paymentData = {
                transactionId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              };
              setPaymentDetails(paymentData);
              setIsVerified(true);
  
              const parent_id = localStorage.getItem("parent_id");
              const sponsor_id = localStorage.getItem("sponsor_id");
              const unique_id = userProfile?.unique_id;
  
              await axios.post(
                `${process.env.REACT_APP_PROTOCOL}/api/distribution/updatestatus`,
                { parent_id, sponsor_id, unique_id },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
  
              navigate("/payment-verify-page");
            } else {
              alert("Payment verification failed.");
            }
          } catch (verificationError) {
            console.error("Verification Error: ", verificationError);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userProfile?.first_name || "John Doe",
          email: userProfile?.email || "john.doe@example.com",
          contact: userProfile?.phone_number || "9876543210",
        },
        theme: {
          color: "#F37254",
        },
      };
  
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
  
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed: ", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error("Error in payment flow: ", error);
      // Extract the backend error message if available
      const backendMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";
      alert(backendMessage); // Show error in an alert
    }
  };
  

  if (isVerified && paymentDetails.transactionId) {
    return <PaymentVerifiedPage paymentDetails={paymentDetails} />;
  }

  return (
    <div>
      <Button
        variant="primary"
        onClick={handlePayment}
        className="razorpay-button-custom"
      >
        Proceed to Pay
      </Button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RazorpayPayment;
