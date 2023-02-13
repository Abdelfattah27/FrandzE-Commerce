import React, { useState, useEffect } from "react";
import { Table, Button, ListGroup, FormGroup, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  deleteProduct,
  listProducts,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

function ProductListScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const {
    error: productsError,
    loading: productsLoading,
    products,
  } = productList;
  const productDelete = useSelector((state) => state.productDelete);
  const { success, loading, error } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
    product: createdProduct,
  } = productCreate;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this Product")) {
      dispatch(deleteProduct(id));
    }
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const createProductHandler = () => {
    dispatch(createProduct());
  };

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/editproduct/${createdProduct._id}`);
      dispatch({ type: PRODUCT_CREATE_RESET });
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, navigate, userInfo, success, createProduct, successCreate]);
  return productsLoading ? (
    <Loader></Loader>
  ) : productsError ? (
    <Message variant="danger">{productsError}</Message>
  ) : (
    <div>
      {loading && <Loader></Loader>}
      {error && <Message variant="danger">{error}</Message>}

      {loadingCreate && <Loader></Loader>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-5" onClick={createProductHandler}>
            Create Product <i className="fas fa-plus"></i>
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>Price</th>
            <th>Category</th>
            <th>Brand</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                  <LinkContainer to={`/admin/editproduct/${product._id}`}>
                    <Button type="button" variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    type="button"
                    variant="danger"
                    className="btn-sm mx-4"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductListScreen;
