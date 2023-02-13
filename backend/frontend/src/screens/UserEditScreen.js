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
import { adminUpdateUser, userDetails } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { USER_ADMIN_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setAdmin] = useState(false);

  const userDetail = useSelector((state) => state.userDetail);
  const { loading, error, user } = userDetail;

  const adminUpdate = useSelector((state) => state.adminUpdateUser);
  const { error: errorUpdate, success, loading: loadingUpdate } = adminUpdate;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirected = "/" + (searchParams.get("redirected") || "");
  const [passwordConfirt, setPasswordConfirm] = useState(true);
  useEffect(() => {
    if (success) {
      dispatch({ type: USER_ADMIN_UPDATE_RESET });

      navigate("/admin/userList/");
    } else {
      if (!user || !user.name || user._id !== Number(id)) {
        dispatch(userDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAdmin(user.isAdmin);
      }
    }
  }, [id, dispatch, user, success, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminUpdateUser({ id, name, email, isAdmin }));
  };
  return (
    <>
      <Link to="/admin/userList/">Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>

        {loading ? (
          <Loader></Loader>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <FormGroup controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              ></Form.Control>
            </FormGroup>
            <FormGroup controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </FormGroup>
            <FormGroup controlId="isAdmin" className="py-3">
              <Form.Label>Admin</Form.Label>
              <Form.Check
                type="checkbox"
                label="IsAdmin"
                checked={isAdmin}
                onChange={(e) => setAdmin(e.target.checked)}
              ></Form.Check>
            </FormGroup>
            {loadingUpdate && <Loader></Loader>}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

            <Button type="submit" variant="primary">
              Edit
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default UserEditScreen;
