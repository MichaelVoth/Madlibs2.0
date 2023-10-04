
import React from 'react';
import Logout from './login&Register/logout.jsx';
import ProfileCard from './profileCard.jsx';
import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';


import UserInfoDisplay from '../developerTools/userInfoDisplay.jsx';


const Dashboard = () => {

    const { user, isActive } = useUserContext();
    const { socket } = useSocketContext(); 
    
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>

            <ProfileCard />
            <Logout />
            <UserInfoDisplay />
        </div>
    );
}

export default Dashboard;
