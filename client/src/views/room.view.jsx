import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
                console.log(res);
                navigate('/loggedIn');
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/api/room/${roomID}?socketID=${socket.id}`, { withCredentials: true })
            .then(res => {
                console.log(res);
            })
            .catch(err =>
                console.log(err));

        socket.on('UPDATE_USERS_IN_ROOM', (results) => {
            setUsersInRoom(results);
            console.log("Users in room: ", results);
            const usernames = results.updatedUsers.map(user => user.username);
            console.log("Usernames: ", usernames);
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

            <h3>Users in room</h3>
            <ul>
                {usernames.map((username, i) => <li key={i}>{username}</li>)}
            </ul>
            <button onClick={leaveRoom}>Leave Room</button>
            <Logout />
        </div>
    )
}

export default RoomView;
