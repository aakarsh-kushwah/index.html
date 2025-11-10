import React, { useState } from 'react';
import { Modal, Button, Form ,Card} from 'react-bootstrap';
import { FaCopy, FaShareAlt } from 'react-icons/fa'; // Importing copy and share icons

const ReferenceLinkModal = ({ showReferenceLink, handleCloseReferenceLink, referenceLink }) => {
    const [linkCopied, setLinkCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referenceLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <Modal show={showReferenceLink} onHide={handleCloseReferenceLink} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reference Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Card className="p-3">
                    <Card.Body>
                        <Card.Title>Share Your Reference Link</Card.Title>
                        <Card.Text>
                            Invite your friends to join and earn rewards! Use the reference link below to invite them.
                        </Card.Text>
                        <Form.Control
                            type="text"
                            value={referenceLink}
                            readOnly
                            className="mb-3"
                        />
                        <div className="d-flex justify-content-between">
                            <Button variant="outline-primary" onClick={copyToClipboard}>
                                <FaCopy /> {linkCopied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button
                                variant="outline-info"
                                onClick={() => navigator.share({ url: referenceLink })}
                            >
                                <FaShareAlt /> Share
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

export default ReferenceLinkModal;
