import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext.jsx';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import { useParams } from 'react-router-dom';
import GameStart from './gameStart.jsx';
import GameLoading from './gameLoading.jsx';
import GamePrompts from './gamePrompts.jsx';
import GameWaiting from './gameWaiting.jsx';
import GameComplete from './game.complete.jsx';


const GameBoard = (props) => {

    const {roomID}  = useParams();
    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const [gameState, setGameState] = useState("notStarted");
    const [gameID, setGameID] = useState(null);


    useEffect(() => {
        socket.on("GAME_CREATED", (gameID) => {
            socket.emit("JOIN_GAME", { gameID, roomID, userID: user.id });
            setGameID(gameID);
            setGameState("Loading");
        })

        socket.on("GAME_JOINED", gameID => {
        })

        socket.on("GAME_STARTED", () => {
            setGameState("inProgress");
        })

        socket.on("GAME_COMPLETE", () => {
            setGameState("complete");
        })

        socket.on("GAME_ABANDONED", () => {
            console.log("GAME_ABANDONED");
        })

        socket.on("GAMESTATE_CHANGE", (gameState) => {
            console.log("GAMESTATE_CHANGE", gameState);
            setGameState(gameState);
        })

        return () => {
            socket.off("GAME_CREATED");
            socket.off("GAME_JOINED");
            socket.off("GAME_STARTED");
            socket.off("GAME_COMPLETE");
            socket.off("GAMESTATE_CHANGE");
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
        default:
            return (
                    <div>Error with Game State</div>
            )
    }
}

export default GameBoard;