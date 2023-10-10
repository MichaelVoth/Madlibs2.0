
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        socket.emit('CREATE_ROOM_REQUEST', user.id);
    }

    const joinRoomRequest = (roomID) => {
        socket.emit('JOIN_ROOM_REQUEST', roomID, user.id);
    }

    const randomRoomRequest = () => {
        socket.emit('RANDOM_ROOM_REQUEST', user.id);
    }

    useEffect(() => {
        socket.on('CREATE_ROOM_SUCCESS', (roomId) => {
            // console.log('Room Created: ', roomId);
            navigate(`/loggedIn/room/${roomId}`);
        })

        socket.on('CREATE_ROOM_FAILURE', (err) => {
            console.log(err);
        })

        socket.on('JOIN_ROOM_SUCCESS', (roomId) => {
            navigate(`/loggedIn/room/${roomId}`);
        })

        socket.on('JOIN_ROOM_FAILURE', (err) => {
            console.log(err);
        })

        socket.on('RANDOM_ROOM_SUCCESS', (roomId) => {
            navigate(`/loggedIn/room/${roomId}`);
        })

        socket.on('RANDOM_ROOM_FAILURE', (err) => {
            console.log(err);
        })

        return () => {
            socket.off('CREATE_ROOM_SUCCESS');
            socket.off('CREATE_ROOM_FAILURE');
            socket.off('JOIN_ROOM_SUCCESS');
            socket.off('JOIN_ROOM_FAILURE');
            socket.off('RANDOM_ROOM_SUCCESS');
            socket.off('RANDOM_ROOM_FAILURE');

        }
    }, [socket])


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
