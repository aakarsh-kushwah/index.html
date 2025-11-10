import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

function UserSignup() {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [emailForOtp, setEmailForOtp] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [otpTimer, setOtpTimer] = useState(10 * 60);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [loading, setLoading] = useState(false);  // Track loading state for OTP verification
    const [signupMessage, setSignupMessage] = useState(''); // Handle signup message

    useEffect(() => {
        if (window.location.href === "https://www.earnerswave.com/signup") {
            localStorage.removeItem("userProfile");
        }
        const sponsor_id = searchParams.get('sponsor_id') || '4023';
        const parent_id = searchParams.get('parent_id') || '4023';

        localStorage.setItem('sponsor_id', sponsor_id);
        localStorage.setItem('parent_id', parent_id);
    }, [searchParams]);

    useEffect(() => {
        let timerInterval;
        if (otpSent && otpTimer > 0) {
            timerInterval = setInterval(() => {
                setOtpTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            clearInterval(timerInterval);
            setOtpMessage("OTP expired. Please request a new OTP.");
        }
        return () => clearInterval(timerInterval);
    }, [otpSent, otpTimer]);

    const sendOtp = async (email) => {
        setLoading(true); // Start the loader immediately
        try {
            const response = await axios.post(`${process.env.REACT_APP_PROTOCOL}/api/user/create`, {
                first_name: formik.values.firstName,
                phone_number: formik.values.phoneNumber,
                email: email,
                password: formik.values.password,
            });

            if (response.status === 200 && response.data.status) {
                setOtpSent(true);
                setEmailForOtp(email);
                setOtpTimer(10*60);
                setOtpMessage('OTP has been sent to your email. Please check and verify.');
            } else {
                setOtpMessage(response.data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            setOtpMessage('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false); // Stop the loader once the API call is complete
        }
    };

    const verifyOtp = async (otp) => {
        setLoading(true); // Start loading during OTP verification
        try {
            const response = await axios.post(`${process.env.REACT_APP_PROTOCOL}/api/user/verifyOtp`, {
                email: emailForOtp,
                otp: otp,
            });
    
            const { status, message, data } = response.data;
    
            if (status) {
                // Store the token in local storage
                localStorage.setItem('token', data.token);
    
                setOtpMessage(message); // Success message
                setSignupMessage(data.message); // Additional success message
    
                // Redirect to home after 2 seconds
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                setOtpMessage(message || 'Invalid OTP. Please try again.'); // Error message
            }
        } catch (error) {
            console.error('Error during OTP verification:', error.message);
    
            if (error.response && error.response.data) {
                setOtpMessage(error.response.data.message || 'Failed to verify OTP. Please try again.');
            } else {
                setOtpMessage('A network error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading after verification attempt
        }
    };
    


    const validationSchema = Yup.object({
        firstName: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name must contain only alphabetic characters')
            .required('Name is required'),
        phoneNumber: Yup.string()
            .matches(/[6-9][0-9]{9}/, 'Invalid Phone Number')
            .required('Phone Number is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
        otp: Yup.string()
            .when('otpSent', {
                is: true,
                then: Yup.string()
                    .matches(/^\d{4}$/, 'OTP must be a 4-digit number')
                    .required('OTP is required'),
            }),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            phoneNumber: '',
            email: '',
            password: '',
            otp: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (!otpSent) {
                await sendOtp(values.email);
            } else {
                await verifyOtp(values.otp);
            }
        },
    });

    useEffect(() => {
        // Disabling the submit button until terms are accepted and OTP timer is active
        if (termsAccepted && otpTimer > 0) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [termsAccepted, otpTimer]);

    const resendOtp = async () => {
        setOtpTimer(600); // Reset the OTP timer (10 minutes)
        setOtpMessage('Sending OTP again...');
        await sendOtp(formik.values.email); // Trigger OTP sending again
    };


    return (
        <div className="signup-container">
            <div className="glass-card">
                <h1 className="signup-title">Sign Up Here! EARNER</h1>
                <Form onSubmit={formik.handleSubmit} className="signup-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Your Name"
                            {...formik.getFieldProps('firstName')}
                            className="signup-input"
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                            <div className="error-text">{formik.errors.firstName}</div>
                        )}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            {...formik.getFieldProps('phoneNumber')}
                            className="signup-input"
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                            <div className="error-text">{formik.errors.phoneNumber}</div>
                        )}
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                            className="signup-input"
                            disabled={otpSent}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-text">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="create Password"
                            {...formik.getFieldProps('password')}
                            className="signup-input"
                            disabled={otpSent}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="error-text">{formik.errors.password}</div>
                        )}
                        <div className="toggle-password">
                            <input
                                type="checkbox"
                                id="signup-check"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="signup-check">
                                {showPassword ? "Hide" : "Show"} password
                            </label>
                        </div>
                    </div>
                    {otpSent && (
                        <div className="otp-container">
                            <div className="input-group otp-group">
                                <label htmlFor="otp">Enter 4-digit OTP</label>
                                <div className="otp-inputs">
                                    {Array(4).fill('').map((_, index) => (
                                        <input
                                            key={index}
                                            type="tel"
                                            inputMode="numeric"       // Added attribute to suggest numeric keypad
                                            pattern="[0-9]*"          // Optional: restrict input to digits
                                            maxLength="1"
                                            value={formik.values.otp[index] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/[^0-9]/.test(value)) return; // Allow only digits
                                                const otp = formik.values.otp.split('');
                                                otp[index] = value;
                                                formik.setFieldValue('otp', otp.join(''));
                                                if (value && index < 3) {
                                                    document.getElementById(`otp-input-${index + 1}`).focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && index > 0) {
                                                    document.getElementById(`otp-input-${index - 1}`).focus();
                                                }
                                            }}
                                            id={`otp-input-${index}`}
                                            className="otp-input"
                                        />
                                    ))}
                                </div>
                                {formik.touched.otp && formik.errors.otp && (
                                    <div className="error-text">{formik.errors.otp}</div>
                                )}
                            </div>

                            <div className="otp-timer">
                                <span>
                                    Time remaining: {Math.floor(otpTimer / 60)}:{otpTimer % 60 < 10 ? `0${otpTimer % 60}` : otpTimer % 60}
                                </span>
                                {otpTimer === 0 && !loading && (
                                    <Button variant="link" onClick={resendOtp} disabled={loading}>
                                        Resend OTP
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    {otpMessage && (
                        <div className={`error-text ${otpMessage ? 'highlight' : ''}`}>
                            {otpMessage}
                        </div>
                    )}
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                        />
                        <label htmlFor="terms">
                            <a href="/terms-and-conditions">Terms & Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>
                        </label>
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        className="signup-button"
                        disabled={isSubmitDisabled || loading} 
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            otpSent ? "Verify OTP" : "Sign Up"
                        )}
                    </Button>
                    <p className="signup-login">
                        Already have an account? <a href="login">Login</a>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default UserSignup;
