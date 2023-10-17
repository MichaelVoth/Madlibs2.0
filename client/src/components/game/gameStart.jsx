import React from "react";
import useSocketContext from "../../contexts/SocketContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameStart = () => {

    const { roomId } = useParams();
    const { socket } = useSocketContext();

    const startGame = () => {
        axios.post(`http://localhost:3001/api/game/create/${roomId}`)
            .then(res => {
                console.log(res.data);
                socket.emit("START_GAME", { gameID: res.data.id }); 
                setGameState("loading");
            })
            .catch(err => console.log(err));
        }
    
    return (
        <div>
            <h1>Game Start</h1>
            <button onClick={startGame}>Start Game</button>
        </div>
    )
}

export default GameStart;