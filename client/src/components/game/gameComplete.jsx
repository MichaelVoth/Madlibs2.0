import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

import VoteModal from "../../forms/vote.jsx";

const GameComplete = (props) => {
    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const { gameState, setGameState } = props;
    const [title, setTitle] = useState("");
    const [completedMadlib, setCompletedMadlib] = useState(null);
    const { gameID, setGameID } = props

    const [showVoteModal, setShowVoteModal] = useState(false);

    const handlePlayAgain = () => {
        axios.post(`http://localhost:3001/api/game/create/${roomID}`, {}, { withCredentials: true })
            .then(res => {
                socket.emit('PROPOSE_NEW_GAME', roomID, res.data.gameID);
                setGameID(res.data.gameID);
            })
            .catch(err => console.log(err));
    }
    useEffect(() => {
        const handleShowVoteModal = (gameID) => {
            setGameID(gameID);
            setShowVoteModal(true);
        };

        socket.on('SHOW_VOTE_MODAL', handleShowVoteModal);

        return () => {
            socket.off('SHOW_VOTE_MODAL', handleShowVoteModal);
        };
    }, [socket, setGameID]);


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
        <div
            id="gameBoard">
            <h1>Game Complete</h1>
            <h2>{title}</h2>
            <p>{completedMadlib}</p>
            <button onClick={handlePlayAgain} >Play Again</button>
            {showVoteModal && <VoteModal show={showVoteModal} setShow={setShowVoteModal} gameID={gameID} voteType="playAgain" topic="Want to Play Again?" />}
        </div>
    )

}

export default GameComplete;