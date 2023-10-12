import React, {useState, useEffect} from "react";
import RoomManager from "../classes/roomManager.class";


const RoomsList = (props) => {

    const [rooms, setRooms] = useState([]);

    const seeRooms = () => {
        console.log(rooms);
    }

    useEffect(() => {
        RoomManager.getRooms()
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => console.log(err));
    }
    , []);

    return (
        <div>
            <h1>Rooms List</h1>
            <button onClick={seeRooms}>See Rooms</button>
            <ul>
                {rooms.map((room, index) => {
                    return <li key={index}>{room}</li>
                }
                )}
            </ul>
        </div>
    )
}

export default RoomsList;
