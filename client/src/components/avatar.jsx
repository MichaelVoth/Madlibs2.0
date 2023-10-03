import React from "react";
import { useUserContext } from "../contexts/UserContext";
import blueAvatar from "../assets/blueAvatar.png";
import greenAvatar from "../assets/greenAvatar.png";
import orangeAvatar from "../assets/orangeAvatar.png";
import pinkAvatar from "../assets/pinkAvatar.png";
import purpleAvatar from "../assets/purpleAvatar.png";
import yellowAvatar from "../assets/yellowAvatar.png";

const Avatar = () => {

    const { user } = useUserContext(); //custom hook from UserContext.jsx

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
            {userAvatar && <img src={userAvatar.image} alt={userAvatar.color} />}
        </div>
    );
}

export default Avatar;