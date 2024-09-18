import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '@graphql/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [addUser] = useMutation(ADD_USER);
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input name="username" type="text" onChange={handleChange} placeholder="Your username" />
      <input name="email" type="email" onChange={handleChange} placeholder="Your email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Your password" />
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;