import React, { useEffect, useState, useRef } from "react";
import * as widgetModel from "../../models/Widget";
import WidgetItem from "./WidgetItem";
import RGL, { Layout, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

const ReactGridLayout = WidthProvider(RGL);

interface RoomDashboardProps {
  roomId: string;
  onDetailsOpen: (widgetId: string) => void;
}

const RoomDashboard: React.FC<RoomDashboardProps> = ({ roomId, onDetailsOpen }) => {
  const [widgets, setWidgets] = useState<widgetModel.Widget[]>([]);

  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {

    const fetchWidgts = async () => {
      try {
        const widgetsData = await widgetModel.getWidgets(roomId);
        setWidgets(widgetsData);
        // Generate layout based on widget data
        const newLayout: Layout[] = widgetsData.map((widget) => ({
          i: widget._id, // Use widget id as the unique identifier
          x: widget.col,
          y: widget.row,
          w: widget.col_span,
          h: widget.row_span,
        }));
        setLayout(newLayout);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchWidgts();
  }, [roomId]);

  const onLayoutChange = (layout: Layout[]) => {
    layout.forEach(async (item) => {
      try {
        // TODO crate an update all instead of update one to minimize # of api calls
        await widgetModel.updateWidgetLocationAndSize(
          item.i,
          item.y,
          item.x,
          item.h,
          item.w
        );
      } catch (error) {
        console.error('Error updating widget:', error);
      }
    });

    //save layout state
    setLayout(layout);
  };

  const gridProps = {
    className: "layout",
    cols: 6,
    rowHeight: 200,
    compactType: null,
    autoSize: true,
    draggableHandle: ".react-grid-drag-handle",
  };

  return (
    <div>
      {widgets.length > 0 ?

        <ReactGridLayout
          {...gridProps}
          layout={layout}
          onLayoutChange={onLayoutChange}>
          {widgets.map((widget) => (
            <div
              key={widget._id}>
              <WidgetItem widget={widget} onDetailsOpen={onDetailsOpen} />
            </div>
          ))}
        </ReactGridLayout>
        :
        <div className="flex-grow flex flex-col justify-center h-full w-full font-bold ">
          <div className="w-full text-center opacity-70 dark:text-off-white text-dark-blue">Add a widget to start</div>
        </div>
      }
    </div>
  );
};


export default RoomDashboard;