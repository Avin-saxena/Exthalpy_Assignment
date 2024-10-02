import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import styles from './NavigationBar.module.css'; // Import custom styles

function NavigationBar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clearing auth state
    setAuth({ token: null, role: null });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className={styles.navbar} sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles['navbar-brand']}>
          VideoApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {auth.token ? (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/dashboard" className={styles['nav-link']}>
                Dashboard
              </Nav.Link>
              <Button
                variant="danger"
                className={styles['logout-btn']}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className={styles['nav-link']}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className={styles['nav-link']}>
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
