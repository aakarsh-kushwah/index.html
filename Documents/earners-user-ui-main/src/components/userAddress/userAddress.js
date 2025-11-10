import React, { useState, useEffect } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Header from '../navbar/header';
import RazorpayPayment from '../Razorpay/razorpay';
import './userAddress.css';

const UserAddressDetails = () => {
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [activeKey, setActiveKey] = useState(['0']);

    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/user/get-user-address`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status) {
                    setAddresses(response.data.data);
                    // Automatically open the form if no addresses are found
                    if (response.data.data.length === 0) {
                        setShowAddressForm(true);
                    }
                } else {
                    console.error('Error fetching addresses:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchUserAddresses();
    }, []);

    const formik = useFormik({
        initialValues: {
            shipping_address: '',
            city: '',
            state: '',
            postal_Code: '',
        },
        validationSchema: Yup.object({
            shipping_address: Yup.string().required('Street is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            postal_Code: Yup.string().matches(/^\d{6}$/, 'Postal Code must be exactly 6 digits').required('Postal Code is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${process.env.REACT_APP_PROTOCOL}/api/user/add-user-address`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAddresses([...addresses, values]);
                setShowAddressForm(false);
                setSelectedAddressIndex(addresses.length);
                resetForm();
            } catch (err) {
                console.error('Error adding address:', err);
            }
        },
    });

    

    const toggleAccordion = (key) => {
        if (activeKey.includes(key)) {
            setActiveKey(activeKey.filter((k) => k !== key));
        } else {
            setActiveKey([...activeKey, key]);
        }
    };

    const handleAddressSelection = (index) => {
        setSelectedAddressIndex(index);
        localStorage.setItem('selectedAddressId', addresses[index]?.id);
    };

    return (
        <>
            <Header />
            <Accordion className="ecommerce-accordion" activeKey={activeKey}>
                <Accordion.Item eventKey="0" className="accordion-item">
                    <Accordion.Header
                        className="accordion-header"
                        onClick={() => toggleAccordion('0')}
                    >
                        Your Address
                    </Accordion.Header>
                    <Accordion.Body className="accordion-body">
                        {showAddressForm ? (
                            <Form onSubmit={formik.handleSubmit} className="address-form">
                                <Form.Group controlId="shipping_address" className="form-group">
                                    <Form.Label className="form-label">Street</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your street"
                                        name="shipping_address"
                                        value={formik.values.shipping_address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="address-input"
                                        isInvalid={
                                            formik.touched.shipping_address &&
                                            !!formik.errors.shipping_address
                                        }
                                        required
                                    />
                                    {formik.touched.shipping_address &&
                                    formik.errors.shipping_address ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.shipping_address}
                                        </div>
                                    ) : null}
                                </Form.Group>
                                <Form.Group controlId="city" className="form-group">
                                    <Form.Label className="form-label">City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your city"
                                        name="city"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="address-input"
                                        isInvalid={formik.touched.city && !!formik.errors.city}
                                        required
                                    />
                                    {formik.touched.city && formik.errors.city ? (
                                        <div className="invalid-feedback">{formik.errors.city}</div>
                                    ) : null}
                                </Form.Group>
                                <Form.Group controlId="state" className="form-group">
                                    <Form.Label className="form-label">State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your state"
                                        name="state"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="address-input"
                                        isInvalid={formik.touched.state && !!formik.errors.state}
                                        required
                                    />
                                    {formik.touched.state && formik.errors.state ? (
                                        <div className="invalid-feedback">{formik.errors.state}</div>
                                    ) : null}
                                </Form.Group>
                                <Form.Group controlId="postal_Code" className="form-group">
                                    <Form.Label className="form-label">Postal Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your postal code"
                                        name="postal_Code"
                                        value={formik.values.postal_Code}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="address-input"
                                        isInvalid={
                                            formik.touched.postal_Code && !!formik.errors.postal_Code
                                        }
                                        required
                                    />
                                    {formik.touched.postal_Code && formik.errors.postal_Code ? (
                                        <div className="invalid-feedback">{formik.errors.postal_Code}</div>
                                    ) : null}
                                </Form.Group>
                                <Button variant="primary" type="submit" className="submit-btn">
                                    Submit
                                </Button>
                            </Form>
                        ) : addresses.length > 0 ? (
                            <>
                                {addresses.map((address, index) => (
                                    <div key={index} className="address-display">
                                        <Form.Check
                                            type="radio"
                                            label={`${address.shipping_address}, ${address.city}, ${address.state} - ${address.postal_Code}`}
                                            name="addressOptions"
                                            checked={selectedAddressIndex === index}
                                            onChange={() => handleAddressSelection(index)}
                                            className="address-option"
                                        />
                                    </div>
                                ))}
                                <Button
                                    variant="link"
                                    className="add-address-btn"
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                >
                                    Add New Address
                                </Button>
                            </>
                        ) : (
                            <div>No address added yet.</div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                
            </Accordion>

            <RazorpayPayment />
        </>
    );
};

export default UserAddressDetails;
