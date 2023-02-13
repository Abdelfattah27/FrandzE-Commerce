import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
//import { useHistory } from "react-router-dom";

import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { createReview, listProductDetails } from "../actions/productActions";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
function ProductScreen() {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const reviewCreate = useSelector((state) => state.reviewCreate);
  const {
    error: reviewError,
    loading: reviewLoading,
    data,
    success: successProductReview,
  } = reviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { id } = useParams();
  //const [product, setProduct] = useState({});

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({
        type: PRODUCT_CREATE_REVIEW_RESET,
      });
    }
    dispatch(listProductDetails(id));
    // async function fetchProduct() {
    //   const { data } = await axios.get(`/api/products/${id}`);
    //   setProduct(data);
    // }
    // fetchProduct();
  }, [dispatch, id, successProductReview]);
  // let product = {};
  //const product = products.find((x) => x._id === id);
  let navigate = useNavigate();
  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${quantity}`);
    console.log(`hello world ${id} with quantity ${quantity}`);
  };
  const createReviewHandler = (e) => {
    e.preventDefault();
    dispatch(createReview(product._id, { comment, rating }));
  };
  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>1{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>
                    {
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                        color={"#f8e825"}
                      ></Rating>
                    }
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price : </Col>
                      <Col>{product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status : </Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            xs="auto"
                            className="my-1"
                            as="select"
                            value={quantity}
                            onChange={(x) => setQuantity(x.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option value={x + 1} key={x}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="btn-block"
                      type="button"
                    >
                      Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant="blue"> No Reviews </Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <h5>{review.name}</h5>
                    <Rating value={review.rating} color="#f8e825"></Rating>
                    <p>{review.created_at.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  {reviewLoading && <Loader></Loader>}
                  {successProductReview && (
                    <Message variant="success">added Successfully</Message>
                  )}
                  {reviewError && (
                    <Message variant="danger">{reviewError}</Message>
                  )}
                  <h4>WRITE A REVIEW</h4>
                  {userInfo ? (
                    <Form onSubmit={createReviewHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=""> Select...</option>
                          <option value="1"> 1 - Poor</option>
                          <option value="2"> 2 - Fair</option>
                          <option value="3"> 3 - Good</option>
                          <option value="4"> 4 - Very Good</option>
                          <option value="5"> 5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={reviewLoading}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Please <Link to="/login">Login</Link> First
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
