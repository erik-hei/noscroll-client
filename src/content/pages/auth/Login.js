// Packages
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

export default function Login(props) {
  // Declare and initialize state variables
  let [email, setEmail] = useState('')
  let [message, setMessage] = useState('')
  let [password, setPassword] = useState('')

  useEffect(() => {
    setMessage('')
  }, [email, password]);

  // Event handlers
  const handleSubmit = e => {
    e.preventDefault();
    // make a fetch request to the get rout of the server to check for authentication
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // setMessage to error if not authenticated
      if (!response.ok) {
        setMessage(`${response.status}: ${response.statusText}`);
        return;
      }
      // if authenticated, updateUser + redirect to profile
      response.json().then(result => {
        props.updateUser(result.token);
      })
    }).catch(err => {
      console.log(err);
      setMessage(`${err.toString()}`);
    })
  }
  
  if (props.user) {
    return <Redirect to='/profile' />
  }

  return (
    <div className="form-background">
      <h2 className="form-title">Login</h2>
      <span className="red">{message}</span>
      <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" name="email" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="form-button" type="submit">Sign in!</button>
        </form>
    </div>
  )
}

