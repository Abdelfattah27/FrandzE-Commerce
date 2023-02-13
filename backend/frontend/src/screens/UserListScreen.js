import React, { useState, useEffect } from "react";
import { Table, Button, ListGroup, FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteUser, listUsers } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

function UserListScreen() {
  const dispatch = useDispatch();
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user"))
      dispatch(deleteUser(id));
  };
  const userList = useSelector((state) => state.userList);
  const { loading, users, error } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success } = userDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [searchParams, setsearchParams] = useSearchParams();
  const redirected = "/" + (searchParams.get("redirected") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate(redirected);
    } else dispatch(listUsers());
  }, [dispatch, userInfo, success]);
  return loading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Table striped bordered hover className="table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>ADMIN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <i className="fas fa-check" style={{ color: "green" }}></i>
                ) : (
                  <i className="fas fa-check" style={{ color: "red" }}></i>
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/edituser/${user._id}`}>
                  <Button type="button" variant="light" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>
                </LinkContainer>

                <Button
                  type="button"
                  variant="danger"
                  className="btn-sm mx-4"
                  onClick={() => deleteHandler(user._id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

export default UserListScreen;
