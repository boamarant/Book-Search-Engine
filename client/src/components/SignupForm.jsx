import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '@graphql/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      // Ensure the token is being returned in the mutation response
      if (data && data.addUser && data.addUser.token) {
        Auth.login(data.addUser.token);
      } else {
        console.error('Token not found in the response');
      }
    } catch (e) {
      console.error('Signup error:', e); // Improve error logging
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
      {error && <div>Signup failed</div>} {/* Handle error display */}
    </div>
  );
};

export default SignupForm;