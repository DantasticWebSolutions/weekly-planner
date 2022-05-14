import React, { useState } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FcTodoList } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
// import Profile from "./authentication/Profile";

export default function NavbarComponent() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [expanded] = useState(false);
  const { currentUser } = useAuth();
  return (
    <Navbar
      bg='light'
      expand='sm'
      expanded={expanded}
      style={{
        position: 'fixed',
        bottom: '0',
        width: '100vw',
      }}>
      {/* <Navbar.Brand as={Link} to="/">
        Student Hub
      </Navbar.Brand> */}

      <Nav className='w-100 d-flex flex-row align-items-center justify-content-around'>
        <Nav.Link as={Link} to='/'>
          Home
        </Nav.Link>
        <Nav.Link as={Link} to='/weekly-planner'>
          Weekly Planner
        </Nav.Link>
        <Nav.Link as={Link} to='/shopping-list'>
          Shopping List
        </Nav.Link>
        <Nav.Link as={Link} to='/profile'>
          Profile
        </Nav.Link>
      </Nav>

      {/* <Navbar.Toggle
        // onClick={() => setExpanded(expanded ? false : "expanded")}
        onClick={handleShow}
        expand={false}
        aria-controls='responsive-navbar-nav'
      /> */}

      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Hello {currentUser.email}</Offcanvas.Title>
        </Offcanvas.Header>
        <div className='flexCol'>
          <Offcanvas.Body className=' menuItemsContainer'>
            <Nav.Link as={Link} to='/chat'>
              <div className='menuProperty'>
                <div className='weatherPropertyDesc '>
                  <FcTodoList />
                  <span>Chat</span>
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to='/drive'>
              <div className='menuProperty'>
                <div className='weatherPropertyDesc '>
                  <FcTodoList />
                  <span>Drive</span>
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to='/todo'>
              <div className='menuProperty'>
                <div className='weatherPropertyDesc '>
                  <FcTodoList />
                  <span>Todo</span>
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to='/user'>
              <div className='menuProperty'>
                <div className='weatherPropertyDesc '>
                  <FcTodoList />
                  <span>Profile</span>
                </div>
              </div>
            </Nav.Link>
            {/* <Profile /> */}
          </Offcanvas.Body>
        </div>
      </Offcanvas>
    </Navbar>
  );
}
