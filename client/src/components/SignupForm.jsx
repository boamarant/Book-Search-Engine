import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '@graphql/mutations';
import Auth from '../utils/auth'; // Ensure this is the correct path

const SignupForm = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token); // Make sure this is the correct function call
    } catch (e) {
      console.error('Signup error:', e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Your username"
          value={formState.username}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={formState.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="******"
          value={formState.password}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div>Signup failed</div>}
    </div>
  );
};

export default SignupForm;