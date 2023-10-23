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
        socket.on("GAME_STARTED", (gameID) => {
            console.log("GAME_STARTED", gameID);
            setGameState("inProgress");
            setGameID(gameID);
        })
        return () => {
            socket.off("GAME_STARTED");
        }
    }
    , []);

    switch (gameState) {
        case "notStarted":
            return (
                <GameStart />
            )
        case "Loading":
            return (
                <GameLoading gameID = {gameID} />
            )
        case "inProgress":
            return (
                <GamePrompts gameID = {gameID} />
            )
        case "waiting":
            return (
                <GameWaiting gameID = {gameID} />
            )
        case "complete":
            return (
                <GameComplete gameID = {gameID} />
            )
        default:
            return (
                    <div>Error with Game State</div>
            )
    }
}

export default GameBoard;