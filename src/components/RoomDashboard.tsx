import React, { useEffect, useState, useRef } from "react";
import * as widgetModel from "../models/Widget";
import WidgetItem from "./WidgetItem";


interface RoomDashboardProps {
  roomId: string;
}

const RoomDashboard: React.FC<RoomDashboardProps> = ({ roomId }) => {
  const [widgets, setWidgets] = useState<widgetModel.Widget[]>([]);


  useEffect(() => {

    const fetchWidgts = async () => {
      try {
        const widgetsData = await widgetModel.getWidgets(roomId);
        setWidgets(widgetsData);
        console.log(widgetsData);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchWidgts();
  }, [roomId]);

  return (
    <div className="flex flex-row bg-slate-600 h-full">
      {widgets.map((widget) => (
        <WidgetItem key={widget._id} widget={widget} />
      ))}
    </div>
  );
};

export default RoomDashboard;