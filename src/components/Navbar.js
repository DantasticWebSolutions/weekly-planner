import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoHome } from 'react-icons/go';
import { AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { BsCalendarCheck } from 'react-icons/bs';

export default function NavbarComponent() {
  const [expanded] = useState(false);
  const { currentUser } = useAuth();

  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split('/');
  return (
    <Navbar
      // bg='light'
      className='navbar'
      expand='sm'
      expanded={expanded}
      style={{
        position: 'fixed',
        bottom: '0',
        width: '100vw',
      }}>
      <Nav className='w-100 d-flex flex-row align-items-center justify-content-around'>
        <Nav.Link as={Link} to='/'>
          <div
            className={`navbar-link ${
              splitLocation[1] === '' ? 'active' : ''
            }`}>
            <GoHome className='navbar-icon' />
            Home
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to='/weekly-planner'>
          <div
            className={`navbar-link ${
              splitLocation[1] === 'weekly-planner' ? 'active' : ''
            }`}>
            <BsCalendarCheck className='navbar-icon smaller-font' />
            Planner
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to='/shopping-list'>
          <div
            className={`navbar-link ${
              splitLocation[1] === 'shopping-list' ? 'active' : ''
            }`}>
            <AiOutlineShoppingCart className='navbar-icon' />
            Grocery
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to='/update-profile'>
          <div
            className={`navbar-photo-container ${
              splitLocation[1] === 'update-profile' ? 'active' : ''
            }`}>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt='user'
                className='navbar-photo'
              />
            ) : (
              <AiOutlineUser className='navbar-icon' />
            )}
            Profile
          </div>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
