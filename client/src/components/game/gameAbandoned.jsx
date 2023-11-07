import React from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";

const GameAbandoned = () => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const {gameState, setGameState} = props;
    const gameID = props.gameID;

    const handlePlayAgain = () => {
        axios.post(`http://localhost:3001/api/game/create/${roomID}`,{},{ withCredentials: true })
        .then(res => {
            socket.emit('NEW_MESSAGE_SENT', { 
                username: user.username,
                content: "Play again?",
                roomID: roomID,
                gameID: res.data.gameID,
                messageType: "vote",
                voteType: "playAgain"
            });
        })
    }
    return (
        <div
        id="gameBoard"
        className="d-flex align-items-center justify-content-center border rounded">
            <h1>Game Abandoned</h1>
            <button onClick={handlePlayAgain} >Play Again</button>
        </div>
    )
}

export default GameAbandoned;