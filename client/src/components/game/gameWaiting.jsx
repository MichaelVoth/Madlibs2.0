
import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameWaiting = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const { gameState, setGameState } = props;
    const gameID = props.gameID;

    //Get new prompts when another user is inactive
    useEffect(() => {
        socket.on("GET_NEW_PROMPTS")
            setGameState("inProgress");
    }, [socket]);

    return (
        <div>
            <h1>Game Waiting</h1>
        </div>
    )

}

export default GameWaiting;