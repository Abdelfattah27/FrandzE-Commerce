import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  ListGroup,
  FormGroup,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import {
  login,
  register,
  userDetails,
  updateUser,
} from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { listMyOrders } from "../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";
function UserProfileScreen() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const userDetail = useSelector((state) => state.userDetail);
  const { loading, error, user } = userDetail;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordConfirt, setPasswordConfirm] = useState(true);
  const userUpdate = useSelector((state) => state.userUpdate);
  const { success } = userUpdate;

  const orderList = useSelector((state) => state.orderList);
  const {
    loading: listOrderLoading,
    data: userOrders,
    error: listOrderError,
  } = orderList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_RESET });
        dispatch(userDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, userInfo, user, userInfo, success]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password != confirmpassword) {
      setPasswordConfirm(false);
    } else {
      dispatch(updateUser(name, email, password || ""));
      setPasswordConfirm(true);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader></Loader>}
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={name ? name : ""}
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
              value={email ? email : ""}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <FormGroup controlId="password" className="py-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password ? password : ""}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup controlId="confirmPassword" className="py-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={confirmpassword ? confirmpassword : ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>
          {passwordConfirt || (
            <Message variant="danger">
              {"two passwords are not the same"}
            </Message>
          )}
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {listOrderLoading ? (
          <Loader></Loader>
        ) : listOrderError ? (
          <Message variant="danger">{listOrderError}</Message>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>iD</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th>Go To</th>
              </tr>
            </thead>
            <tbody>
              {userOrders &&
                userOrders.map((x) => (
                  <tr key={x._id}>
                    <td>{x._id}</td>
                    <td>
                      {x.created_at
                        ? x.created_at.substring(0, 10)
                        : "Not specified"}
                    </td>
                    <td>{x.total_price ? x.total_price : 0}</td>
                    <td>
                      {x.is_paid ? (
                        x.paid_at.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {x.is_delivered ? (
                        x.delevered_at.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/orders/${x._id}`}>
                        <Button className="btn-sm">Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default UserProfileScreen;
