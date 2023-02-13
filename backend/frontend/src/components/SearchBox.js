import React, { useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [keyWord, setKeyWord] = useState();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyWord) {
      navigate(`/?keyword=${keyWord}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={submitHandler} style={{ display: "inline-block" }}>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyWord(e.target.value)}
        className="mr-sm-2 ml-sm-5 custom-form-control"
        style={{ width: "60%", display: "inline-block", margin: "0rem 0.5rem" }}
      ></Form.Control>
      <Button
        variant="outline-success"
        className="p-2 custom-button"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
}

export default SearchBox;
