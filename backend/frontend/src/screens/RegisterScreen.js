import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, FormGroup, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { login, register } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

function RegisterScreen() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirected = "/" + (searchParams.get("redirected") || "");
  const [passwordConfirt, setPasswordConfirm] = useState(true);
  useEffect(() => {
    if (userInfo) {
      navigate(redirected);
    }
  }, [dispatch, userInfo]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password != confirmpassword) {
      setPasswordConfirm(false);
      return;
    } else {
      dispatch(register(email, password, name));
    }
  };
  return (
    <>
      <FormContainer>
        <h1>Register</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader></Loader>}
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            ></Form.Control>
          </FormGroup>
          <FormGroup controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <FormGroup controlId="password" className="py-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="confirmPassword" className="py-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter your password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>
          {passwordConfirt || (
            <Message variant="danger">
              {"two passwords are not the same"}
            </Message>
          )}
          <Button type="submit" variant="primary">
            Sign Up
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Already have account ?
            <Link to={`/login/${redirected ? "?redirect=" + redirected : ""}`}>
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
}

export default RegisterScreen;
