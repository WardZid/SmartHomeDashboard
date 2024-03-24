import React, { useEffect, useState } from "react";


interface RoomDashboardProps {
  roomId: string;
}

const RoomDashboard: React.FC<RoomDashboardProps> = ({ roomId }) => {
  const [roomData, setRoomData] = useState<any>(null); // Update the type as per your fetched data structure

  // useEffect(() => {
  //   // Fetch room data when component mounts
  //   fetchRoomData(roomId)
  //     .then(data => setRoomData(data))
  //     .catch(error => console.error("Error fetching room data:", error));
  // }, [roomId]);

  // Render room data
  return (
    <div>
      {/* Render room data here */}
    </div>
  );
};

export default RoomDashboard;