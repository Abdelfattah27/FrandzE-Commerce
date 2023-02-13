import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <Nav className="justify-content-center mb-4">
      {step1 ? (
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Login</Nav.Link>
      )}

      {step2 ? (
        <LinkContainer to="/shipping">
          <Nav.Link>Shipping Address</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Shipping Address</Nav.Link>
      )}

      {step3 ? (
        <LinkContainer to="/payment">
          <Nav.Link>Payment</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Payment</Nav.Link>
      )}

      {step4 ? (
        <LinkContainer to="/placeorder">
          <Nav.Link>place Order</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>place Order</Nav.Link>
      )}
    </Nav>
  );
}

export default CheckoutSteps;
