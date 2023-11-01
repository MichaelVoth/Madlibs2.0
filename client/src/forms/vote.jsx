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

    useEffect(() => {
        if (vote !== null) {
            socket.emit(`VOTE_SUBMIT ${voteType}` , { voteType:voteType, topic: props.topic, vote: vote, user: user.id, roomID: roomID });
            setIsDisplayed(false);
        }
    }, [vote]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    clearInterval(countdown);
                    if (vote === null) {
                        socket.emit("VOTE_SUBMIT", { topic: props.topic, vote: "no response", user: user, roomID: roomID });
                        setIsDisplayed(false);
                    }
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    return (
        <div>
            {isDisplayed && <div> 
                <label>{props.topic} </label>
                <input type="radio" name="vote" value="yes" onChange={() => setVote(true)} />
                <label> Yes </label>
                <input type="radio" name="vote" value="no" onChange={() => setVote(false)} />
                <label> No </label>
                <div>Time left: {timer} seconds</div>
            </div>
            }
        </div>
    )
}

export default VoteForm;
