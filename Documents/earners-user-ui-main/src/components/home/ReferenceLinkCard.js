import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { FaCopy, FaShareAlt } from 'react-icons/fa'; // Importing copy and share icons
import './ReferenceLinkCard.css'; // Make sure this CSS is imported

const ReferenceLinkCard = ({ referenceLink }) => {
    const [linkCopied, setLinkCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referenceLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        // The card now relies on the CSS from ReferenceLinkCard.css
        <Card className="p-3 rlc-card-custom"> {/* Added a custom class for specific styling */}
            <Card.Body>
                <Card.Title className="rlc-card-title">Share Your Reference Link</Card.Title>
                <Card.Text className="rlc-card-text">
                    Invite your friends to join and earn rewards! Use the reference link below to invite them.
                </Card.Text>
                <Form.Control
                    type="text"
                    value={referenceLink}
                    readOnly
                    className="mb-3 rlc-input" // Added custom class
                />
                <div className="d-flex justify-content-between rlc-buttons-container">
                    <Button variant="outline-primary" onClick={copyToClipboard} className="rlc-button">
                        <FaCopy /> {linkCopied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                        variant="outline-info"
                        onClick={() => navigator.share({ url: referenceLink })}
                        className="rlc-button" // Added custom class
                    >
                        <FaShareAlt /> Share
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ReferenceLinkCard;