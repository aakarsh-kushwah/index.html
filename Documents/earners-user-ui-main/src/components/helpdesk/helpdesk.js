import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import './helpdesk.css'; // Updated unique classnames
import Header from '../navbar/header';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

function HelpDeskPage() {
  const whatsappGroupLink = ' https://whatsapp.com/channel/0029VartlyT9cDDaTHD7Ns3g'; // Add your actual link here

  return (
    <>
      <Header/>
      <Container className="helpdesk-page__container">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="helpdesk-card__container text-center shadow-lg">
              <Card.Body>
                <FaWhatsapp size={50} className="whatsapp-icon mb-3" />
                <Card.Title className="helpdesk-card__title">
                  Join Our WhatsApp Group
                </Card.Title>
                <Card.Text className="helpdesk-card__description">
                  Connect with our community for instant updates and support.
                </Card.Text>
                <Button
                  href={whatsappGroupLink}
                  target="_blank"
                  className="helpdesk-card__whatsapp-button"
                  variant="success"
                >
                  Join WhatsApp Group
                </Button>

                <hr className="helpdesk-card__divider" />

                <div className="helpdesk-card__social-media">
                  <p className="helpdesk-card__social-title">Follow us on Social Media</p>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="helpdesk-card__social-link">
                    <FaFacebookF size={30} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="helpdesk-card__social-link">
                    <FaTwitter size={30} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="helpdesk-card__social-link">
                    <FaInstagram size={30} />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HelpDeskPage;
