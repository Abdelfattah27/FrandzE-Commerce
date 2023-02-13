import React, { useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address: address,
        city: city,
        postalCode: postalCode,
        country: country,
      })
    );
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <Form onSubmit={submitHandler}>
        <Form.Group title="address">
          <Form.Label>address</Form.Label>
          <Form.Control
            type="text"
            value={address ? address : ""}
            placeholder="Enter your address"
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group title="city">
          <Form.Label>city</Form.Label>

          <Form.Control
            type="text"
            value={city ? city : ""}
            placeholder="Enter your city"
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group title="postalCode">
          <Form.Label>postal Code</Form.Label>

          <Form.Control
            type="text"
            value={postalCode ? postalCode : ""}
            placeholder="Enter your postalCode"
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group title="c">
          <Form.Label>country</Form.Label>

          <Form.Control
            type="text"
            value={country ? country : ""}
            placeholder="Enter your country"
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
