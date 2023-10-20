import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GamePrompts = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();

    const gameID = props.gameID;
    const [assignedPrompts, setAssignedPrompts] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/game/${gameID}`, { withCredentials: true })
            .then(res => {
                console.log("res.data", res.data);
                setAssignedPrompts(res.data.user.promptsAssigned);
            })
            
            .catch(err => console.log(err));
    }, []);


    return (
        <div>
            <h1>Game Prompts</h1>
        </div>
    )
}

export default GamePrompts;