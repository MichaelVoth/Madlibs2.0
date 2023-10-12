import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from './userCard';

const UserList = (props) => {
    const [usersInRoom, setUsersInRoom] = useState(props.usersInRoom);
    const navigate = useNavigate();

    return (
        <div>
            <h3>Users in room:</h3>
            <ul style={{ listStyleType: "none" }}>
                {usersInRoom.map((user) => (
                    <UserCard key={user.id} name={user.userName} color={user.avatar} />
                ))}
            </ul>
        </div>
    );
};

export default UserList;

