import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ImFacebook2 } from 'react-icons/im';

export default function SignInFacebook() {
  const { signInWithFacebook } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function signInWithFacebookHandler() {
    try {
      setError('');
      await signInWithFacebook();
      navigate('/');
    } catch (facebookError) {
      setError(facebookError.message);
    }
  }

  return (
    <>
      <button
        onClick={signInWithFacebookHandler}
        className='primary-button white no-margin'
        style={{ marginBottom: '10px !important' }}>
        <ImFacebook2 className='login-icon' />
        <span>Continue with Facebook</span>
      </button>
      {error && <Alert variant='danger'>{error}</Alert>}
    </>
  );
}
