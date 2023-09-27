import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.clear() ;
        navigate("/login");
    }


    return (
        <div>
            <h2>Dashboard</h2>
            <p>Token: {token}</p>
            <button onClick={logout}>Logout</button>

            <Link to="/userlist">User List</Link>
        </div>
    );
}

export default Dashboard;
