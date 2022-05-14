import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          onClick={signInWithFacebookHandler}
          // style={{
          //   border: "none",
          //   background: "transparent",
          //   width: "80%",
          //   outline: "none",
          // }}
        >
          Sign in with Facebook
        </Button>
        {error && <Alert variant='danger'>{error}</Alert>}
      </div>
    </>
  );
}
