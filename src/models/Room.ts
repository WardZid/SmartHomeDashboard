import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

export interface Room {
    _id: string;
    room_name: string;
    user_id: string;
}

export async function getRooms(): Promise<Room[]> {
    try {
        // Fetch rooms from MongoDB using dbAPI
        const roomsData = await dbAPI.getRooms();

        // Transform the response into an array of Room objects
        const rooms: Room[] = roomsData.map((room: any) => ({
            _id: room._id,
            room_name: room.room_name,
            user_id: room.user_id
        }));

        return rooms;
    } catch (error) {
        // Handle errors
        console.error('Error fetching rooms:', error);
        throw new Error('Failed to fetch rooms');
    }
}

export async function addRoom(roomName: string) {
    return await dbAPI.insertRoom(roomName);
}

export async function deleteRoom(roomId: string) {
    return await dbAPI.deleteRoom(roomId);
}

