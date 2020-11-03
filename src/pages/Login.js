import gql from "graphql-tag";
import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      // once we logged in we need to hit the login in the context and pass the data ,
      // so the the context will set the use to the actual user data
      // console.log({ result: result });
      // console.log({ resultDataLogin: result.data.login });
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },

    variables: values,
  });
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      {/* NoValidate, because HTML5 by default tries to validate email fields */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username ..."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password ..."
          name="password"
          type="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {/* we need to check if any errors has any keys because we have always errors, and sometimes they are empty object */}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {/* we access the values of the errors not the keys so we use Object.valuyes */}
            {Object.values(errors).map((value) => (
              //  value is uniq
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Here we will write our Graphql mutations

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    # this will trigger the login mutation
    login(
      username: $username

      password: $password
    ) {
      # after register is triggered, we get a couple of fields back
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Login;
