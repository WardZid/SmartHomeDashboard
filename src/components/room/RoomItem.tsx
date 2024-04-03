import React, { useState } from "react";
import { Room } from "../../models/Room";

interface RoomItemProps {
    room: Room;
    onSelect: (room: Room) => void;
    onDelete: (roomId: string) => Promise<void>;
    isSelected: boolean;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onSelect, onDelete, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRoomClick = () => {
        onSelect(room);
    };

    const handleDeleteClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        event.stopPropagation(); // Prevents handleRoomClick from being called
        setIsDeleting(true);
        try {
            await onDelete(room._id);
        } catch (error) {
            console.error("Error deleting room:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
            <div
                className={`py-1 px-2 cursor-pointer rounded-lg flex flex-row justify-between ${isSelected ? 'bg-slate-600' : 'hover:bg-slate-700'} dark:${isSelected ? 'bg-slate-600' : 'hover:bg-slate-700'}`}
                onClick={handleRoomClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ opacity: isDeleting ? 0.5 : 1 }}
            >
                <h2 className={`text-lg text-dark-blue dark:text-white `}>{room.room_name}</h2>
                {isHovered && (
                    <img
                        className={`h-4 relative top-2 right-0 opacity-70 hover:opacity-100`}
                        src={`${process.env.PUBLIC_URL}/icons/delete-room.png`}
                        alt=""
                        onClick={handleDeleteClick}
                    />
                )}
            </div>

    );
};

export default RoomItem;
