import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { signup } from '../helper/requests';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères');
      return;
    }
    
    await signup({ firstName, lastName, birthDate, email, password });
    
    navigate('/login');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100 mx-5">
      <div className="register-form bg-white p-4 border rounded w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Créer un compte</h2>
        <Form onSubmit={handleRegister}>
        <Form.Group controlId="formLastName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFirstName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBirthDate" className="mb-3">
            <Form.Control
              type="date"
              placeholder="Date de naissance"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </Form.Group>
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
          <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" type="submit" className="w-100 mb-3">
            S'inscrire
          </Button>
        </Form>
        <p className="text-center">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </Container>
  );
};

export default Register;
