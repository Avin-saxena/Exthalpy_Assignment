import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Container, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../styles/Register.module.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //checking password length (between 8 and 12 characters)
    setPasswordLengthValid(password.length === 0 || (password.length >= 8 && password.length <= 12));
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordMatch) {
      setError("Passwords don't match");
      return;
    }

    if (!passwordLengthValid) {
      setError('Password must be between 8 and 12 characters');
      return;
    }

    try {
      await axios.post('/api/auth/register', { username, password, role });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed. Please try again later.'
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-form']}>
        <h2>Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isInvalid={!passwordLengthValid && password.length > 0}
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </InputGroup>
            <Form.Text className={passwordLengthValid || password.length === 0 ? 'text-muted' : 'text-danger'}>
              Password must be between 8 and 12 characters.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                isInvalid={!passwordMatch && confirmPassword !== ''}
              />
              <Button
                variant="outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={!passwordMatch || !passwordLengthValid}
          >
            Register
          </Button>
        </Form>

        <div className={styles['text-link']}>
          <p>
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
