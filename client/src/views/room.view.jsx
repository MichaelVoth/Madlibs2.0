import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Logout from '../components/login&Register/logout';

import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';

const RoomView = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const { roomID } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);
    const navigate = useNavigate();

    const leaveRoom = () => {
        socket.emit('LEAVE_ROOM_REQUEST', roomID, user.id);
    }

    useEffect(() => {

        socket.on('UPDATE_USERS_IN_ROOM', (users) => {
            setUsersInRoom(users);
        });

        socket.on('LEAVE_ROOM_SUCCESS', () => {
            navigate('/loggedIn');
        });

        return () => {
            socket.off('UPDATE_USERS_IN_ROOM');
            socket.off('LEAVE_ROOM_SUCCESS');
        };
    }, [socket, roomID]);

    return (
        <div>
            <h2>Room View: {roomID} </h2>
            <p>Welcome {user && user.username}</p>

            <h3>Users in room</h3>
            <ul>
                {usersInRoom.map((userID, index) => { 
                    return <li key={index}>{userID}</li>;
                })}
            </ul>
            <button onClick={leaveRoom}>Leave Room</button>
            <Logout />
        </div>
    )
}

export default RoomView;
