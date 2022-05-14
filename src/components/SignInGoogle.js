import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import signInWithGooglePng from './signInWithGoogle.png';

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <button
          onClick={signInWithGoogleHandler}
          style={{
            border: 'none',
            background: 'transparent',
            width: '80%',
            outline: 'none',
          }}>
          <img
            style={{ border: 'none', background: 'transparent', width: '100%' }}
            src={signInWithGooglePng}
            alt='Sign In With Google'
          />
        </button>
        {error && <Alert variant='danger'>{error}</Alert>}
      </div>
    </>
  );
}
