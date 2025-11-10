import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import "./userPasswordUpdate.css";

function UserPasswordUpdate() {
  const [token, setToken] = useState(null);

  const location = useLocation();

  const getEmailFromSearchParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("email") || "";
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_PROTOCOL}/api/user/update-user-password`,
        payload
      );

      if (response.status === 200) {
        const token = response.data.data.token;
        console.log(token, "<<<<<<<<<token");
        localStorage.setItem("token", token);
        setToken(token);
        window.location.href = "/home";
      } else {
        console.log(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      alert("Error updating the password");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: getEmailFromSearchParams(),
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="user-password-update-container">
      <div className="user-password-update-box">
        <img
          src="./earnersWaveLogo.png"
          alt="Logo"
          className="user-password-update-logo"
        />
        <h2 className="user-password-update-title">Reset Password</h2>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              value={formik.values.email}
              readOnly
              className="user-password-update-input"
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              {...formik.getFieldProps("password")}
              className="user-password-update-input"
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword">
            <Form.Control
              type="password"
              placeholder="Password confirmation"
              {...formik.getFieldProps("confirmPassword")}
              className="user-password-update-input"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="user-password-update-button"
          >
            Reset Password
          </Button>
        </Form>
        <footer className="user-password-update-footer">
          © 2025 Copyright earnerswave
        </footer>
      </div>
    </div>
  );
}

export default UserPasswordUpdate;
