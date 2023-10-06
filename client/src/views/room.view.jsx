import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logout from '../components/login&Register/logout';

import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';


const RoomView = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const { roomCode } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('USER_JOINED_ROOM', {
            roomCode: roomCode,
            Id: user.id,
        
        });

        socket.on('JOIN_ROOM_ACCEPTED', (listOfUsers) => {
            console.log('List of users in room from server', listOfUsers);
            setUsersInRoom(listOfUsers);

            socket.on('JOIN_ROOM_DENIED', (result) => {
                console.log('room request denied.');
                navigate('/loggedIn');
            });
        });

        return () => {
            socket.off('JOIN_ROOM_ACCEPTED');
            socket.off('JOIN_ROOM_DENIED');
        };
    }, [socket]);

    return (
        <div>
            <h2>Room View</h2>
            <p>Welcome {user && user.username}</p>

            <h3>Users in room</h3>
            <ul>
                {usersInRoom.map((user, index) => (
                    <li key={index}>{user.username}</li>
                ))}
            </ul>
            <Logout />
        </div>
    )
}

export default RoomView;