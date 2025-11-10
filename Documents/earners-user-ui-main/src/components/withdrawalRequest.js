
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './withdrawalRequest.css';

function WithdrwalReq() {
    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [userBalance, setUserBalance] = useState(null);
    const [bankDetailsAdded, setBankDetailsAdded] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);
    const [loadingBankDetails, setLoadingBankDetails] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Authentication token not found. Please log in.');
                    return;
                }
                
                const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/user/user-profile-details`, {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                    },
                  });
    
                if (response.data) {
                    setUserProfile(response.data.data);
                    setUserBalance(response.data.data.Balance);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('Failed to fetch user profile. Please try again.');
            }
        };
    
        fetchUserProfile();
    }, []);
    
    const fetchBankDetails = async () => {
        try {
            setLoadingBankDetails(true);
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token not found. Please log in.');
                return;
            }
    
            const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/user/get-user-bank-details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.data.status === false && response.data.message === 'No bank details found for this user.') {
                setBankDetailsAdded(false);
                setShowAddBankModal(false);
            } else if (response.data.data) {
                setBankDetails(response.data.data);
                setBankDetailsAdded(true);
            }
        } catch (error) {
            console.error('Failed to fetch bank details', error);
        } finally {
            setLoadingBankDetails(false);
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const handleCloseModals = () => {
        setShowAddBankModal(false);
        setShowWithdrawModal(false);
    };

    const handleOpenWithdrawModal = () => {
        if (loadingBankDetails) {
            alert('Fetching bank details. Please wait...');
            return;
        }
    
        if (!bankDetailsAdded) {
            setShowAddBankModal(true);
        } else {
            setShowWithdrawModal(true);
        }
    };

    const handleAddBankDetails = async (values, { setSubmitting, resetForm }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token not found. Please log in.');
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_PROTOCOL}/api/user/add-user-bank-details`,
                {
                    bank_name: values.bankName,
                    account_number: values.accountNumber,
                    IFSc_Code: values.ifscCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                setBankDetailsAdded(true);
                alert('Bank details added successfully!');
                setShowAddBankModal(false);
                await fetchBankDetails();
                setShowWithdrawModal(true);
                resetForm();
            }
        } catch (error) {
            alert('Failed to add bank details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const bankDetailsSchema = Yup.object().shape({
        bankName: Yup.string().required('Bank name is required'),
        accountNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Account number must be numeric')
            .required('Account number is required'),
        ifscCode: Yup.string()
            .matches(/^[A-Za-z]{4}[a-zA-Z0-9]{7}$/, 'Invalid IFSC code format')
            .required('IFSC code is required'),
    });

    const handleWithdrawRequest = async () => {
        const token = localStorage.getItem('token');
    
        if (withdrawalAmount && withdrawalAmount <= userBalance) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_PROTOCOL}/api/withdrawal/user-withdrawal-request`,
                    { amount: withdrawalAmount },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (response.data) {
                    if (response.data.message === 'Error: Add your PAN card number to withdraw an amount more than ₹13,000') {
                        // Navigate to the PanCardUpdate route if the specific error message is returned
                        navigate('/bank-details');
                        return;
                    }

                    const newBalance = userBalance - withdrawalAmount;
                    setUserBalance(newBalance);
    
                    const updatedProfile = {
                        ...userProfile,
                        Balance: newBalance,
                    };
    
                    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    setWithdrawalAmount('');
                    alert(response.data.message);
                    handleCloseModals();
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    console.error('Error processing withdrawal request:', error);
                    alert('Failed to process withdrawal request. Please try again.');
                }
            }
        } else {
            alert('Invalid withdrawal amount');
        }
    };

    return (
        <Container>
        <Row className="justify-content-center align-items-center mt-5">
            <Col md="auto" onClick={handleOpenWithdrawModal} style={{ cursor: 'pointer' }}>
            <Card className="text-center shadow-sm" style={{ width: '50px', height: '50px', backgroundColor: 'rgb(239 237 189)', justifyContent:'center'}}>
                         {/* Coin icon */}
                        {userBalance !== null && (
                            <h6 className="userbalanceamount">₹{userBalance}</h6>
                        )}
                    </Card>
            </Col>
             {/* Add Bank Details Modal */}
             <Modal show={showAddBankModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Bank Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            bankName: '',
                            accountNumber: '',
                            ifscCode: '',
                        }}
                        validationSchema={bankDetailsSchema}
                        onSubmit={handleAddBankDetails}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankName"
                                        value={values.bankName}
                                        onChange={handleChange}
                                        isInvalid={touched.bankName && !!errors.bankName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.bankName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Account Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="accountNumber"
                                        value={values.accountNumber}
                                        onChange={handleChange}
                                        isInvalid={touched.accountNumber && !!errors.accountNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.accountNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifscCode"
                                        value={values.ifscCode}
                                        onChange={handleChange}
                                        isInvalid={touched.ifscCode && !!errors.ifscCode}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ifscCode}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="success" type="submit" disabled={isSubmitting}>
                                    Add Bank Details
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            {/* Withdrawal Request Modal */}
            <Modal show={showWithdrawModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Withdrawal Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="withdrawal-card">
                        <Card.Body className="p-4">
                            <div className="d-flex withdrawal-info">
                                <div className="flex-grow-1 ms-3">
                                    <h5>{userProfile?.first_name || 'John Doe'}</h5>

                                    {/* Conditional Rendering for Bank Details */}
                                    {bankDetails ? (
                                        <>
                                            <p>Bank: {bankDetails.bank_name}</p>
                                            <p>Account: **** **** **** {bankDetails.account_number.slice(-4)}</p>
                                        </>
                                    ) : (
                                        <p>No bank details available. Please add your bank details.</p>
                                    )}

                                    <p>Available Balance: ₹{userBalance}</p>
                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Withdrawal Amount</Form.Label>
                                <div>
                                    {[100, 500, 1000, 10000, 50000].map((amount) => (
                                        <Button
                                            key={amount}
                                            variant={amount <= userBalance ? 'outline-primary' : 'outline-secondary'}
                                            onClick={() => setWithdrawalAmount(amount)}
                                            disabled={amount > userBalance}
                                            style={{ margin: '5px' }}
                                        >
                                            {amount}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={handleWithdrawRequest}
                                disabled={!withdrawalAmount || withdrawalAmount > userBalance}
                            >
                                Request Withdrawal
                            </Button>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Row>
    </Container>
    );
}

export default WithdrwalReq;



       