import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import styles from './Login.module.css'; // Import custom styles

export function Login() {
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      const { token, role } = response.data;

      // Updating auth state
      setAuth({
        token,
        role,
      });

      // Storing token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirecting to dashboard
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Login failed'
      );
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-form']}>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <div className={styles['text-link']}>
          <p>
            Don't have an account?{' '}
            <Button variant="link" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
