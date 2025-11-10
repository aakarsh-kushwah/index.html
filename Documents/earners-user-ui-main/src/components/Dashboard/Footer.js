import React from 'react';
import './Footer.css';
import { FaFacebookF, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="app-main-footer">
            <div className="app-footer-content">
                <div className="footer-section-info company-details">
                    <h4>About Us</h4>
                    <p>
                        At Earnerswave, our core mission is to empower you with genuine earning opportunities on a secure and transparent platform. We are deeply committed to your financial independence, operating with unwavering integrity and ensuring every interaction is built on trust. Join our community where your hard work is valued, your data is protected, and your journey toward a brighter financial future is supported by a truly reliable partner.
                    </p>
                </div>

                <div className="footer-section-info policy-navigation">
                    <h4>Policies</h4>
                    <ul>
                        <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/About">About</a></li>
                    </ul>
                </div>

                <div className="footer-section-info social-media-links">
                    <h4>Follow Us</h4>
                    <div className="social-icon-wrapper">
                        <a href="https://www.facebook.com/share/1YAGhRxcsA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="https://wa.me/918817477280" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <FaWhatsapp />
                        </a>
                        <a href="https://www.instagram.com/earnerswave?igsh=MWd2NjE0YWR1aHFnZg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
            <div className="app-footer-copyright">
                <p>© {new Date().getFullYear()} Earners Wave. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
