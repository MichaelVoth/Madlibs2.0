import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.clear() ;
        navigate("/login");
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/users/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
    }, []);

    return (
        <div>
            <h2>Users List</h2>
            <button onClick={logout}>Logout</button>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
