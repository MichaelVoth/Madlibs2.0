import React, { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import VoteForm from '../../forms/vote.jsx';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MessagesWindow = () => {

    const { socket } = useSocketContext();

    const [allMessages, setAllMessages] = useState([]);
    const allMessagesRef = useRef([]);

    const endRef = useRef();

    useEffect(() => {
        socket.on("NEW_MESSAGE_RECEIVED", (message) => {
            setAllMessages(prevMessages => {
                const updatedMessages = [...prevMessages, message];
                allMessagesRef.current = updatedMessages;
                return updatedMessages;
            }
            );
        });

        endRef?.current?.scrollIntoView({ behavior: 'instant' });
        return () => {
            socket.off('NEW_MESSAGE_RECEIVED');
        }

    }, [socket, allMessages]);

    const renderMessageContent = (message, index) => {
        switch (message.messageType) {
            case 'text':
                return <p key={index}><strong>{message.username}:</strong> {message.content}</p>;
            case 'vote':
                return <VoteForm key={index} topic={message.content} roomID={message.roomID} />;
            case 'system':
                return <p key={index}>({message.content})</p>;
            default:
                return null;
        }
    };

    return (
        <Row className="mb-2 p-2 mh-250">
            <Col id="MessagesWindow">
                <div id="chatWindow" className="p-2">
                    {allMessages.map((message, index) => renderMessageContent(message, index))}
                    <div ref={endRef}></div>
                </div>
            </Col>
        </Row>
    );
}

export default MessagesWindow;
