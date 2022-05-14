import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';
import SignInGoogle from './SignInGoogle';
import SignInFacebook from './SignInFacebook';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // async function signInWithGoogle() {
  //   try {
  //     setError("");
  //     setLoading(true);
  //     await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  //     history.push("/");
  //   } catch {
  //     setError("Failed to log in with Google");
  //   }
  // }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (errorLogin) {
      setError(`Failed to log in: ${errorLogin.message}`);
    }

    setLoading(false);
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email' className='mb-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required />
            </Form.Group>
            <Form.Group id='button'>
              <Button disabled={loading} className='w-100 mt-4' type='submit'>
                Log In
              </Button>
            </Form.Group>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <hr style={{ width: '40%' }} />
        or
        <hr style={{ width: '40%' }} />
      </div>
      <br />
      <SignInGoogle />
      <hr />
      <SignInFacebook />
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={signInWithGoogle}
          style={{
            border: "none",
            background: "transparent",
            width: "80%",
            outline: "none",
          }}
        >
          <img
            style={{ border: "none", background: "transparent", width: "100%" }}
            src={signInWithGooglePng}
            alt="Sign In With Google"
          />
        </button>
      </div> */}
    </CenteredContainer>
  );
}
