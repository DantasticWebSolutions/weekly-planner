import React, { useRef, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/background.jpg';
import SignInGoogle from './SignInGoogle';
import SignInFacebook from './SignInFacebook';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    if (passwordRef.current.value.length < 6) {
      return setError('Your password must be at least 6 characters ');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      console.log(
        emailRef.current.value,
        passwordRef.current.value,
        passwordRef.current.value.length
      );
      navigate('/');
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <div className='login-container'>
      <div
        className='imageContainer'
        style={{ backgroundImage: `url(${background})` }}>
        {/* <img src="" alt=""> */}
        <div className='login-gradient-background'></div>
      </div>
      <div className='inside-login-container'>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id='email' className='mb-2'>
            <Form.Control
              className='login-input'
              placeholder='Email'
              type='email'
              ref={emailRef}
              required
            />
          </Form.Group>
          <Form.Group id='password' className='mb-2'>
            <Form.Control
              placeholder='Password'
              className='login-input'
              type='password'
              ref={passwordRef}
              required
            />
          </Form.Group>
          <Form.Group id='password-confirm'>
            <Form.Control
              placeholder='Confirm Password'
              className='login-input'
              type='password'
              ref={passwordConfirmRef}
              required
            />
          </Form.Group>
          <Form.Group>
            <button
              disabled={loading}
              type='submit'
              className='primary-button black mt-4'
              style={{ margin: '5px 0' }}>
              Sign Up
            </button>
          </Form.Group>
        </Form>
        <div className='w-100 text-center mt-2'>
          Already have an account?{' '}
          <Link to='/login' className='link'>
            Log In
          </Link>
        </div>
        <div
          className='button-container no-margin flex-column'
          style={{ margin: '0 !important' }}>
          <SignInGoogle />
        </div>
        <div
          className='button-container no-margin flex-column'
          style={{ margin: '0 !important' }}>
          <SignInFacebook />
        </div>
      </div>
    </div>
  );
}
