import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateUserPassword, updateEmail } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value.length < 6) {
      return (
        setError('Your password must be at least 6 characters '),
        setLoading(false)
      );
    }
    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    try {
      setError('');
      setLoading(true);

      Promise.all(promises);
      navigate('/');
    } catch {
      setError('Failed to update an account');
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email' className='mb-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id='password' className='mb-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                ref={passwordRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <Form.Group id='password-confirm' className='mb-2'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type='password'
                ref={passwordConfirmRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <Button
              disabled={loading}
              className='w-100 mt-2 mb-2'
              type='submit'>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link to='/'>Cancel</Link>
      </div>
    </>
  );
}
