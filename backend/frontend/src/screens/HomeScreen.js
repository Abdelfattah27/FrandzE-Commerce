import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import SearchBox from "../components/SearchBox";
//import axios from "axios";
function HomeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("keyword");

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;
  //const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(listProducts(search));
    // async function fetchProducts() {
    //   const { data } = await axios.get("/api/products");
    //   setProducts(data);
    // }
    // fetchProducts();
  }, [dispatch, searchParams]);
  // const products = [];
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <h1>Latest Products</h1>
          {products.map((x) => (
            <Col key={x._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={x}></Product>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
