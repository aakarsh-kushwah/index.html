import React from 'react';
import { Modal, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BuyProduct = ({ showBuyProduct, handleCloseBuyProduct }) => {
  const productImage = './gleam and glam.png'; // Replace with your actual product image URL
  const productDescription = "To become an active member, please purchase this product. Enjoy exclusive benefits and rewards by joining our community!";
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBuyNow = () => {
    // Navigate to /Buying-Product route
    navigate('/Buying-Product');
    handleCloseBuyProduct(); // Close the modal after navigating
  };

  return (
    <Modal show={showBuyProduct} onHide={handleCloseBuyProduct} centered>
      <Modal.Header closeButton>
        <Modal.Title>Buy Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3">
          <Card.Img 
            variant="top" 
            style={{ height: 'auto', width: '100%' }} 
            src={productImage} 
          />
          <Card.Body>
            <Card.Title>Exclusive Product</Card.Title>
            <Card.Text>
              {productDescription}
            </Card.Text>
            <Button variant="primary" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default BuyProduct;
