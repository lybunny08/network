// Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      // Assuming response.data.user contains firstName and lastName
      onLogin(response.data.user); // Pass user data to onLogin function
      localStorage.setItem('token', response.data.token); // Store the JWT token
    } catch (err) {
      setError('Invalid credentials');
    }
  };
  

  return (
    <Container className="align-items-center justify-content-center mx-5">
          <div className="login-form bg-white p-4 border rounded mx-auto" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Connexion</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Se connecter
              </Button>
            </Form>
            <p className="text-center">
              Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
            </p>
          </div>
    </Container>
  );
};

export default Login;
