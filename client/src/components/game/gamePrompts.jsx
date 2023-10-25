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
    const [timer, setTimer] = useState(30);


    const handlePromptSubmit = (input) => {
        axios.put(`http://localhost:3001/api/game/response/${gameID}/room/${roomID}/user/${user.id}`,
            {   response: input,
                originalIndex: assignedPrompts[currentPromptIndex].originalIndex },{ withCredentials: true })
            .then(res => {
                if(currentPromptIndex < assignedPrompts.length - 1) {
                    setCurrentPromptIndex(currentPromptIndex + 1);
                    setTimer(30);
                } else {
                    socket.emit("USER_FINISHED", { gameID, roomID, userID: user.id, username: user.username });
                    setGameState("waiting");
                }
            })
            .catch(err => console.log(err));
    };

    //Get prompts for the user
    useEffect(() => {
        axios.get(`http://localhost:3001/api/game/prompts/${gameID}/room/${roomID}/user/${user.id}`, { withCredentials: true })
            .then(res => {
                setAssignedPrompts(res.data);
            })
            
            .catch(err => console.log(err));
    }, []);

    //Timer to mark user inactive if they don't submit a prompt in time
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    axios.put(`http://localhost:3001/api/game/inactive/${gameID}/room/${roomID}/user/${user.id}`, { withCredentials: true })
                    socket.emit("USER_INACTIVE", { gameID, roomID, userID: user.id, username: user.username });
                    clearInterval(countdown);
                    return setGameState("waiting");
                }
                return prevTimer - 1;
            });
        }, 1000);
    
        // Cleanup the interval on component unmount
        return () => clearInterval(countdown);
    }, []);
    

    return (
        <div>
            <h1>Game Prompts</h1>
            <div>Time Left: {timer} seconds</div>
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