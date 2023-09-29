import axios from 'axios';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import blueAvatar from "../assets/blueAvatar.png";
import greenAvatar from "../assets/greenAvatar.png";
import orangeAvatar from "../assets/orangeAvatar.png";
import pinkAvatar from "../assets/pinkAvatar.png";
import purpleAvatar from "../assets/purpleAvatar.png";
import yellowAvatar from "../assets/yellowAvatar.png";


const Dashboard = () => {

    const navigate = useNavigate();

    const { user, isActive, setIsActive } = useContext(UserContext);
    
    const avatarList = [ // List of avatars to choose from
        { color: "blue", image: blueAvatar },
        { color: "green", image: greenAvatar },
        { color: "orange", image: orangeAvatar },
        { color: "pink", image: pinkAvatar },
        { color: "purple", image: purpleAvatar },
        { color: "yellow", image: yellowAvatar },
    ];
    const userAvatar = avatarList.find(avatar => avatar.color === user.avatar);



    const logout = () => {
        sessionStorage.clear();
        setIsActive(false);
        axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
        navigate("/login");
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>
            <p> Id: {user.id}</p>
            <p>You are active: {isActive ? "Yes" : "No"}</p>
            {userAvatar && <img src={userAvatar.image} alt={userAvatar.color} />}

            <button onClick={logout}>Logout</button>
            <Link to="/userlist">User List</Link>
        </div>
    );
}

export default Dashboard;
