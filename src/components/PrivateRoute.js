import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const PrivateRoute = ({ Component }) => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  return currentUser ? (
    <div>
      <div style={{ marginBottom: '140px' }}>
        <Component />
      </div>
      <Navbar />
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default PrivateRoute;
