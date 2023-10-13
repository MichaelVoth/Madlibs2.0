import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext.jsx';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import MessagesWindow from './messagesWindow.jsx';
import UniversalInputForm from '../../forms/universalInputForm.jsx';

const ChatBox = () => {
    const { user } = useUserContext();
    const { socket } = useSocketContext();
    const { roomID } = useParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (message !== '') { //If the message is not blank...
            socket.emit('NEW_MESSAGE_SENT', { 
                username: user.username,
                content: message,
                roomID: roomID,
                systemMessage: false
            });
        }
    }, [socket, message]); //If the socket or message changes, run this useEffect

    return (
        <div>
            <MessagesWindow />
            <UniversalInputForm placeHolder="Type your message here" setAction={setMessage} buttonLabel="Send" />
        </div>
    )
}

export default ChatBox;