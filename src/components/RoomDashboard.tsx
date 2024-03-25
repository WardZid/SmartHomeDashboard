import React, { useEffect, useState, useRef } from "react";
import * as widget from "../models/Widget";


interface RoomDashboardProps {
  roomId: string;
}

const RoomDashboard: React.FC<RoomDashboardProps> = ({ roomId }) => {
  const [widgets, setWidgets] = useState<widget.Widget[]>([]);


  useEffect(() => {

    const fetchWidgts = async () => {
      try {
        const widgetsData = await widget.getWidgets(roomId);
        setWidgets(widgetsData);
        console.log(widgetsData);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchWidgts();
  }, [roomId]);

  return (
    <div>
      
    </div>
  );
};

export default RoomDashboard;