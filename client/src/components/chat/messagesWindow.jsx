import React, { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MessagesWindow = () => {

    const { socket } = useSocketContext();

    const [allMessages, setAllMessages] = useState([]);
    const endRef = useRef();

    useEffect(() => {
        socket.on("NEW_MESSAGE_RECEIVED"), (message) => {
            console.log("New message received", message);
            setAllMessages((oldMessages) => [...oldMessages, message]);
        }

        endRef?.current?.scrollIntoView({ behavior: 'instant' });

        return () => {
            socket.off('NEW_MESSAGE_RECEIVED');
        }
    }, [socket, allMessages]);

    return (
        <Row className="mb-2 p-2 mh-250">
            <Col id="MessagesWindow">
                <div id="chatWindow" className="p-2">
                    {allMessages.map((message, index) => {
                        return (
                            <React.Fragment key={index}>
                                {message.systemMessage ?
                                    <p>({message.content})</p>
                                    :
                                    <p><strong>{message.username}:</strong> {message.content}</p>
                                }
                            </React.Fragment>
                        )
                    })}

                    <div ref={endRef} ></div>
                </div>
            </Col>
        </Row>
    )
}

export default MessagesWindow;
