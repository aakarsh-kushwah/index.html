import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import OrderHistory from "../components/orderHistory";
import ProductDetails from "../components/product/product";
import TransactionHistory from "../components/wallet/withdrwalHistory";

import UserAddressDetails from "../components/userAddress/userAddress";
import MembersData from "../components/members/membersTree";
import HelpDeskPage from "../components/helpdesk/helpdesk";
import UserLogin from "../components/login/login";
import UserSignup from "../components/signup/signup";
import UserPasswordUpdate from "../components/userUpdate/userPasswordUpdate";
import HomePage from "../components/home/home";
import Dashboard from "../components/Dashboard/dashboard";
import TermsAndConditions from "../components/Terms&Conditions/TermsAndConditions";
import PrivacyPolicy from "../components/privacyPolicy/PrivacyPolicy";
import PaymentVerifiedPage from "../components/Razorpay/PaymentVerifiedPage";
import EmailButton from "../components/email/EmailButton";
import PanCardUpdate from "../components/PanCarddeatils";
import About from "../components/Dashboard/About";

import BusinessPlan from "../components/BusinessPlan";
import AIChatbot from "../components/arsha_ai/AIChatbot";

const Approute = () => {
  const location = useLocation();

  // Define the routes where the EmailButton should appear
  const routesWithEmailButton = [
    "/home",
  
  ];

  // Check if the current path is in the list
  const showEmailButton = routesWithEmailButton.includes(location.pathname);

  return (
    <>
      {showEmailButton && <EmailButton />}
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/home" element={<HomePage />} />
        <Route exact path="/signup" element={<UserSignup />} />
        <Route exact path="/login" element={<UserLogin />} />
        <Route exact path="/user-password-update" element={<UserPasswordUpdate />} />
        <Route exact path="/members-data" element={<MembersData />} />
        <Route exact path="/order-history" element={<OrderHistory />} />
        <Route exact path="/product" element={<ProductDetails />} />
        <Route exact path="/wallet" element={<TransactionHistory />} />
        
        <Route exact path="/buying-product" element={<UserAddressDetails />} />
        <Route exact path="/help" element={<HelpDeskPage />} />
        <Route exact path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route exact path="/payment-verify-page" element={<PaymentVerifiedPage />} />
        <Route exact path="/bank-details" element={<PanCardUpdate />} />
        
        <Route exact path="/About" element={<About/>} />
        <Route exact path="/business-plan" element={<BusinessPlan/>} />
        <Route exact path="/ai-chat" element={<AIChatbot/>} />
        
      </Routes>
    </>
  );
};

export default () => (
  <Router>
    <Approute />
  </Router>
);
