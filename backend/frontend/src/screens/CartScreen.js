import React, { useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

function CartScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const quantity = searchParams.get("qty");
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, quantity));
    }
  }, [dispatch, id, quantity]);
  const CheckOutHandler = () => {
    navigate("/login?redirected=shipping");
  };
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to={"/"}>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.length > 0 &&
              cartItems.map((x) => (
                <ListGroup.Item key={x.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={x.image} alt={x.name} fluid rounded></Image>
                    </Col>
                    <Col md={3}>
                      {<Link to={`/product/${x.product}`}>{x.name}</Link>}
                    </Col>
                    <Col md={2}>$ {x.price}</Col>
                    <Col md="3">
                      <Form.Control
                        xs="auto"
                        className="my-1"
                        as="select"
                        value={x.quantity}
                        onChange={(y) =>
                          dispatch(addToCart(x.product, Number(y.target.value)))
                        }
                      >
                        {x.countInStock > 0 &&
                          [...Array(x.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x}>
                              {x + 1}
                            </option>
                          ))}
                      </Form.Control>
                    </Col>
                    <Col md="1">
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => dispatch(removeFromCart(x.product))}
                      >
                        {" "}
                        <i className="fas fa-trash"></i> Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card variant="flush">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce(
                  (acc, item) => acc + Number(item.quantity),
                  0
                )}
                ) Items
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>
                Total Price $
                {cartItems
                  .reduce((acc, item) => acc + item.quantity * item.price, 0)
                  .toFixed(2)}
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn btn-block"
                disabled={cartItems.length === 0}
                onClick={CheckOutHandler}
              >
                Proceed To Check Out
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
