import React, { useEffect } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { postPlaceOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { PLACE_ORDER_RESET } from "../constants/orderConstants";

function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const makePlaceOrder = useSelector((state) => state.makePlaceOrder);
  const { success, error, data } = makePlaceOrder;
  const navigate = useNavigate();
  useEffect(() => {
    if (success) {
      navigate(`/order/${data._id}`);
      dispatch({
        type: PLACE_ORDER_RESET,
      });
    }
  }, [success, navigate]);
  const { cartItems, shippingAddress, paymentMethod } = cart;
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  cart.shippingPrice = cart.itemsPrice > 100 ? 0.0 : (10).toFixed(2);
  cart.taxPrice = (0.02 * cart.itemsPrice).toFixed(2);
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);
  const placeOrderHandler = (e) => {
    dispatch(
      postPlaceOrder({
        orderItems: cartItems,
        paymentMethod: paymentMethod,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        shippingAddress: shippingAddress,
      })
    );
    console.log(data);
  };
  if (!paymentMethod) {
    navigate("/payment");
  }
  return (
    <Row>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Col xs={12} md="8">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h1>Shipping</h1>
            <p>
              <strong>Address</strong> : {shippingAddress.address},{"  "}
              {shippingAddress.city}, {"  "}
              {shippingAddress.postalCode},{"  "}
              {shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h1>payment Method</h1>
            <p>
              <strong>Method</strong> : {paymentMethod}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h1>Order Items</h1>

            {cartItems.length === 0 ? (
              <Message variant="info">No Items in that cart</Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={1}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        ></Image>
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.quantity} * {item.price} = $
                        {(item.quantity * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col xs={12} md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h1>Order summary</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items Price</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping Price</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax Price</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total Price</Col>
                <Col>{cart.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {error && (
              <ListGroup.Item>
                <Message variant="info">{error}</Message>
              </ListGroup.Item>
            )}
            <ListGroup.Item style={{ width: "100%" }}>
              <Button
                type="button"
                disabled={cartItems.length === 0}
                className="btn-block w-100"
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default PlaceOrderScreen;
