import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const PrivateRoute = ({ Component }) => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  return currentUser ? (
    <div>
      <div style={{ marginBottom: '100px' }}>
        <Component />
      </div>
      <Navbar />
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default PrivateRoute;

// import React, { Component } from 'react';
// // import { Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// export default function PrivateRoute({ component: Component, ...rest }) {
//   const { currentUser } = useAuth();
//   const location = useLocation();
//   return (
//     <Route
//       render={(props) => {
//         return currentUser ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to='/login' state={{ from: location }} />
//         );
//       }}></Route>
//   );
// }
