import React, { useRef, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateUserPassword, updateEmail, logout } = useAuth();
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

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }
  return (
    <>
      <div className='update-profile-container'>
        <div>
          <div className='user-photo-container'>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt='user'
                className='user-photo'
              />
            ) : (
              <AiOutlineUser className='user-photo' />
            )}
          </div>
          <div className='title'>
            <h2 className='text-center mb-5'>
              {currentUser.displayName
                ? currentUser.displayName
                : currentUser.email}
            </h2>
          </div>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email' className='mb-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                ref={emailRef}
                required
                defaultValue={currentUser.email}
                className='update-profile-input'
              />
            </Form.Group>
            <Form.Group id='password' className='mb-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                className='update-profile-input'
                type='password'
                ref={passwordRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <Form.Group id='password-confirm' className='mb-2'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type='password'
                className='update-profile-input'
                ref={passwordConfirmRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <div className='button-container margin-5 margin-top-10'>
              <button
                disabled={loading}
                className='secondary-button black'
                type='submit'>
                Update
              </button>
            </div>
            <div className='button-container margin-5'>
              <button className='primary-button' onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
