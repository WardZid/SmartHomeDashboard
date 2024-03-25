import React, { useEffect, useState, useRef } from "react";
import * as widgetModel from "../models/Widget";
import WidgetItem from "./WidgetItem";
import RGL, { WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

const ReactGridLayout = WidthProvider(RGL);

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


  const gridProps = {
    className: "layout",
    cols: 6,
    rowHeight: 200,
    verticalCompact: false,
    autoSize: true,
    draggableHandle: ".react-grid-drag-handle",
  };

  return (
    <div className="bg-slate-600 h-full draggable">
      <ReactGridLayout
        {...gridProps}>
        {widgets.map((widget) => (
          <div
            key={widget._id}
            data-grid={{
              x: widget.col,
              y: widget.row,
              w: widget.col_span,
              h: widget.row_span,
            }}>
            <WidgetItem widget={widget} />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};


export default RoomDashboard;