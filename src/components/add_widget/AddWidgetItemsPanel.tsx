import React, { useState } from "react";
import { Device } from "../../models/Device";
import { Widget } from "../../models/Widget";
import WidgetItem from "../room/WidgetItem";

export interface AddWidgetItemsPanelProps {
    device: Device;
    onSelect: (widget: Widget) => void;
}

const AddWidgetItemsPanel: React.FC<AddWidgetItemsPanelProps> = ({ device, onSelect }) => {
    const [sampleWidgets, setSampleWidgets] = useState<Widget[]>(() => {
        //here we add types of widgets for each device
        //new widgets have a row/col positions of -1, they are given correct positions when the room they have been added to loads them in for the first time (the room places them accordingly)
        return [{
            _id: '',
            device_id: device._id,
            room_id: '',
            title: device.title,
            type: 'control',
            row: -1,
            col: -1,
            row_span: 1,
            col_span: 1,
            device: device
        }/* ,
        {
            _id: '',
            device_id: device._id,
            room_id: '',
            title: device.title + ' - History',
            type: 'history',
            row: -1,
            col: -1,
            row_span: 1,
            col_span: 2,
            device: device
        } */
        ]

    });

    const [hoveredWidget, setHoveredWidget] = useState<Widget | null>(null);
    const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

    const handleWidgetHover = (widget: Widget | null) => {
        setHoveredWidget(widget);
    };

    const handleWidgetSelect = (widget: Widget) => {
        setSelectedWidget(widget);

        //set selected widget as selected widget in main dialog to allow it to be added to db
        onSelect(widget);
    };


    return (
        <div
            className={`flex-grow py-4 px-4 rounded-lg w-full overflow-y-scroll
             flex flex-col items-center gap-2`}

        >
            {sampleWidgets.map(sampleWidget => (
                <div
                    key={sampleWidget.title}
                    className={`w-full p-1 flex flex-col items-center
                    hover:bg-slate-700 rounded border-2 
                    ${selectedWidget === sampleWidget ? "border-light-blue bg-slate-700" : 'border-transparent'}`}
                    onMouseEnter={() => handleWidgetHover(sampleWidget)}
                    onMouseLeave={() => handleWidgetHover(null)}
                    onClick={() => handleWidgetSelect(sampleWidget)}
                >
                    <div
                        className={`${sampleWidget.type === 'control' ? 'w-48' : 'w-96'} min-h-48 h-48
                    `}
                        style={{ pointerEvents: "none" }}

                    >
                        <WidgetItem
                            widget={sampleWidget}
                        />
                    </div>
                </div>

            ))}
        </div>
    );
};

export default AddWidgetItemsPanel;
