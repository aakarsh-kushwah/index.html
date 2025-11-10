import React, { useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import './DashboardEnhancements.css';



export const Testimonials = () => (
  <Container className="testimonials-container">
    <h2>What Our Members Say</h2>
    <Row>
      <Col md={4}>
        <Card className="testimonial-card">
          <Card.Body>
            <Card.Text>
              "Earning through this platform has been a game-changer for me. The income is consistent, and the opportunities to grow are endless. I’m grateful to be part of this community!"
            </Card.Text>
            <h5>- Yash K., Mumbai, Maharashtra</h5>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="testimonial-card">
          <Card.Body>
            <Card.Text>
              "The best decision I made was joining this platform. The rewards are impressive, and the products practically sell themselves. Plus, the team support is incredible!"
            </Card.Text>
            <h5>- Sandeep S., Bhopal, Madhya Pradesh</h5>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="testimonial-card">
          <Card.Body>
            <Card.Text>
              "I started with no experience, and now I'm earning consistently every month. This platform gives everyone a chance to succeed and build a strong network."
            </Card.Text>
            <h5>- Priya K., Bengaluru, Karnataka</h5>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export const Achievements = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleShowVideo = () => {
    setShowVideo(!showVideo); // Toggle video visibility
  };

  return (
    <Container className="achievements-container">
      <h2>Your Achievements</h2>
      <Row>
        <Col md={4} className="achievement-col">
          <i className="fas fa-trophy achievement-icon"></i>
          <h4>Top Seller</h4>
          <p>You’ve reached the highest sales level!</p>
        </Col>
        <Col md={4} className="achievement-col">
          <i className="fas fa-users achievement-icon"></i>
          <h4>How It Works</h4>
          <p>Your team is growing fast!</p>
          <Button 
            variant="success" 
            onClick={handleShowVideo} 
            className="watch-video-button"
          >
            {showVideo ? "Hide Video" : "Watch Video"}
          </Button>
          
          {showVideo && (
            <div className="video-container">
              <h3>Team Leader Training Video</h3>
              <video controls className="team-video">
                <source src="./earnerswave_plan_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </Col>
        <Col md={4} className="achievement-col">
          <i className="fas fa-coins achievement-icon"></i>
          <h4>Earnings Milestone</h4>
          <p>You’ve hit your first ₹100000 in earnings!</p>
        </Col>
      </Row>
    </Container>
  );
};