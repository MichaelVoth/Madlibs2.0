
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from './login&Register/logout.jsx';
import ProfileCard from './profileCard.jsx';
import UniversalInputForm from '../forms/UniversalInputForm.jsx';
import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';
import  Modal  from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import UserInfoDisplay from '../developerTools/userInfoDisplay.jsx';


const Dashboard = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleShow = () => setShow(true);
    const closeWithoutJoining = () => setShow(false);

    const createRoom = () => {
        axios.post('http://localhost:3001/api/room/create', 
            { socket: socket.id, 
            userID: user.id, 
            username: user.username, 
            avatar: user.avatar }, { withCredentials: true })
            .then(res => {
                navigate(`/loggedIn/room/${res.data.roomID}`);
            })
            .catch(err => console.log(err));
    }

    const joinRoomRequest = (roomID) => {
        axios.post('http://localhost:3001/api/room/join', { socket: socket.id, roomID: roomID, userID: user.id, username: user.username, avatar: user.avatar }, { withCredentials: true })
            .then(res => {
                navigate(`/loggedIn/room/${roomID}`);
            })
            .catch(err => console.log(err));
    }

    const randomRoomRequest = () => {
        axios.post('http://localhost:3001/api/room/random', { socket: socket.id, userID: user.id, username: user.username, avatar: user.avatar }, { withCredentials: true })
            .then(res => {
                navigate(`/loggedIn/room/${res.data.roomID}`);
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>
            <button onClick={createRoom}>Create Room</button>
            <button onClick={handleShow}>Join Room</button>

            <ProfileCard />
            <Logout />
            <UserInfoDisplay />
            <Modal show={show} onHide={closeWithoutJoining} >
                <Modal.Body>
                    <UniversalInputForm
                        setAction={joinRoomRequest}
                        placeHolder="Enter room code"
                        buttonLabel="Join"
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="w-100 text-center" variant="secondary" onClick={randomRoomRequest}>
                        Random
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dashboard;
