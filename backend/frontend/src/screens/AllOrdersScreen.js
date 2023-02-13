import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../actions/orderActions";
import { Table, Button, ListGroup, FormGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { deleteUser, listUsers } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

function AllOrdersScreen() {
  const dispatch = useDispatch();
  const allOrders = useSelector((state) => state.allOrders);
  const { data: orders, loading, error } = allOrders;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
    dispatch(getAllOrders());
    console.log(orders);
  }, [dispatch, userInfo]);
  return loading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Table striped bordered hover className="table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Date</th>
          <th>Price</th>
          <th>Paid </th>
          <th>Delivered </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orders &&
          orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{order.created_at && order.created_at.substring(0, 10)}</td>
              <td>$ {order.total_price}</td>
              <td>
                {order.is_paid ? (
                  order.paid_at && order.paid_at.substring(0, 10)
                ) : (
                  <i className="fas fa-check" style={{ color: "red" }}></i>
                )}
              </td>
              <td>
                {order.is_delivered ? (
                  order.delevered_at && order.delevered_at.substring(0, 10)
                ) : (
                  <i className="fas fa-check" style={{ color: "red" }}></i>
                )}
              </td>
              <td>
                <LinkContainer to={`/order/${order._id}`}>
                  <Button type="button" variant="light" className="btn-sm">
                    Details
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

export default AllOrdersScreen;
