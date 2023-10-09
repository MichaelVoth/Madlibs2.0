import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logout from '../components/login&Register/logout';

import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';

const RoomView = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const { roomID } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);

    useEffect(() => {

        socket.emit('GET_USERS_IN_ROOM', roomID);

        socket.on('USER_JOINED_ROOM', (userID) => {
            setUsersInRoom(usersInRoom => [...usersInRoom, userID]); 
        });

        socket.on('USER_LEFT_ROOM', (userID) => {
            setUsersInRoom(prevUsers => prevUsers.filter(user => user !== userID));
        });

        socket.on('GET_USERS_IN_ROOM', (users) => {
            setUsersInRoom(users);
        });

        socket.on('UPDATE_USERS_IN_ROOM', (users) => {
            setUsersInRoom(users);
        });

        return () => {
            socket.off('USER_JOINED_ROOM');
            socket.off('USER_LEFT_ROOM');
            socket.off('GET_USERS_IN_ROOM');
            socket.off('UPDATE_USERS_IN_ROOM');
        };
    }, [socket]);

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
            <Logout />
        </div>
    )
}

export default RoomView;
