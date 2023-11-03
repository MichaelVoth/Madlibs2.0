import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext.jsx';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import { useParams } from 'react-router-dom';
import GameStart from './gameStart.jsx';
import GameLoading from './gameLoading.jsx';
import GamePrompts from './gamePrompts.jsx';
import GameWaiting from './gameWaiting.jsx';
import GameComplete from './gameComplete.jsx';
import GameAbandoned from './gameAbandoned.jsx';


const GameBoard = (props) => {

    const {roomID}  = useParams();
    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const [gameState, setGameState] = useState("notStarted");
    const [gameID, setGameID] = useState(null);


    useEffect(() => {
        socket.on("GAME_CREATED", (gameID) => {
            console.log("GAME_CREATED", gameID);
            socket.emit("JOIN_GAME", { gameID, roomID, userID: user.id });
            setGameID(gameID);
            setGameState("Loading");
        })

        socket.on("GAMESTATE_CHANGE", (gameState) => {
            console.log("GAMESTATE_CHANGE", gameState);
            setGameState(gameState);
        })

        socket.on("GAME_ID_UPDATED", (gameID) => {
            console.log("GAME_ID_UPDATED", gameID);
            setGameID(gameID);
        })

        return () => {
            socket.off("GAME_CREATED");
            socket.off("GAMESTATE_CHANGE");
            socket.off("GAME_ID_UPDATED");
        }
    }
    , [gameState, socket]);

    switch (gameState) {
        case "notStarted":
            return (
                <GameStart />
            )
        case "loading":
            return (
                <GameLoading gameID = {gameID}
                gameState = {gameState}
                setGameState = {setGameState} />
            )
        case "inProgress":
            return (
                <GamePrompts gameID = {gameID}
                gameState = {gameState}
                setGameState = {setGameState}
                />
            )
        case "waiting":
            return (
                <GameWaiting gameID = {gameID}
                gameState = {gameState}
                setGameState = {setGameState} />
            )
        case "complete":
            return (
                <GameComplete gameID = {gameID}
                gameState={gameState}
                setGameState={setGameState}
                />
            )
        case "abandoned":
            return (
                <GameAbandoned gameID = {gameID}
                gameState={gameState}
                setGameState={setGameState}
                />
            )
        default:
            return (
                    <div>Error with Game State</div>
            )
    }
}

export default GameBoard;