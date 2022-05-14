import React from 'react';
import Signup from './Signup';
// import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Profile';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import Home from '../views/Home';
import Recipe from '../views/Recipe';
import CookRecipe from '../views/CookRecipe';
import ShoppingList from '../views/ShoppingList';
import WeeklyPlanner from '../views/WeeklyPlanner';

function App() {
  return (
    <div
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '100vh' }}>
      <div
        className='w-100'
        // style={{ maxWidth: '400px' }}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<PrivateRoute Component={Home} />} />
              {/* Authentication */}
              <Route
                path='/profile'
                element={<PrivateRoute Component={Dashboard} />}
              />
              <Route
                path='/update-profile'
                element={<PrivateRoute Component={UpdateProfile} />}
              />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              {/* Recipes */}
              <Route
                path={`/recipe/:recipeId`}
                element={<PrivateRoute Component={Recipe} />}
              />
              <Route
                path={`/recipe/:recipeId/step/:stepId`}
                element={<PrivateRoute Component={CookRecipe} />}
              />
              <Route
                path={`/shopping-list`}
                element={<PrivateRoute Component={ShoppingList} />}
              />
              <Route
                path={`/weekly-planner`}
                element={<PrivateRoute Component={WeeklyPlanner} />}
              />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}

export default App;
