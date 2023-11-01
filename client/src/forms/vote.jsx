import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext.jsx";
import { useUserContext } from "../contexts/UserContext.jsx";

const VoteForm = (props) => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();
    const { roomID } = useParams();
    const [voteType, setVoteType] = useState(props.voteType);

    const [vote, setVote] = useState(null);
    const [timer, setTimer] = useState(45);
    const [isDisplayed, setIsDisplayed] = useState(true);

    const handleVote = (voteValue) => {
        setVote(voteValue);
        setIsDisplayed(false);
    };

    useEffect(() => {
        if (vote !== null) {
            socket.emit(`VOTE_SUBMIT ${voteType}`, { voteType: voteType, topic: props.topic, vote: vote, user: user, roomID: roomID });
        }
    }, [vote]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1 || !isDisplayed) {
                    clearInterval(countdown);
                    if (vote === null && isDisplayed) {
                        socket.emit(`VOTE_SUBMIT ${voteType}`, { voteType: voteType, topic: props.topic, vote: "no response", user: user, roomID: roomID });
                        setIsDisplayed(false);
                    }
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [isDisplayed]);

    return (
        <div>
            {isDisplayed && <div>
                <div>
                    <label>{props.topic} </label>
                </div>
                <div>
                    <button onClick={() => handleVote(true)}>Yes</button>
                    <button onClick={() => handleVote(false)}>No</button>
                </div>
                <div>Time left: {timer} seconds</div>
            </div>}
        </div>
    )
}

export default VoteForm;
