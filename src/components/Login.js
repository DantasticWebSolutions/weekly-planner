import React, { useRef, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import SignInGoogle from './SignInGoogle';
import SignInFacebook from './SignInFacebook';
import background from '../assets/background.jpg';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className='login-container'>
      <div
        className='imageContainer'
        style={{ backgroundImage: `url(${background})` }}>
        {/* <img src="" alt=""> */}
        <div className='login-gradient-background'></div>
      </div>
      <div className='inside-login-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group id='email' className='mb-2'>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form.Control
              type='email'
              ref={emailRef}
              placeholder='Email'
              className='login-input'
              required
            />
          </Form.Group>
          <Form.Group id='password'>
            <Form.Control
              type='password'
              ref={passwordRef}
              placeholder='Password'
              className='login-input'
              required
            />
          </Form.Group>
          <div className='w-100 text-left mt-2 link'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
          <Form.Group id='button'>
            <div className='button-container no-margin'>
              <button
                disabled={loading}
                className='primary-button black mt-4'
                type='submit'
                style={{ margin: '5px 0' }}>
                Log In
              </button>
            </div>
          </Form.Group>
        </Form>

        <div className='w-100 text-center'>
          Need an account?{' '}
          <Link to='/signup' className='link'>
            Sign Up
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
