import React from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Remplacez par le chemin de votre logo

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique d'inscription
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="w-500">
        <Col xs={12} md={6} className="d-none d-md-flex align-items-center justify-content-center">
          <Image src={logo} fluid />
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <div className="register-form bg-white p-4 border rounded w-100" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Inscription</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control type="email" placeholder="Adresse e-mail" />
              </Form.Group>
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <Form.Control type="text" placeholder="Nom d'utilisateur" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                S'inscrire
              </Button>
            </Form>
            <p className="text-center">
              Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
