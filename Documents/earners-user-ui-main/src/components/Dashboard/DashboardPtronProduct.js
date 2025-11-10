import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DashboardPtronProduct.css';

function PtronProduct() {
    const navigate = useNavigate();

    const earbudColors = [
        {
            name: 'Gray',
            hex: '#5e5c5cff',
            imageUrl: `${process.env.PUBLIC_URL}/greyearbud.avif`
        },
        {
            name: 'Black',
            hex: '#000000',
            imageUrl: `${process.env.PUBLIC_URL}/blackearbud.webp`
        },
        {
            name: 'Blue',
            hex: '#add8e6',
            imageUrl: `${process.env.PUBLIC_URL}/lightblueearbud.webp`
        },
        {
            name: 'Navy',
            hex: '#1f1f3fff',
            imageUrl: `${process.env.PUBLIC_URL}/blueearbud.avif`
        },
        {
            name: 'Green',
            hex: '#006400',
            imageUrl: `${process.env.PUBLIC_URL}/greenearbud.webp`
        }
    ];

    const productFeatures = [
        {
            title: 'QuadPro Mics with TruTalk™ ENC',
            description: 'Enjoy **crystal-clear voice calls** with 4 high-definition microphones (2 per earbud) and advanced AI Environmental Noise Cancellation (ENC) that filters out background noise for an uninterrupted calling experience.',
            icon: 'fas fa-microphone-alt'
        },
        {
            title: 'Immersive 3D AudioScape',
            description: 'Feel the depth of every beat with **13mm dynamic drivers**, delivering powerful bass, rich mids, and crisp highs for a truly immersive listening experience.',
            icon: 'fas fa-headphones-alt'
        },
        {
            title: '40 Hours Playtime & Type-C Fast Charging',
            description: 'Stay powered up with an extended **40-hour battery life**, including the compact charging case. The Type-C fast charging ensures you’re never out of juice for long.',
            icon: 'fas fa-battery-full'
        },
        {
            title: '50ms Ultra-Low Latency Modes',
            description: 'Switch effortlessly between **ultra-low latency gaming mode** for real-time sound sync and music mode for a balanced, high-fidelity audio experience.',
            icon: 'fas fa-gamepad'
        },
        {
            title: 'Bluetooth v5.3 Seamless Connectivity',
            description: 'Enjoy **faster pairing, stable connections**, and wide compatibility with smartphones, tablets, and laptops.',
            icon: 'fas fa-bluetooth-b'
        },
        {
            title: 'Lightweight, Secure-Fit & IPX5 Water Resistance',
            description: 'Designed for comfort, the **ergonomic fit with passive noise isolation** ensures all-day wearability, while the **IPX5 rating** protects against sweat and splashes.',
            icon: 'fas fa-tint'
        },
        {
            title: 'Smart Controls & Voice Assistant',
            description: 'Manage calls, adjust music, and activate voice assistants with just a touch.',
            icon: 'fas fa-hand-pointer'
        }
    ];

    const [currentEarbud, setCurrentEarbud] = useState(earbudColors[0]);
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);

    useEffect(() => {
        setCurrentEarbud(earbudColors[0]);
    }, []);

    const handleBuyNowClick = () => {
        setShowBuyNowModal(true);
    };

    const handleCloseBuyNowModalAndNavigate = () => {
        setShowBuyNowModal(false);
        navigate('/signup');
    };

    const handleCloseBuyNowModal = () => {
        setShowBuyNowModal(false);
    };

    return (
        <div className="ptron-product-page">
            <div className="hero-video-container">
                <video autoPlay loop muted playsInline className="hero-video">
                    <source src={`${process.env.PUBLIC_URL}/ptronvideo.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <Container fluid className="product-content-section">
                <Row className="justify-content-center product-details-row">
                    <Col lg={5} md={6} className="product-image-col">
                        <div className="earbud-image-box">
                            <img
                                src={currentEarbud.imageUrl}
                                alt={`${currentEarbud.name} Ptron Earbuds`}
                                className="img-fluid earbud-main-image"
                            />
                        </div>
                        <div className="color-options-container mt-4">
                            <span className="color-label">Color: {currentEarbud.name}</span>
                            <div className="color-swatches">
                                {earbudColors.map((color) => (
                                    <div
                                        key={color.name}
                                        className={`color-swatch ${currentEarbud.name === color.name ? 'active' : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => setCurrentEarbud(color)}
                                        title={color.name}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} md={6} className="product-details-col">
                        <h1 className="product-title">pTron Bassbuds Bliss</h1>
                        <p className="product-tagline">Ultimate Sound, Seamless Calls & All-Day Battery.</p>

                        <div className="product-price-section">
                            <span className="current-price">₹2199</span>
                            <span className="original-price">M.R.P: <del>₹2800</del></span>
                            <span className="discount-info">21% Off</span>
                        </div>

                        <Button variant="primary" className="buy-now-button mt-4" onClick={handleBuyNowClick}>
                            <i className="fas fa-bolt me-2"></i> Buy Now
                        </Button>
                    </Col>
                </Row>

                <Row className="justify-content-center features-section mt-5">
                    <Col lg={10} md={12}>
                        <h2 className="section-title text-center mb-4">Key Features</h2>
                        <Row className="g-4">
                            {productFeatures.map((feature, index) => (
                                <Col md={6} lg={4} key={index}>
                                    <Card className="feature-card">
                                        <Card.Body>
                                            <div className="feature-icon-wrapper">
                                                <i className={`${feature.icon} feature-icon`}></i>
                                            </div>
                                            <Card.Title className="feature-title">{feature.title}</Card.Title>
                                            <Card.Text dangerouslySetInnerHTML={{ __html: feature.description }} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                <Row className="justify-content-center additional-info-section mt-5">
                    <Col lg={10} md={12}>
                        <h2 className="section-title text-center mb-4">Additional Information</h2>
                        <Card className="info-card">
                            <Card.Body>
                                <p className="info-text">
                                    <i className="fas fa-info-circle me-2"></i> **Warranty:** 1-year warranty from the date of purchase on manufacturing defects only.
                                </p>
                                <p className="info-text">
                                    <i className="fas fa-palette me-2"></i> **Note:** Product color may vary slightly due to images' lighting effects.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Buy Now Message Modal */}
            <Modal show={showBuyNowModal} onHide={handleCloseBuyNowModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ready to purchase?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>To buy this amazing product and unlock exclusive benefits, please **sign up** first!</p>
                    <p>By joining our community, you can:</p>
                    <ul>
                        <li>Access exclusive deals and offers.</li>
                        <li>Easily track your orders.</li>
                        <li>Participate in our exciting earners program!</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseBuyNowModalAndNavigate}>
                        Sign Up Now!
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCloseBuyNowModal}>
                        Maybe Later
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PtronProduct;