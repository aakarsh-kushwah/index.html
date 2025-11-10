import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import './GleamGlam.css'; // नई CSS फ़ाइल का नाम

// Helper component for truncating text
const TruncatedText = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const shouldTruncate = text.length > maxLength;

    const displayedText = shouldTruncate && !isExpanded
        ? text.substring(0, maxLength) + '...'
        : text;

    return (
        <Card.Text>
            {displayedText}
            {shouldTruncate && (
                <span
                    className="gg-read-more-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? ' Read Less' : ' Read More'}
                </span>
            )}
        </Card.Text>
    );
};

const premiumKitProducts = [
    {
        image: './gleam and glam.png',
        alt: 'Combo Kit',
        title: 'Gleam & Glam Combo Kit',
        price: '₹1519/-',
        description: "Unlock your skin’s true radiance with this comprehensive kit that works synergistically for a flawless complexion. The potent Face Serum brightens and evens out skin tone while reducing dark spots. Paired with a gentle Face Wash that deeply cleanses and reveals natural radiance, the regimen is further enhanced by a lightweight, non-greasy Face Cream providing long-lasting hydration. An exfoliating Gel refines texture and minimizes pigmentation for a smoother appearance, while the non-sticky Body Lotion delivers quick-absorbing moisture, leaving your skin soft and glowing. Together, these products create a complete skincare solution for luminous, nourished, and rejuvenated skin every day."
    },
    {
        image: './faceserum.png',
        alt: 'Gleam & Glam Face Serum',
        title: 'Gleam & Glam Face Serum',
        price: '₹549/-',
        description: "Key Features: Gleam and Glam Serum is designed to brighten and even out your skin tone. This lightweight serum penetrates deeply to reduce dark spots and pigmentation, leaving your complexion radiant and flawless. It provides an instant glow while deeply nourishing the skin, making it perfect for daily use."
    },
    {
        image: './facewash.png',
        alt: 'Gleam & Glam Face Wash',
        title: 'Gleam & Glam Face Wash',
        price: '₹269/-',
        description: "Key Features: Experience brighter, clearer skin with this advanced face wash, designed to reveal your skin's true radiance. It gently exfoliates and removes impurities, promoting a fresh and luminous complexion. Discover the perfect addition to your skincare routine and bring this innovation home today!"
    },
    {
        image: './brighteningcream.png',
        alt: 'Gleam & Glam Face Cream',
        title: 'Gleam & Glam Face Cream',
        price: '₹245/-',
        description: "Key Features: Gleam and Glam Face Cream is a lightweight and non-greasy formula that is designed to enhance your skin's natural glow. this cream provides long-lasting hydration and helps maintain a healthy, dewy complexion. The gentle and fast-absorbing cream helps to nourish the skin without leaving a greasy residue. Ideal for daily use, it rejuvenates your skin, giving it a fresh and youthful appearance. perfect for daily skincare routines."
    },
    {
        image: './facegel.png',
        alt: 'Gleam & Glam Gel',
        title: 'Gleam & Glam Gel',
        price: '₹197/-',
        description: "Key Features:Experience a comprehensive skin transformation with Gleam and Glam Gel. This gel effectively addresses dark spots, pigmentation issues, and promotes an even skin tone for a brighter complexion. It gently sheds dead skin cells, encouraging cellular regeneration and unveiling a brighter, smoother complexion. This exfoliation process not only rejuvenates the skin's surface but also effectively reduces hyperpigmentation and fades dark spots, promoting a more even skin tone."
    },
    {
        image: './bodylotion.png',
        alt: 'Gleam & Glam Body Lotion',
        title: 'Gleam & Glam Body Loation',
        price: '₹259/-',
        description: "Key Features: Gleam and Glam glam Body Lotion is a lightweight, non-sticky, and quick-absorbing lotion that leaves your skin ready to glow. It’s the perfect combination for the Indian climate and suitable for all seasons."
    }
];

const GleamGlamProducts = ({ onImageClick, onBuyNowClick }) => {
    return (
        <div className="gg-kit-details" id="gleam-glam-products-section">
            <Row className="align-items-center justify-content-center mb-4 gg-kit-heading-row">
                <Col xs="auto">
                    <img src='./gleam&glame_logo.png' alt="Gleam & Glam Logo" className="gg-kit-section-logo-left" />
                </Col>
                <Col>
                    <h2>Gleam & Glam Products</h2>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {premiumKitProducts.map((product, index) => (
                    <Col md={4} sm={6} xs={12} className="mb-4" key={index}>
                        <Card className="gg-product-card">
                            <Card.Img
                                variant="top"
                                src={product.image}
                                onClick={() => onImageClick(product.image, product.alt)}
                                style={{ cursor: 'pointer' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Title className="gg-text-left-price">
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>{product.price}</span>
                                </Card.Title>
                                <TruncatedText text={product.description} maxLength={150} />
                                <Button variant="primary" onClick={onBuyNowClick} className="mt-3">
                                    Buy Now
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GleamGlamProducts;