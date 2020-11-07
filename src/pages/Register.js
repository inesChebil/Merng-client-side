import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
    image: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // these are option
    // the method is triggered if the mutation is successfully executed
    update(proxy, { data: { register: userData } }) {
      // the resulut is the result of the mutation
      // the proxy we will rarely use

      // once we logged in or register, our entire app will have access to the userData inside of the context
      context.login(userData);

      // once we add the user, we redirect to the home page
      props.history.push("/");
    },
    onError(err) {
      // graphqlErrors can return multiple errors , but the way our server code is written is that we give one rror and inside of that
      // there is an object that holds all those erroors
      // errors from our server code

      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },

    // the variables of the mutations
    variables: values,
    // variables: {
    //   username: values.username,
    //   email: values.email,
    //   password: values.password,
    //   confirmedPassword: values.confirmedPassword,
    // },
  });

  // in javascript, Al the functions with the key word "function" in the beginning of the programm are hoisted,
  // Meaning they are brought up and read through initially..
  //  so even if it's on the bottom, it's recognized in te top => this is unlike function with const keyword
  function registerUser() {
    addUser();
  }
  return (
    <div className="form-container">
      {/* NoValidate, because HTML5 by default tries to validate email fields */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email ..."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password ..."
          name="confirmedPassword"
          type="password"
          error={errors.confirmedPassword ? true : false}
          value={values.confirmedPassword}
          onChange={onChange}
        />
        <Form.Input
          label="Photo"
          placeholder="Add your Photo..."
          name="image"
          type="text"
          error={errors.image ? true : false}
          value={values.image}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmedPassword: String!
    $image: String!
  ) {
    # this will trigger the register mutation which takes a registerInput (our server code)
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmedPassword: $confirmedPassword
        image: $image
      }
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
export default Register;
