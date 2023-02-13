import axios from "axios";
import {
  ALL_ORDERS_RESET,
  ORDER_LIST_MY_RESET,
} from "../constants/orderConstants";
import {
  USER_Detail_FAIL,
  USER_Detail_REQUEST,
  USER_Detail_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REEQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_Detail_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_ADMIN_UPDATE_REQUEST,
  USER_ADMIN_UPDATE_SUCCESS,
  USER_ADMIN_UPDATE_FAIL,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REEQUEST,
    });
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const userData = {
      username: email,
      password: password,
    };
    const { data } = await axios.post(
      "/api/users/login/",
      {
        username: email,
        password: password,
      },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    console.log(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({
    type: USER_LOGOUT,
  });
  dispatch({
    type: USER_Detail_RESET,
  });
  dispatch({
    type: ORDER_LIST_MY_RESET,
  });
  dispatch({
    type: USER_LIST_RESET,
  });
  dispatch({
    type: ALL_ORDERS_RESET,
  });
};

export const register = (email, password, name) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/register/",
      {
        email: email,
        password: password,
        name: name,
      },
      config
    );
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const userDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_Detail_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/users/${id}/`, config);
    dispatch({
      type: USER_Detail_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_Detail_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.message
          : error.message,
    });
  }
};

export const updateUser =
  (name, email, password) => async (dispatch, useState) => {
    try {
      dispatch({
        type: USER_UPDATE_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = useState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/users/profile/update/",
        {
          email: email,
          name: name,
          password: password,
        },
        config
      );
      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: data,
      });
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      return error.response && error.response.message
        ? error.response.message
        : error.message;
    }
  };

export const listUsers = () => async (dispatch, useState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = useState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.get("/api/users/", config);
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.message
          : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, useState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = useState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-type": "application/json",
      },
    };
    await axios.delete(`/api/users/deleteuser/${id}`, config);
    dispatch({
      type: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.message
          : error.message,
    });
  }
};

export const adminUpdateUser = (user) => async (dispatch, useState) => {
  try {
    dispatch({
      type: USER_ADMIN_UPDATE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = useState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/users/updateuser/${user.id}/`,
      {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      config
    );
    dispatch({
      type: USER_ADMIN_UPDATE_SUCCESS,
    });
    dispatch({
      type: USER_Detail_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_ADMIN_UPDATE_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.message
          : error.message,
    });
  }
};
