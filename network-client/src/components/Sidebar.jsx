import React from 'react';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LinkContainer } from 'react-router-bootstrap';
import { FaHome, FaSearch, FaCompass, FaRegPlayCircle, FaRegPaperPlane, FaRegHeart, FaRegPlusSquare, FaRegUserCircle, FaEllipsisH } from 'react-icons/fa';

const Sidebar = ({ handleShowModal }) => {
  return (
    <div className="d-flex flex-column border-end">
      <Nav className="flex-column mt-4">
        <span className="fw-bold fs-4 mx-4 mb-4 text-dark">Network</span>
        <LinkContainer to="/">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaHome className="me-3" style={{ fontSize: '25px' }} /> Home
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/search">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaSearch className="me-3" style={{ fontSize: '25px' }} /> Search
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/discover">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaCompass className="me-3" style={{ fontSize: '25px' }} /> Discover
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/reels">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaRegPlayCircle className="me-3" style={{ fontSize: '25px' }} /> Reels
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/messages">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaRegPaperPlane className="me-3" style={{ fontSize: '25px' }} /> Messages
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/notifications">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaRegHeart className="me-3" style={{ fontSize: '25px' }} /> Notifications
          </Nav.Link>
        </LinkContainer>
        <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5" onClick={handleShowModal}>
          <FaRegPlusSquare className="me-3" style={{ fontSize: '25px' }} /> Create
        </Nav.Link>
        <LinkContainer to="/profil">
          <Nav.Link className="d-flex align-items-center text-dark mb-3 mx-3 pe-5">
            <FaRegUserCircle className="me-3" style={{ fontSize: '25px' }} /> Profil
          </Nav.Link>
        </LinkContainer>
        <Nav.Link className="d-flex align-items-center text-dark  mx-3 pe-3">
          <FaEllipsisH className="me-3" style={{ fontSize: '25px' }} /> Plus
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
