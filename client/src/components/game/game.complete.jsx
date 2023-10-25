import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameComplete = (props) => {
    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const {gameState, setGameState} = props;
    const [title, setTitle] = useState("");
    const [completedMadlib, setCompletedMadlib] = useState(null);
    const gameID = props.gameID;

    const handlePlayAgain = () => {
        socket.emit("PLAY_AGAIN", { roomID: roomID, username: user.username });
        setGameState("waiting");
    }
    useEffect(() => {
        axios.get(`http://localhost:3001/api/game/complete/${gameID}/room/${roomID}`, { withCredentials: true })
            .then((res) => {
                setCompletedMadlib(res.data.completedText);
                setTitle(res.data.title);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <h1>Game Complete</h1>
            <h2>{title}</h2>
            <p>{completedMadlib}</p>
            <button onClick={handlePlayAgain} >Play Again</button>

        </div>
    )

}

export default GameComplete;