import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { Testimonials, Achievements } from './DashboardEnhancements';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import './DashboardEnhancements.css';
import HeaderDashboard from './Headerdashboard';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import BrandsSection from './BrandsSection';
import GleamGlamVideoCarousel from './GleamGlamVideoCarousel';
import GleamGlamProducts from './GleamGlamProducts';

function Dashboard() {
    const navigate = useNavigate();
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const [modalImageAlt, setModalImageAlt] = useState('');
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);
    
    // --- Arsha icon se jude hue states aur useEffect yahan se hata diye gaye hain ---

    const handleImageClick = useCallback((src, alt) => {
        setModalImageSrc(src);
        setModalImageAlt(alt);
        setShowImageModal(true);
    }, []);

    const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);

    const handleBuyNowClick = useCallback(() => {
        setShowBuyNowModal(true);
    }, []);

    const handleCloseBuyNowModal = useCallback(() => {
        setShowBuyNowModal(false);
        navigate('/signup');
    }, [navigate]);

    const scrollToKitSection = useCallback(() => {
        const kitSection = document.getElementById('gleam-glam-products-section');
        if (kitSection) {
            kitSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // --- handleChatbotClick function yahan se hata diya gaya hai ---

    return (
        <>
            <HeaderDashboard />
            <Container fluid className="dashboard-container">
                <div className="hero-section mb-4">
                    <div className="hero-content text-center">
                        <img src='./earnersWaveLogo.png' alt="Company Logo" className="company-logo" />
                        <p>Your journey to premium quality starts here!</p>
                    </div>
                </div>
                <BrandsSection navigate={navigate} scrollToKitSection={scrollToKitSection} />
                <GleamGlamProducts onImageClick={handleImageClick} onBuyNowClick={handleBuyNowClick} />
                <GleamGlamVideoCarousel />
                <div className="mlm-overview text-center mb-4">
                    <h2 className="mlm-title">Unlock Your Potential with Our Earners Program</h2>
                    <p className="mlm-description">Shop, Sell, Succeed: Turn Every Purchase into Profit</p>
                    <Row>
                        <Col md={4} className="mb-4">
                            <i className="mlm-benefit-icon fas fa-users"></i>
                            <h4>Build Your Team</h4>
                            <p>Invite friends and family to join, and watch your team grow!</p>
                        </Col>
                        <Col md={4} className="mb-4">
                            <i className="mlm-benefit-icon fas fa-coins"></i>
                            <h4>Earn Commission</h4>
                            <p>Receive commissions for every sale made by your referrals.</p>
                        </Col>
                        <Col md={4} className="mb-4">
                            <i className="mlm-benefit-icon fas fa-trophy"></i>
                            <h4>Achieve Rewards</h4>
                            <p>Unlock exclusive bonuses and rewards as you hit milestones.</p>
                        </Col>
                    </Row>
                    <Button variant="success" className="get-started-button" href='/signup'>Get Started</Button>
                </div>
                <div className="income-structure text-center mb-4">
                    <h2>Your Income Structure</h2>
                    <p>Explore how our structured income program can enhance your earnings!</p>
                    <Row>
                        <Col md={6} className="income-level">
                            <h4>Level 1: Direct Referrals</h4>
                            <p>Earn a bonus for each direct referral.</p>
                        </Col>
                        <Col md={6} className="income-level">
                            <h4>Level 2: Team Earnings</h4>
                            <p>Receive a percentage from team members' sales.</p>
                        </Col>
                    </Row>
                    <Button variant="info" className="learn-more-button" href='/signup'>Learn More</Button>
                </div>
                <Testimonials />
                <Achievements />
            </Container>
            <Footer />

            {/* --- Arsha AI Floating Icon ka poora section yahan se hata diya gaya hai --- */}

            <Modal show={showImageModal} onHide={handleCloseImageModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalImageAlt}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img src={modalImageSrc} alt={modalImageAlt} style={{ maxWidth: '100%', height: 'auto' }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImageModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showBuyNowModal} onHide={() => setShowBuyNowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ready to purchase?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>To buy this product and unlock exclusive benefits, please sign up first!</p>
                    <p>Joining our community allows you to:</p>
                    <ul>
                        <li>Access exclusive deals and offers.</li>
                        <li>Track your orders easily.</li>
                        <li>Participate in our exciting earners program!</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBuyNowModal}>
                        Sign Up Now!
                    </Button>
                    <Button variant="outline-primary" onClick={() => setShowBuyNowModal(false)}>
                        Maybe Later
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dashboard;