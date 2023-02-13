import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, FormGroup, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate, useSearchParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirected = "/" + (searchParams.get("redirected") || "");
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  useEffect(() => {
    if (userInfo) {
      navigate(redirected);
    }
  }, [navigate, userInfo, redirected]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <>
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader></Loader>}
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <FormGroup controlId="loginPassword" className="py-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            New Customer ?{" "}
            <Link
              to={`/register/${redirected ? "?redirect=" + redirected : ""}`}
            >
              Register
            </Link>{" "}
            To create new account
          </Col>
        </Row>
      </FormContainer>
    </>
  );
}

export default LoginScreen;
