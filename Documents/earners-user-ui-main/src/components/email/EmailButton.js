import React, { useState } from 'react';
import './EmailButton.css';
import { FaEnvelope, FaWhatsapp, FaTimes } from 'react-icons/fa';

const EmailButton = () => {
  const [showOptions, setShowOptions] = useState(false);

  const email = 'support.earnerswave@gmail.com';
  const subject = 'Inquiry from Website';
  const emailLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const whatsappLink = 'https://wa.me/918817477280';

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const closePopup = () => {
    setShowOptions(false);
  };

  return (
    <div className="email-button-container">
      <button className="email-button" onClick={toggleOptions}>
        <FaEnvelope className="email-icon" />
        Support
      </button>

      {showOptions && (
        <div className="support-popup">
          <button className="close-popup-btn" onClick={closePopup}>
            <FaTimes />
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="support-option whatsapp"
          >
            <FaWhatsapp className="popup-icon" />
            WhatsApp Support
          </a>

          <a href={emailLink} className="support-option email">
            <FaEnvelope className="popup-icon" />
            Email Support
          </a>
        </div>
      )}
    </div>
  );
};

export default EmailButton;
