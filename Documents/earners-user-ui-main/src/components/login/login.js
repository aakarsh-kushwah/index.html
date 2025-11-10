import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

function Userlogin() {
    const [token, setToken] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const myUrl = `${process.env.REACT_APP_PROTOCOL}/api/user/login`;
            const response = await axios.post(myUrl, {
                email: values.email,
                password: values.password,
            });
    
            try {
                if (response.status === 200) {
                    const token = response.data.data.token;
                    localStorage.setItem('token', token);
                    setToken(token);
                    window.location.href = '/home';
                } else {
                    console.log(`Error: ${response.status}`);
                }
            } catch (apiError) {
                // Handle API-specific error
                if (response.data?.status === false && response.data?.message) {
                    alert(response.data.message);
                } else {
                    console.error(`Unexpected API response: ${apiError.message}`);
                }
            }
        } catch (error) {
            // Handle general network or server errors
            console.error(`Error: ${error.message}`);
            alert("Incorrect password. Please try again.");
        }
        setSubmitting(false);
    };
    

    const handleForgotPassword = async () => {
        if (!formik.values.email) {
            alert("Please enter your email address.");
            return;
        }

        try {
            const forgetPasswordUrl = `${process.env.REACT_APP_PROTOCOL}/api/user/forget-password`;
            const response = await axios.post(forgetPasswordUrl, { email: formik.values.email });
            alert("Password reset link sent to your email!");
        } catch (error) {
            console.error(`Error: ${error.message}`);
            alert("An error occurred while processing your request.");
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div className="login-container">
            <div className="glass-card">
                <h2 className="login-title">Welcome Back</h2>
                <form onSubmit={formik.handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                            className="login-input"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-text">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="input-group">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            {...formik.getFieldProps('password')}
                            className="login-input"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                        {formik.touched.password && formik.errors.password && (
                            <div className="error-text">{formik.errors.password}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`login-button ${formik.isValid && !formik.isSubmitting ? 'enabled' : ''}`}
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        Log In
                    </button>
                    <div className="login-footer">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="login-link"
                        >
                            Forgot Password?
                        </button>
                        <a href="/signup" className="login-link">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Userlogin;
