import React from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameStart = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();

    const startGame = () => {
        axios.post(`http://localhost:3001/api/game/create/${roomID}`), { withCredentials: true}
            .then(res => {
                console.log(res.data);
                socket.emit("START_GAME", { gameID: res.data._id }); 
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