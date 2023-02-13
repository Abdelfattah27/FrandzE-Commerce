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
import { listProductDetails, updateProduct } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import axios from "axios";

function ProductEditScreen() {
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setcountInStock] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUpload] = useState(false);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    product: updatedProduct,
    success: updateSuccess,
  } = productUpdate;

  const navigate = useNavigate();
  const uploadImageHandler = async (e) => {
    console.log("uploader");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_id", id);
    setUpload(true);
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/products/upload/",
        formData,
        config
      );

      setImage(data);
      setUpload(false);
    } catch (error) {
      setUpload(false);
    }
  };
  useEffect(() => {
    if (updateSuccess) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productList");
    } else if (!product || product._id !== Number(id)) {
      dispatch(listProductDetails(id));
    } else {
      setName(product.name);
      setImage(product.image);
      setCategory(product.category);
      setcountInStock(product.countInStock);
      setPrice(product.price);
      setDescription(product.description);
      setBrand(product.brand);
    }
  }, [id, dispatch, product, navigate, updateSuccess]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name,
        brand,
        description,
        image,
        category,
        countInStock,
        price,
      })
    );
  };
  return (
    <>
      <Link to="/admin/productList/">Go Back</Link>
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
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              ></Form.Control>
            </FormGroup>

            <FormGroup controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price ? price : 0}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Price"
              ></Form.Control>
            </FormGroup>

            <FormGroup controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                value={image ? image : ""}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter Image"
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadImageHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </FormGroup>

            <FormGroup controlId="brand">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                value={brand ? brand : ""}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter Brand"
              ></Form.Control>
            </FormGroup>

            <FormGroup controlId="countInStock">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock ? countInStock : 0}
                onChange={(e) => setcountInStock(e.target.value)}
                placeholder="Enter Stock"
              ></Form.Control>
            </FormGroup>

            <FormGroup controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category ? category : ""}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              ></Form.Control>
            </FormGroup>

            <FormGroup controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              ></Form.Control>
            </FormGroup>
            {updateLoading && <Loader></Loader>}
            {updateError && <Message variant="danger">{updateError}</Message>}
            <Button type="submit" variant="primary" className="my-3">
              Edit
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ProductEditScreen;
