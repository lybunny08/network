import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { auth } from '../helper/requests';

const Login = ({ callback }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const response = await auth(email, password);
    
    if (response.error) {
      setError(response.error);
    } else {
      setUser(response);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('userName', user.userName);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('token', user.token);

      callback(true);
    } else if (error) {
      callback(false);
      console.error(error);
    }
  }, [user, error, callback]);

  return (
    <Container className="align-items-center justify-content-center mx-5">
      <div className="login-form bg-white p-4 border rounded mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Connexion</h2>
        <Form onSubmit={handleLogin}>
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
