import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@graphql/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const { data } = await loginUser({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input name="email" type="email" onChange={handleChange} placeholder="Your email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Your password" />
      <button type="submit">Login</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default LoginForm;
