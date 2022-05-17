import React, { useRef, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import background from '../assets/background.jpg';
import SignInGoogle from './SignInGoogle';
import SignInFacebook from './SignInFacebook';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password');
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
        {message && <Alert variant='success'>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id='email'>
            <Form.Control
              className='login-input'
              placeholder='Email'
              type='email'
              ref={emailRef}
              required
            />
          </Form.Group>
          <div className='w-100 text-left mt-2'>
            Need an account?{' '}
            <Link to='/signup' className='link'>
              Sign Up
            </Link>
          </div>
          <button
            className='primary-button black mt-4'
            style={{ margin: '5px 0' }}
            disabled={loading}
            type='submit'>
            Reset Password
          </button>
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
