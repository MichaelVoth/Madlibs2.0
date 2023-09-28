import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx'; // Import UserContext

const Dashboard = () => {

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const { user } = useContext(UserContext); // Access user object from context

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.clear();
        axios.post('http://localhost:3001/api/users/logout', {
        })
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
            <p>Welcome {user && user.username}</p> {/* Display the user's username */}
            <p>Token: {token}</p>
            <button onClick={logout}>Logout</button>
            <Link to="/userlist">User List</Link>
        </div>
    );
}

export default Dashboard;
