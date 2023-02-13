import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REEQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_Detail_REQUEST,
  USER_Detail_SUCCESS,
  USER_Detail_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
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
  USER_ADMIN_UPDATE_RESET,
} from "../constants/userConstants";

export const UserLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REEQUEST:
      return {
        loading: true,
      };
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };

    case USER_LOGIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const UserRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return {
        loading: true,
      };
    case USER_REGISTER_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };
    case USER_REGISTER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};
export const UserDetailReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_Detail_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_Detail_SUCCESS:
      return {
        loading: false,
        user: action.payload,
      };
    case USER_Detail_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_Detail_RESET:
      return { user: {} };
    default:
      return state;
  }
};

export const UpdateUserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return {
        loading: true,
      };
    case USER_UPDATE_SUCCESS:
      return {
        loading: false,
        userData: action.payload,
        success: true,
      };
    case USER_UPDATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return {
        loading: true,
      };
    case USER_LIST_SUCCESS:
      return {
        loading: false,
        users: action.payload,
      };
    case USER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_LIST_RESET:
      return { users: [] };
    default:
      return state;
  }
};

export const userDeleteReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return {
        loading: true,
      };
    case USER_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case USER_DELETE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const adminUpdateUserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_ADMIN_UPDATE_REQUEST:
      return {
        loading: true,
      };
    case USER_ADMIN_UPDATE_SUCCESS:
      return {
        loading: false,
        userData: action.payload,
        success: true,
      };
    case USER_ADMIN_UPDATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_ADMIN_UPDATE_RESET:
      return { user: {} };
    default:
      return state;
  }
};
