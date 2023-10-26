import React from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameStart = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();

    const startGame = () => {
        axios.post(`http://localhost:3001/api/game/create/${roomID}`,{},{ withCredentials: true })
            .then(res => {
                socket.emit("START_GAME", { gameID: res.data.gameID, roomID: roomID, username: user.username }); 
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