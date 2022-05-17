import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { BsGoogle } from 'react-icons/bs';

export default function SignInGoogle() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function signInWithGoogleHandler() {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (googleError) {
      setError(googleError.message);
    }
  }

  return (
    <>
      <button
        onClick={signInWithGoogleHandler}
        className='primary-button white'
        style={{ marginBottom: '10px' }}>
        <BsGoogle className='login-icon' />
        <span>Continue with Google</span>
      </button>
      {error && <Alert variant='danger'>{error}</Alert>}
    </>
  );
}
