
import React from 'react';
import Logout from './login&Register/logout.jsx';
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';
import blueAvatar from "../assets/blueAvatar.png";
import greenAvatar from "../assets/greenAvatar.png";
import orangeAvatar from "../assets/orangeAvatar.png";
import pinkAvatar from "../assets/pinkAvatar.png";
import purpleAvatar from "../assets/purpleAvatar.png";
import yellowAvatar from "../assets/yellowAvatar.png";

import ConsoleLog from './consoleLogData.jsx';


const Dashboard = () => {

    const { user, isActive, logout } = useUserContext(); //custom hook from UserContext.jsx
    const { socket } = useSocketContext(); 
    
    const avatarList = [ // List of avatars to choose from
        { color: "blue", image: blueAvatar },
        { color: "green", image: greenAvatar },
        { color: "orange", image: orangeAvatar },
        { color: "pink", image: pinkAvatar },
        { color: "purple", image: purpleAvatar },
        { color: "yellow", image: yellowAvatar },
    ];
    const userAvatar = avatarList.find(avatar => avatar.color === user.avatar);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>
            <p> Id: {user.id}</p>
            <p>You are active: {isActive ? "Yes" : "No"}</p>
            {userAvatar && <img src={userAvatar.image} alt={userAvatar.color} />}
            <p> Socket: {socket && socket.id}</p>

            <Logout />
            <Link to="/userlist">User List</Link>
            <ConsoleLog />
        </div>
    );
}

export default Dashboard;
