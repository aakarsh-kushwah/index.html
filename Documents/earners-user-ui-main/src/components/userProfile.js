import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Modal, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaIdBadge, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import './userProfile.css'; // Updated CSS file

function Userprofile() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/user/user-profile-details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to load profile data. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleOpenModal = () => {
        setShowModal(true);
        // Add a history state to handle the back button gracefully
        window.history.pushState({ modalOpen: true }, '');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Go back in history if the modal was opened via a push
        if (window.history.state?.modalOpen) {
            window.history.back();
        }
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (showModal) {
                setShowModal(false);
            } else if (event.state && event.state.modalOpen) {
                // This is a new approach to handle popstate from a pushstate
                setShowModal(true);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [showModal]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status" variant="success" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message text-center mt-5">{error}</div>;
    }

    return (
        <Container className="profile-container d-flex justify-content-center align-items-center">
            <div onClick={handleOpenModal} className="profile-toggle-button">
                <img
                    src="./Leonardo_Phoenix_give_me_a_user_profile_image_of_a_boy_with_ca_1.jpg"
                    alt="Profile"
                    className="profile-logo"
                />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered className="profile-modal">
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title className="modal-title-custom">Your Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <Card className="profile-card-display">
                        <Card.Body>
                            <div className="profile-header text-center">
                                <img
                                    className="profile-avatar"
                                    src="./Leonardo_Phoenix_give_me_a_user_profile_image_of_a_boy_with_ca_1.jpg"
                                    alt="Profile"
                                />
                                <h4 className="profile-name mt-3">{userData.first_name || 'User Name'}</h4>
                                <p className="profile-level">Account Status: <span className={`status-${userData.status.toLowerCase()}`}>{userData.status}</span></p>
                            </div>
                            <hr />
                            <div className="profile-details-list">
                                <div className="detail-item">
                                    <FaIdBadge className="detail-icon" />
                                    <div className="detail-text">
                                        <p className="detail-label">Unique ID</p>
                                        <p className="detail-value">{userData.unique_id}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <FaPhone className="detail-icon" />
                                    <div className="detail-text">
                                        <p className="detail-label">Mobile Number</p>
                                        <p className="detail-value">{userData.phone_number || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <FaEnvelope className="detail-icon" />
                                    <div className="detail-text">
                                        <p className="detail-label">Email</p>
                                        <p className="detail-value">{userData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Userprofile;