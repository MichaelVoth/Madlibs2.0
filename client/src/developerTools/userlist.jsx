import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // console.log(`Fetching users..., token: ${token}`);
        axios.get('http://localhost:3001/api/users/all', { withCredentials: true })
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
