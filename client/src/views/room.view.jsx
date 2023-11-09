import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from '../components/room/userList';
import ChatBox from '../components/chat/chatbox.jsx';
import GameBoard from '../components/game/gameboard';
import Logout from '../components/login&Register/logout';

import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const RoomView = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const { roomID } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const [gamesInRoom, setGamesInRoom] = useState([])
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate();

    const leaveRoom = () => {
        axios.post('http://localhost:3001/api/room/leave', { roomID: roomID, userID: user.id }, { withCredentials: true })
            .then(res => {
                socket.emit('LEAVE_ROOM_REQUEST', res.data.roomID, user.username, (response) => {
                    if (response.status === 'success') {
                        navigate('/loggedIn');
                    } else {
                        console.log("Fail", response.message);
                    }
                });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/api/room/${roomID}`, { withCredentials: true })
            .then(res => {
                setUsersInRoom(res.data.updatedUsers);
                setGamesInRoom(res.data.gamesInRoom)
                setLoaded(true)
            })
            .catch(err =>
                console.log(err));

        socket.on('UPDATE_USERS_IN_ROOM', (results) => {
            setUsersInRoom(results);
        });

        return () => {
            socket.off('UPDATE_USERS_IN_ROOM');
        };
    }, [socket, roomID]);

    return (
        <div>
            <Row>
                <h2>Room View: {roomID} </h2>
                <p>Welcome {user && user.username}</p>
                <Col>
                    {loaded && <GameBoard gamesInProgress={gamesInRoom}/>}
                </Col>
                <Col>
                    <ChatBox />
                    <UserList usersInRoom={usersInRoom} />
                    <button onClick={leaveRoom}>Leave Room</button>
                    <Logout />
                </Col>
            </Row>
        </div>
    )
}

export default RoomView;
