import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import blueAvatar from "../assets/blueAvatar.png";
import greenAvatar from "../assets/greenAvatar.png";
import orangeAvatar from "../assets/orangeAvatar.png";
import pinkAvatar from "../assets/pinkAvatar.png";
import purpleAvatar from "../assets/purpleAvatar.png";
import yellowAvatar from "../assets/yellowAvatar.png";

const AvatarModal = ({ show }) => {

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  const avatarList = [ // List of avatars to choose from
    { color: "blue", image: blueAvatar },
    { color: "green", image: greenAvatar },
    { color: "orange", image: orangeAvatar },
    { color: "pink", image: pinkAvatar },
    { color: "purple", image: purpleAvatar },
    { color: "yellow", image: yellowAvatar },
  ];

  const handleAvatarClick = async (color) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/users/${user.id}`, {
        avatar: color
      }, { withCredentials: true });
      if (response.status === 200) { 
        setUser(prevUser => ({ ...prevUser, avatar: color }));
        navigate("/dashboard");
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title>Choose an avatar:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-center">
          <Col id="avatar-list">
            {avatarList.map((avatar, index) => {
              return (
                <img
                  key={index}
                  className="m-2"
                  style={{ width: "100px", height: "100px" }}
                  src={avatar.image}
                  onClick={() => handleAvatarClick(avatar.color)}
                />
              );
            })}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AvatarModal;
