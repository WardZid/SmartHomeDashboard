import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as user from '../models/User';
import * as room from '../models/Room';

import TopDashboardBar from '../components/TopDashboardBar';
import RoomDashboard from '../components/RoomDashboard';
import RoomItem from '../components/RoomItem';
import WatchingCircle from '../components/WatchingCircle';


const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<room.Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<room.Room | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>('');

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await user.isLoggedIn();
      if (!loggedIn) {
        // If not logged in, sign out and redirect to login
        user.signOut();
        navigate('/login');
      }
    };


    const fetchRooms = async () => {
      try {
        const roomsData = await room.getRooms();
        setRooms(roomsData);
        console.log(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    checkLoggedIn();
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    try {
      if (newRoomName) {
        console.log(newRoomName);
        await room.addRoom(newRoomName);
        // After successfully adding the room, fetch the updated list of rooms
        const updatedRooms = await room.getRooms();
        setRooms(updatedRooms);
      }
      setNewRoomName(''); // Clear the input field
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await room.deleteRoom(roomId);
      // After successfully deleting the room, fetch the updated list of rooms
      const updatedRooms = await room.getRooms();
      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleRoomSelect = (room: room.Room) => {
    setSelectedRoom(room);
  };

  const handleChangeNewRoomName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomName(event.target.value);
  };
  
  return (
    <div className="h-screen bg-slate-400 flex flex-col">
      <TopDashboardBar />

      <div className="flex flex-grow flex-row">

        <div className="bg-dark-blue pt-4 w-52">

          <div className="py-1 px-2 mx-2 hover:bg-slate-700 cursor-pointer rounded-xl flex flex-col">
            <input
              type="text"
              className="text-lg text-white px-2 bg-transparent border-none focus:outline-none"
              placeholder="Enter room name"
              value={newRoomName}
              onChange={handleChangeNewRoomName}
            />

            <button
              className="text-lg text-white font-bold px-2 hover:bg-slate-500 cursor-pointer rounded-lg"
              onClick={handleCreateRoom}
            >
              Create
            </button>
          </div>

          <h6 className="mt-6 px-2 text-base text-off-white opacity-70">Rooms</h6>

          {rooms.map(room => (
            <RoomItem 
              key={room._id} 
              room={room} 
              onSelect={handleRoomSelect} 
              onDelete={handleDeleteRoom} 
              isSelected={selectedRoom !== null && selectedRoom._id === room._id}
            />
          ))}
        </div>

        <div className='flex-grow'>
          {/* Render RoomDashboard component if a room is selected */}
          {selectedRoom && <RoomDashboard roomId={selectedRoom._id} />}
        </div>

      </div>

    </div>

  );
};

export default Dashboard;
