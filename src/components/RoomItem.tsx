import React from "react";
import { useNavigate } from 'react-router-dom';
import { Room } from "../models/Room"

interface RoomItemProps {
    room: Room;
    onSelect: (room: Room) => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onSelect }) => {
    const handleRoomClick = () => {
        onSelect(room);
    };

    return (
        <div
            className="py-1 px-2 hover:bg-dark-blue"
            onClick={handleRoomClick}>
            <h2>{room.room_name}</h2>
        </div>
    );
};

export default RoomItem;
