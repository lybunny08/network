import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Remplacez par le chemin de votre logo

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      onLogin(); // Appelez la fonction onLogin pour mettre à jour l'état de connexion
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="w-500">
        <Col xs={12} md={6} className="d-none d-md-flex align-items-center justify-content-center">
          <Image src={logo} fluid />
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <div className="login-form bg-white p-4 border rounded w-100" style={{ maxWidth: '400px' }}>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
