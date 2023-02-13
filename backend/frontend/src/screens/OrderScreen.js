import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { deliverOrder, getOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  ORDER_DELIVER_RESET,
  PLACE_ORDER_RESET,
} from "../constants/orderConstants";

function OrderScreen() {
  //const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const dispatch = useDispatch();
  const { data, error, loading } = orderDetails;
  const navigate = useNavigate();
  const { id } = useParams();
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    success: deliveredSuccess,
    loading: deliverLoading,
    error: deliverError,
  } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // const addPayPalScript = () => {
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src =
  //     "https://www.paypal.com/sdk/js?client-id=AeDXja18CkwFUkL-HQPySbzZsiTrN52cG13mf9Yz7KiV2vNnGfTDP0wDEN9sGlhZHrbb_USawcJzVDgn";
  //   script.async = true;
  //   script.onload = () => {
  //     setSdkReady(true);
  //   };
  //   document.body.appendChild(script);
  // };
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!data || data._id !== Number(id) || deliveredSuccess) {
      console.log(deliveredSuccess);
      dispatch({
        type: ORDER_DELIVER_RESET,
      });
      dispatch(getOrder(id));
    }
  }, [id, data, dispatch, deliveredSuccess]);
  if (!loading && !error) {
    data.itemsPrice = data.items
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(data._id));
  };
  return loading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Row>
      <h1>{}</h1>
      <h1>Order {id}</h1>
      <Col xs={12} md="8">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h1>Shipping</h1>
            <p>
              <strong>Name</strong> : {data.user.name}
            </p>
            <p>
              <strong>Email</strong> :{" "}
              <a href={`mailto:${data.user.email}`}>{data.user.email}</a>
            </p>
            <p>
              <strong>Address</strong> : {data.shipping_address.address},{"  "}
              {data.shipping_address.city}, {"  "}
              {data.shipping_address.postalCode},{"  "}
              {data.shipping_address.country}
            </p>
            {data.is_delivered ? (
              <Message variant="success">
                Delivered on {data.delevered_at}
              </Message>
            ) : (
              <Message variant="warning">Not Delivered</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h1>payment Method</h1>
            <p>
              <strong>Method</strong> : {data.payment_method}
            </p>
            {data.is_paid ? (
              <Message variant="success">Paid on {data.paid_at}</Message>
            ) : (
              <Message variant="warning">Not Paid</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h1>Order Items</h1>

            {data.items.length === 0 ? (
              <Message variant="info">Order is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {data.items.map((item) => (
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
                <Col>${data.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping Price</Col>
                <Col>${data.shipping_price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax Price</Col>
                <Col>${data.tax_price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total Price</Col>
                <Col>{data.total_price}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>
        {/* <MyPaypalButtons></MyPaypalButtons> */}
        {userInfo && userInfo.isAdmin && data.is_paid && !data.is_delivered && (
          <ListGroup.Item>
            {deliverLoading && <Loader></Loader>}
            {deliverError && <Message variant="danger">{deliverError}</Message>}
            <Button
              className="btn-block w-100"
              type="button"
              onClick={deliverHandler}
            >
              Mark as Deliver
            </Button>
          </ListGroup.Item>
        )}
      </Col>
    </Row>
  );
}

export default OrderScreen;
