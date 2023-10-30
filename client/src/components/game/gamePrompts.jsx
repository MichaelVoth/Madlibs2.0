import React, { useState, useRef, useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext.jsx";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import UniversalInputForm from "../../forms/universalInputForm.jsx";

const GamePrompts = (props) => {

    const { roomID } = useParams();
    const { socket } = useSocketContext();
    const { user } = useUserContext();
    const { gameState, setGameState } = props;
    const gameID = props.gameID;
    const [assignedPrompts, setAssignedPrompts] = useState([]);
    const currentPromptsRef = useRef(assignedPrompts); //Used to compare previous prompts to new prompts
    const [timer, setTimer] = useState(45);
    const [timeExpired, setTimeExpired] = useState(false);

    //Submit prompt response and remove prompt from assignedPrompts. If no more prompts, set game state to waiting
    const handlePromptSubmit = (input) => {
        axios.put(`http://localhost:3001/api/game/response/${gameID}/room/${roomID}/user/${user.id}`,
            {
                response: input,
                originalIndex: assignedPrompts[0].originalIndex
            }, { withCredentials: true })
            .then(res => {
                setAssignedPrompts(prevPrompts => prevPrompts.slice(1));
                setTimer(45);
                if (assignedPrompts.length === 1) {
                    socket.emit("USER_FINISHED", { gameID, roomID, userID: user.id, username: user.username });
                    setGameState("waiting");
                }
            })
            .catch(err => console.log(err));
    };

    //Get prompts for the user upon initial render
    useEffect(() => {
        axios.get(`http://localhost:3001/api/game/prompts/${gameID}/room/${roomID}/user/${user.id}`, { withCredentials: true })
            .then(res => {
                console.log("Prompts", res.data);
                const existingIndexes = new Set(currentPromptsRef.current.map(prompt => prompt.originalIndex));
                const uniquePrompts = res.data.filter(prompt => !existingIndexes.has(prompt.originalIndex) && prompt.response === null);
                setAssignedPrompts(prevPrompts => [...prevPrompts, ...uniquePrompts]);
            })
            .catch(err => console.log(err));
    }, []);

    //Get prompts for the user when another user is marked inactive
    useEffect(() => {
        const getPrompts = () => {
            axios.get(`http://localhost:3001/api/game/prompts/${gameID}/room/${roomID}/user/${user.id}`, { withCredentials: true })
                .then(res => {
                    console.log("New Prompts", res.data);
                    const existingIndexes = new Set(currentPromptsRef.current.map(prompt => prompt.originalIndex));
                    const uniquePrompts = res.data.filter(prompt => !existingIndexes.has(prompt.originalIndex) && prompt.response === null);
                    setAssignedPrompts(prevPrompts => [...prevPrompts, ...uniquePrompts]);
                })
                .catch(err => console.log(err));
        };
        socket.on("GET_NEW_PROMPTS", getPrompts);

        return () => socket.off("GET_NEW_PROMPTS");
    }, [gameState, socket]);

    // Update the ref whenever assignedPrompts changes
    useEffect(() => {
        currentPromptsRef.current = assignedPrompts;
    }, [assignedPrompts]);

    //Timer to set time expired to true
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    clearInterval(countdown);
                    return setTimeExpired(true);
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(countdown);
    }, []);

    //If time expires, send user inactive and set game state to waiting
    useEffect(() => {
        if (timeExpired) {
            axios.put(`http://localhost:3001/api/game/inactive/${gameID}/room/${roomID}/user/${user.id}`, {}, { withCredentials: true })
                .then(res => {
                    socket.emit("USER_INACTIVE", { gameID, roomID, userID: user.id, username: user.username });
                    setGameState("waiting");
                })
                .catch(err => console.log(err));
        }

    }, [gameState, timeExpired]);

    return (
        <div>
            <h1>Game Prompts</h1>
            <div>Time Left: {timer} seconds</div>
            {assignedPrompts.length > 0 && (
                <UniversalInputForm
                    placeHolder={`Enter a(n) ${assignedPrompts[0].prompt}...`}
                    setAction={handlePromptSubmit}
                    buttonLabel="Next"
                />
            )}
        </div>
    )
}

export default GamePrompts;