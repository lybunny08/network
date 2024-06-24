import React, {useEffect} from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import img4 from '../assets/img4.png';
import { useNavigate } from 'react-router-dom';

import { getUser } from '../helper/requests';

const Profil = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser(localStorage.getItem('userId'));

      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response);
      }
    }

    fetchUser();
  }, []);

  // Vérifiez si user est défini
  const userName = user?.userName || 'Nom inconnu';

  return (
    <Container className="pb-5">
      <Row className="justify-content-start">
        <Col xs={12}>
          <div className="d-flex mb-5 mx-8">
            <Image
              src={img4} // Replace with user's profile image
              roundedCircle
              width={150}
              height={150}
              className="mr-3"
            />
            <div className="flex-grow-1 mx-5">
              <div className="d-flex align-items-center justify-content-start mb-3">
                <span>{userName}</span> {/* Display user's first and last name */}
                <Button variant="outline-secondary" className="mx-5">
                  Modifier le profil
                </Button>
                <Button variant="outline-secondary" onClick={handleLogoutClick}>
                  Déconnexion
                </Button>
              </div>
              <div className="d-flex mb-4">
                <span>
                  <strong>0</strong> publications
                </span>
                <span className="mx-5">
                  <strong>75</strong> followers
                </span>
                <span>
                  <strong>149</strong> suivi(e)s
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <hr className="custom-hr mt-4 mb-3" />
          <div className="d-flex justify-content-start border-top pt-5">
            <div className="d-flex flex-wrap">
              <div className="p-2">
                <Image src={img4} thumbnail style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profil;
