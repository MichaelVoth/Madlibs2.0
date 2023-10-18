import React, { useState, useEffect } from 'react';
import useUserContext from '../../contexts/UserContext.jsx';
import useSocketContext from '../../contexts/SocketContext.jsx';
import { useParams } from 'react-router-dom';
import GameStart from './gameStart.jsx';
import GameLoading from './gameLoading.jsx';
import GamePrompts from './gamePrompts.jsx';
import GameWaiting from './gameWaiting.jsx';
import GameComplete from './game.complete.jsx';


const GameBoard = (props) => {

    const { roomID } = useParams();
    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const [gameState, setGameState] = useState("notStarted");
    const [gameID, setGameID] = useState(null);


    useEffect(() => {
        socket.on("GAME_STARTED", (gameID) => {
            setGameState("inProgress");
            setGameID(gameID);

        })
    }
    , []);

    switch (gameState) {
        case "notStarted":
            return (
                <GameStart />
            )
        case "Loading":
            return (
                <GameLoading gameID = {gameID} roomID = { roomID } />
            )
        case "inProgress":
            return (
                <GamePrompts gameID = {gameID} roomID = { roomID }/>
            )
        case "waiting":
            return (
                <GameWaiting gameID = {gameID} roomID = { roomID } />
            )
        case "complete":
            return (
                <GameComplete gameID = {gameID} roomID = { roomID }/>
            )
        default:
            return (
                    <div>Error with Game State</div>
            )
    }
}

export default GameBoard;