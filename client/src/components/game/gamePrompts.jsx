import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import UniversalInputForm from "../../forms/universalInputForm.jsx";

const GamePrompts = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const {gameState, setGameState} = props;

    const gameID = props.gameID;
    const [assignedPrompts, setAssignedPrompts] = useState([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

    const handlePromptSubmit = (input) => {
        axios.put(`http://localhost:3001/api/game/response/${gameID}/room/${roomID}/user/${user.id}`,
            {   response: input,
                originalIndex: assignedPrompts[currentPromptIndex].originalIndex },{ withCredentials: true })
            .then(res => {
                if(currentPromptIndex < assignedPrompts.length - 1) {
                    setCurrentPromptIndex(currentPromptIndex + 1);
                } else {
                    socket.emit("USER_FINISHED", { gameID, roomID, userID: user.id, username: user.username });
                    setGameState("waiting");
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/game/${gameID}/room/${roomID}/user/${user.id}`, { withCredentials: true })
            .then(res => {
                setAssignedPrompts(res.data);
            })
            
            .catch(err => console.log(err));
    }, []);


    return (
        <div>
            <h1>Game Prompts</h1>
            {assignedPrompts.length > 0 && (
            <UniversalInputForm
                placeHolder= {`Enter a(n) ${assignedPrompts[currentPromptIndex].prompt}...`}
                setAction={handlePromptSubmit}
                buttonLabel="Next"
            />
            )}
        </div>
    )
}

export default GamePrompts;