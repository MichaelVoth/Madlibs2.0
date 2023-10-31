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
        socket.emit('NEW_MESSAGE_SENT', { 
            username: user.username,
            content: "Play again?",
            roomID: roomID,
            messageType: "vote"
        });
        setGameState("waiting");
    }
    return (
        <div>
            <h1>Game Abandoned</h1>
            <button onClick={handlePlayAgain} >Play Again</button>
        </div>
    )
}

export default GameAbandoned;