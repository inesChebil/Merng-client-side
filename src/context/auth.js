import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";
// Because it's a small app, we are going to be using Context instaed of for example Redux
// we are gonna create a context

const initialState = {
  user: null,
};
if (localStorage.getItem("jwtToken")) {
  //this token stores an expiration date, so we need wheher this token is expired or not
  // but this expiration date is encoded inside of the token, so need to decode it ,we have to install a library called jwt-decode
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  // the expiration date is a "time from epoch date string",
  // and we need to times it by a 1000 because it's like in secondes, we nedd it in milliseconds

  //  if the decodedToken is expired, we need to delete it and set ourselves to not be logged in
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

// We need to create a reducer
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

// we will use this reducer in our provider: AuthProvider
// useReducer hook takes a reducer and returns a state and a dispatch
function AuthProvider(props) {
  //  useReducer takes the reducer and an initial state(user:null) as input
  const [state, dispatch] = useReducer(authReducer, initialState);

  // we can use dispatch to dispatch any action and attach to it, type and a payload,
  // and when that is dipatched, our reducer will listen to it, and perform any action according to that dispatched action

  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }
  return (
    // value is what we we gonna pass to our component that is underneath this context provider
    // {...props} incase we need to pass props to underneath component
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

// we need to exports two thing : AuthContext, and the auth provider
export { AuthContext, AuthProvider };
