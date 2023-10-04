import React from "react";  
import { useUserContext } from "../contexts/UserContext.jsx";
import Avatar from "./avatar.jsx";

const ProfileCard = () => {
    const { user } = useUserContext();
    return (
        <div>
            <h2>Profile Card</h2>
            <Avatar/>
            <p>Username: {user && user.username}</p>
            <p>Email: {user && user.email}</p>
            <p>Bio: {user && user.bio}</p>
            <a href="/user/editProfile">Edit Profile</a>
            <a href="/user/friends">Friends</a>
            <a href="/user/savedMadlibs">Saved Madlibs</a>

        </div>
    );
}

export default ProfileCard;