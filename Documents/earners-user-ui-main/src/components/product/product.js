// product.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Carousel } from 'react-bootstrap'; // Carousel is already here

import './product.css';

function ProductDetails() {
    const [showDescription, setShowDescription] = useState(false);
    const navigate = useNavigate();

    const product = {
        id: 1,
        name: 'Gleam & Glam product kit',
        price: 1519,
        discount: 100,
        finalPrice: 1519,
        // CHANGED: imageUrl is now an array of image paths for the carousel
        imageUrls: [
            './gleam and glam.png',
            './arsha_with_cream.png',       
            './arsha_with_facewash.png',
            './arsha_with_lotion.png',
            './arsha_with_gel.png',
            './arsha_with_serum.png'
        ],
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const handleBuyNow = () => {
        navigate('/Buying-Product', { state: { product } });
    };

    return (
        <Container className="unique-product-container">
            {/* Gleam & Glam Product Details Section */}
            <h1 className="unique-product-title">Product Details</h1>
            <Card key={product.id} className="unique-product-card">
                <Card.Body className="unique-product-body">
                    <div className="unique-product-image-wrapper">
                        {/* UPDATED: Replaced single image with a Carousel */}
                        <Carousel interval={3000}>
                            {product.imageUrls.map((imgUrl, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100 unique-product-image"
                                        src={imgUrl}
                                        alt={`Product slide ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                    <div className="unique-product-content">
                        <h6 className="unique-product-name">{product.name}</h6>
                        <h2 className="unique-product-price">
                            ₹{product.finalPrice}{'/-'}
                        </h2>
                        <Button className="unique-buy-button" onClick={handleBuyNow}>
                            Buy Now
                        </Button>
                        <h4 className="unique-product-details-heading">Product Details</h4>
                        <div
                            onClick={toggleDescription}
                            className="unique-product-description-toggle"
                        >
                            DESCRIPTION
                            <p className="unique-product-description-text">
                                Time to reveal the authentic charm! Now, you can unleash the real softness
                                and beauty of your skin...
                                <span className="unique-product-click-here"> Click here</span>
                            </p>
                        </div>

                        {showDescription && (
                            <>
                                <div className="unique-product-description-content">
                                    {/* Face Serum */}
                                    <div className="product-section">
                                        <h4>Face Serum</h4>
                                        <strong>Key Features:</strong>
                                        <p>
                                            Gleam and Glam Serum is designed to brighten and even out your skin tone.
                                            This lightweight serum penetrates deeply to reduce dark spots and pigmentation,
                                            leaving your complexion radiant and flawless. It provides an instant glow while
                                            deeply nourishing the skin, making it perfect for daily use.
                                        </p>
                                        <strong>Direction of use:</strong>
                                        <p>
                                            Take a few drops of serum on your fingertips, apply dots on your face and neck.
                                            Gently massage in a circular motion until completely absorbed.
                                            Use AM & PM for best results.
                                        </p>
                                    </div>
                                    <br />

                                    {/* Face Wash */}
                                    <div className="product-section">
                                        <h4>Face Wash</h4>
                                        <strong>Key Features:</strong>
                                        <p>
                                            Experience brighter, clearer skin with this advanced face wash, designed to reveal
                                            your skin's true radiance. It gently exfoliates and removes impurities, promoting a
                                            fresh and luminous complexion.
                                        </p>
                                        <strong>Direction of use:</strong>
                                        <p>
                                            Apply a small amount on wet face and gently massage in a circular motion,
                                            concentrating on your forehead, nose, and chin. Rinse off with water and pat dry.
                                            Avoid direct contact with eyes. Use twice a day for best results.
                                        </p>
                                    </div>
                                    <br />

                                    {/* Face Cream */}
                                    <div className="product-section">
                                        <h4>Face Cream</h4>
                                        <strong>Key Features:</strong>
                                        <p>
                                            Gleam and Glam Face Cream is a lightweight, non-greasy formula designed to enhance your skin's natural glow.
                                            It provides long-lasting hydration and helps maintain a healthy, dewy complexion.
                                            The fast-absorbing cream nourishes the skin without leaving a greasy residue, ideal for daily use.
                                        </p>
                                        <strong>Direction of use:</strong>
                                        <p>
                                            Take an adequate amount of cream onto your palm. Apply evenly on your face & neck and
                                            gently massage with your fingertips until completely absorbed.
                                        </p>
                                    </div>
                                    <br />

                                    {/* Gel */}
                                    <div className="product-section">
                                        <h4>Gel</h4>
                                        <strong>Key Features:</strong>
                                        <p>
                                            Experience a comprehensive skin transformation with Gleam and Glam Gel.
                                            This gel effectively addresses dark spots, pigmentation issues, and promotes an even skin tone
                                            for a brighter complexion. It gently exfoliates to encourage cellular regeneration.
                                        </p>
                                        <strong>Direction of use:</strong>
                                        <p>
                                            Apply a small amount of gel on clean skin and gently massage until fully absorbed.
                                            Use as directed, preferably once daily, for best results.
                                        </p>
                                    </div>
                                    <br />

                                    {/* Body Lotion */}
                                    <div className="product-section">
                                        <h4>Body Lotion</h4>
                                        <strong>Key Features:</strong>
                                        <p>
                                            Gleam and Glam Body Lotion is a lightweight, non-sticky, and quick-absorbing lotion
                                            that leaves your skin ready to glow. It’s perfectly suited for the Indian climate and all seasons.
                                        </p>
                                        <strong>Direction of use:</strong>
                                        <p>
                                            Apply generously to clean, dry skin and massage until fully absorbed,
                                            ensuring all-day hydration.
                                        </p>
                                    </div>
                                </div>

                                {/* Kit Contents Carousel */}
                                <div>
                                    <br />
                                    <h3 className='kitproducts'>The kit contains the following products</h3>
                                    <Carousel className="unique-product-carousel">
                                        <Carousel.Item>
                                            <img
                                                alt='face wash'
                                                className="d-block w-100"
                                                src="facewash.png"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img
                                                alt='face cream'
                                                className="d-block w-100"
                                                src="./brighteningcream.png"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img
                                                alt='serum'
                                                className="d-block w-100"
                                                src="./faceserum.png"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img
                                                alt='gel'
                                                className="d-block w-100"
                                                src="./facegel.png"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img
                                                alt='body lotion'
                                                className="d-block w-100"
                                                src="./bodylotion.png"
                                            />
                                        </Carousel.Item>
                                    </Carousel>
                                </div>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* --- Separator --- */}
            <hr className="my-5" />

     
        </Container>
    );
}

export default ProductDetails;