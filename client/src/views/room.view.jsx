import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from '../components/room/userList';
import Logout from '../components/login&Register/logout';

import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';


const RoomView = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const { roomID } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const navigate = useNavigate();

    const leaveRoom = () => {
        axios.post('http://localhost:3001/api/room/leave', { roomID: roomID, userID: user.id }, { withCredentials: true })
            .then(res => {
                socket.emit('LEAVE_ROOM_REQUEST', res.data.roomID, (response) => {
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
                setUsersInRoom(res.data);
                setUsernames(res.data.map(user => user.username));
            })
            .catch(err =>
                console.log(err));

        socket.on('UPDATE_USERS_IN_ROOM', (results) => {
            setUsersInRoom(results);
            const usernames = results.map(user => user.username);
            setUsernames(usernames);
        });

        return () => {
            socket.off('UPDATE_USERS_IN_ROOM');
        };
    }, [socket, roomID]);

    return (
        <div>
            <h2>Room View: {roomID} </h2>
            <p>Welcome {user && user.username}</p>
            <UserList usersInRoom={usersInRoom} />
            <button onClick={leaveRoom}>Leave Room</button>
            <Logout />
        </div>
    )
}

export default RoomView;
