import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as user from '../models/User';
import * as room from '../models/Room';

import RoomDashboard from '../components/room/RoomDashboard';
import RoomItem from '../components/room/RoomItem';
import WatchingCircle from '../components/WatchingCircle';
import { useDarkMode } from '../contexts/DarkModeContext';
import SettingsDialog from '../components/settings/SettingsDialog';
import AddWidgetDialog from '../components/add_widget/AddWidgetDialog';
import { AuthenticationError } from '../models/User';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [fullName, setFullName] = useState<string>("");
  const [rooms, setRooms] = useState<room.Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<room.Room | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddWidgetDialogOpen, setIsAddWidgetDialogOpen] = useState(false);



  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await user.isLoggedIn();
      if (!loggedIn) {
        // If not logged in, sign out and redirect to login
        user.logOut();
        navigate('/login');
      }
    };

    user.getUserInfo()
      .then((userInfo) => {
        if (userInfo !== null) {
          setFullName(userInfo.first_name + " " + userInfo.last_name);
        } else {
          console.error("User info is null");
        }
      })
      .catch((error) => {
        if (error instanceof user.AuthenticationError) {
          user.logOut();
          navigate("/login");
          console.log("Credentials Expired");
        } else {
          console.error('Error:', error);
        }
      });


    const fetchRooms = async () => {
      try {
        const roomsData = await room.getRooms();
        setRooms(roomsData);
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }

      } catch (error) {
        if (error instanceof user.AuthenticationError) {
          user.logOut();
          navigate("/login");
          console.log("Credentials Expired");
        } else {
          console.error('Error fetching rooms:', error);
        }
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
      if (error instanceof user.AuthenticationError) {
        user.logOut();
        navigate("/login");
        console.log("Credentials Expired");
      } else {
        console.error('Error Creating Room:', error);
      }
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await room.deleteRoom(roomId);
      // After successfully deleting the room, fetch the updated list of rooms
      const updatedRooms = await room.getRooms();
      setRooms(updatedRooms);
    } catch (error) {
      if (error instanceof user.AuthenticationError) {
        user.logOut();
        navigate("/login");
        console.log("Credentials Expired");
      } else {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleRoomSelect = (room: room.Room) => {
    setSelectedRoom(room);
  };

  const handleChangeNewRoomName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomName(event.target.value);
  };
  const handleEyeClick = () => {
    navigate("/");
  };
  const handleLogout = () => {
    user.logOut();
    navigate("/login");
    console.log("Logged out successfully");
  };
  const toggleSettingsDialog = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  const toggleAddWidgetDialog = () => {
    setIsAddWidgetDialogOpen(!isAddWidgetDialogOpen);
  };


  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        className="
          h-screen flex flex-col 
        bg-slate-50 dark:bg-slate-700
        text-dark-blue dark:text-off-white "
      >
        <div className="flex h-full flex-row overflow-hidden">

          <div className="bg-off-white dark:bg-dark-blue pt-4 w-52 flex flex-col px-2">

            <div className="flex justify-center items-center pb-4">
              {/*TODO dark mode fix*/}
              <div onClick={handleEyeClick}>
                <WatchingCircle outerCircleColor={darkMode ? "#EEEEEE" : "#042A35"} innerCircleColor={darkMode ? "#042A35" : "#EEEEEE"} />
              </div>
              <h1 className="px-2">Hello, {fullName}!</h1>
            </div>

            <div className="py-1 px-1 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer rounded-lg flex flex-col">
              <input
                type="text"
                className="text-lg px-2 bg-transparent border-none focus:outline-none"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={handleChangeNewRoomName}
              />

              <button
                className="text-lg font-bold px-2 border-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600
                cursor-pointer rounded-lg"
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
            <h6 className="mt-6 px-2 text-base opacity-70">Rooms</h6>

            <div className="flex-grow flex flex-col">

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

            <div className="flex justify-center items-center py-2">
              <button className="flex-grow mx-1 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700"
                onClick={toggleSettingsDialog}>
                Settings
              </button>
              <button className="flex-grow mx-1 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700"
                onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-hidden flex flex-col">
            <div
              className="
            flex flex-row
            px-4 py-2">
              <div className="flex-grow flex flex-row text-2xl font-bold">
                <div className="dark:text-off-white text-dark-blue">Smart </div>
                <div className="dark:text-off-white text-orange">Home </div>
                <div className="dark:text-off-white text-dark-blue">Automation </div>
                <div className="dark:text-off-white text-orange">Dashboard</div>
              </div>

              <button
                className="
                  bg-light-blue
                  text-off-white dark:text-dark-blue
                    font-bold 
                    rounded-lg py-1 px-2"
                onClick={toggleAddWidgetDialog}>
                Add Widget
              </button>
            </div>

            <div className="overflow-y-scroll flex-grow"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 transparent'
              }}>
              {/* Render RoomDashboard component if a room is selected */}
              {selectedRoom && <RoomDashboard roomId={selectedRoom._id} />}
            </div>
          </div>

        </div>

      </div>
      <SettingsDialog isOpen={isSettingsOpen} onClose={toggleSettingsDialog} />
      <AddWidgetDialog isOpen={isAddWidgetDialogOpen} onClose={toggleAddWidgetDialog} />
    </div>

  );
};

export default Dashboard;
