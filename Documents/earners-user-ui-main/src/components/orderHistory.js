import React, { useEffect, useState } from 'react';
import { Container, Card, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './orderHistory.css';
import Header from './navbar/header';

const Orderhistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store the selected order ID
  const [selectedReason, setSelectedReason] = useState(''); // Store selected reason (initially empty)
  const [validationError, setValidationError] = useState(''); // State to handle validation error

  // Function to fetch order details
  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage or your preferred storage
      const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/order/user-order-detail`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setOrderHistory(response.data.data); // Set order history data
    } catch (err) {
      setError('Failed to fetch order history.'); // Set error message
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle order cancellation
  const cancelOrder = async () => {
    if (!selectedReason) {
      setValidationError('Please select a reason from the options below.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_PROTOCOL}/api/order/cancel-order-request`,
        {
          order_id: selectedOrderId, // Include the selected order ID
          cancellation_reason: selectedReason, // Send the reason as cancellation_reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      setShowModal(false); // Close the modal after submission
      fetchOrderDetails(); // Refetch orders to update the UI
    } catch (err) {
      alert('Failed to cancel order');
      console.error(err);
    }
  };

  // Fetch order details when the component mounts
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading state

  return (
    <>
      <Header />
      <Container className="mt-4 containerhistory">
        <h1>Order History</h1>
        {error && <p className="text-danger">{error}</p>} {/* Show error if any */}
        {orderHistory.length > 0 ? (
          orderHistory.map(order => (
            <Card key={order.id} className="my-3">
              <Card.Body className="cardhistory">
                <Card.Title className="card-title-history">Order ID: {order.id}</Card.Title>
                <Card.Img variant="top" src="gleam and glam.png" alt="kit" className="ordered-product-image" />
                <Card.Text className="card-text-history">Status: {order.status}</Card.Text>
                <Card.Text className="card-text-history">
                  payment_status:
                  <span className={order.payment_status === 'paid' ? 'text-success' : 'text-danger'}>
                    {order.payment_status}
                  </span>
                </Card.Text>

                <Card.Text className="card-text-history">Product: kit</Card.Text>
                <Card.Text className="card-text-history">
                  Delivery Address: {order.userAddress.shipping_address}, {order.userAddress.city},{' '}
                  {order.userAddress.state}, {order.userAddress.country}, {order.userAddress.postal_Code}
                </Card.Text>
                <Card.Text className="card-text-history">Order Date: {new Date(order.createdAt).toLocaleString()}</Card.Text>
                <Card.Text className="card-text-history">Expected Delivery: within 7 days</Card.Text>
                <Card.Text className="card-text-history">Total Price: INR {order.total_amount}</Card.Text>
                <Button variant="danger" onClick={() => { setShowModal(true); setSelectedOrderId(order.id); }}>
                  Order helpdesk
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No order history available</p>
        )}
      </Container>

      {/* Modal for cancellation reason */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order helpdesk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reason">
              <Form.Label>Select Reason</Form.Label>
              <Form.Control
                as="select"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                placeholder="Select any below Reason"
              >
                <option value="">Select a reason...</option> {/* Empty option as default */}
                <option value="Product Issue">Product damaged or improperly packaged during delivery</option>
                <option value="Product Issue">Received wrong product (different from what was ordered)</option>
                <option value="Product Issue">Product quality is not as expected</option>
                <option value="Product Issue">Product malfunction or does not work as described</option>
                <option value="Product Issue">Missing accessories or parts in the product package</option>
                <option value="Cancel Order">Change of mind, wish to cancel the order</option>
                <option value="Cancel Order">Order placed by mistake, requesting cancellation</option>
                <option value="Other Help">Request for assistance with payment issues</option>
                <option value="Other Help">Need clarification on shipping or delivery details</option>
                <option value="Other Help">Requesting a refund or return process assistance</option>
              </Form.Control>
            </Form.Group>

            {validationError && <p className="text-danger">{validationError}</p>} {/* Display validation error */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={cancelOrder}>
            Submit issue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Orderhistory;
