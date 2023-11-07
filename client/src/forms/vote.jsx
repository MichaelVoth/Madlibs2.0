import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext.jsx";
import { useUserContext } from "../contexts/UserContext.jsx";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const VoteModal = (props) => {
    const { user } = useUserContext();
    const { socket } = useSocketContext();
    const { roomID } = useParams();
    const [vote, setVote] = useState(null);
    const [timer, setTimer] = useState(45);
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleVote = (voteValue) => {
        console.log("VOTE Value", voteValue);
        setVote(voteValue);
    };
    //Submit vote to server
    useEffect(() => {
        if (vote !== null) {

            socket.emit(`VOTE_SUBMIT ${props.voteType}`, {
                voteType: props.voteType,
                topic: props.topic,
                vote: vote,
                user: user,
                roomID: roomID,
                gameID: props.gameID
            });
            props.setShow(false);
        }
    }, [vote]);

    //Time out vote if no response
    useEffect(() => {
        if (props.show) {
            setTimer(45);
            let countdown = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1 || !show) {
                        clearInterval(countdown);
                        if (vote === null && show) {
                            socket.emit(`VOTE_SUBMIT ${props.voteType}`, {
                                voteType: props.voteType,
                                topic: props.topic,
                                vote: "no response",
                                user: user,
                                roomID: roomID,
                                gameID: props.gameID
                            });
                            props.setShow(false);
                        }
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [show]);


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Vote</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.topic}</p>
                <div>Time left: {timer} seconds</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleVote(false)}>
                    No
                </Button>
                <Button variant="primary" onClick={() => handleVote(true)}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default VoteModal;
