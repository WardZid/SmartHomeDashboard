import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as user from '../models/User';
import * as room from '../models/Room';
import { Room } from '../models/Room';

import TopDashboardBar from '../components/TopDashboardBar';
import RoomDashboard from '../components/RoomDashboard';
import RoomItem from '../components/RoomItem';


const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await user.isLoggedIn();
      if (!loggedIn) {
        // If not logged in, sign out and redirect to login
        user.signOut();
        navigate('/login');
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await room.getRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = () => {
  };

  const handleDeleteRoom = (roomName: string) => {

  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="h-screen bg-slate-400 flex flex-col">
      <TopDashboardBar />

      <div className="flex flex-grow flex-row">

        <div className="border-r border-gray-200 bg-off-white pt-4 w-48">
          {rooms.map(room => (
            <RoomItem key={room._id} room={room} onSelect={handleRoomSelect} />
          ))}
        </div>
        <div>
          {selectedRoom && (
            <div>
              <h2>Selected Room: {selectedRoom.room_name}</h2>
            </div>
          )}
        </div>
      </div>

    </div>

  );
};

export default Dashboard;