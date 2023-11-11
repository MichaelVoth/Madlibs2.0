
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    console.log(socket)
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleShow = () => setShow(true);
    const closeWithoutJoining = () => setShow(false);

    const createRoom = () => {

        axios.post('http://localhost:3001/api/room/create', 
            {   userID: user.id, 
                username: user.username, 
                avatar: user.avatar,
                socketID: socket.id },
                { withCredentials: true })
            .then(res => {
                socket.emit('JOIN_ROOM_REQUEST', res.data.roomID, user.username, (response) => {
                    if (response.status === 'success') {
                        navigate(`/loggedIn/room/${res.data.roomID}`);
                    } else {
                        console.log(response.message);
                    }
                });
            })
            .catch(err => console.log(err));
    }

    const joinRoomRequest = (roomID) => {
        axios.post('http://localhost:3001/api/room/join', 
            {   roomID: roomID, 
                userID: user.id, 
                username: user.username,
                avatar: user.avatar,
                socketID: socket.id }, 
                { withCredentials: true })
            .then(res => {
                socket.emit('JOIN_ROOM_REQUEST', roomID, user.username, (response) => {
                    if (response.status === 'success') {
                        navigate(`/loggedIn/room/${roomID}`);
                    } else {
                        console.log(response.message);
                    }
                });
            })
            .catch(err => console.log(err));
    }

    const randomRoomRequest = () => {
        axios.post('http://localhost:3001/api/room/random', 
        {   userID: user.id, 
            username: user.username, 
            avatar: user.avatar,
            socketID: socket.id },
            { withCredentials: true })
            .then(res => {
                socket.emit('JOIN_ROOM_REQUEST', res.data.roomID, user.username, (response) => {
                    if (response.status === 'success') {
                        navigate(`/loggedIn/room/${res.data.roomID}`);
                    } else {
                        console.log(response.message);
                    }
                });
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>
            <Link to="/loggedIn/madlib/create">Create Madlib</Link>
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
