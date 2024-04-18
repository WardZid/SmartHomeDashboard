import React, { useEffect, useState } from "react";
import * as user from "../../models/User";
import Dialog from '../generic/Dialog';
import * as deviceModel from "../../models/Device";
import { useNavigate } from "react-router-dom";
import AddWidgetDeviceItem from "../add_widget/AddWidgetDeviceItem";
import TimePicker from 'react-time-picker';
import * as widgetModel from '../../models/Widget'
import 'react-time-picker/dist/TimePicker.css'; // Import TimePicker CSS
import 'react-clock/dist/Clock.css'; // Import Clock CSS

interface WidgetDetailsDialogProps {
    roomId: string;
    isOpen: boolean;
    onClose: () => void;
    widgetId: string;
}

const WidgetDetailsDialog: React.FC<WidgetDetailsDialogProps> = ({ isOpen, onClose, widgetId }) => {
    const navigate = useNavigate();
    const [widget, setWidget] = useState<widgetModel.Widget>();
    const [schedule, setSchedule] = useState<string[]>([]); // State for schedule of activation times
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [widgetActive, setWidgetActive] = useState<boolean>(false);

    useEffect(() => {
        const fetchWidget = async () => {
            try {
                const widgetData = await widgetModel.getWidget(widgetId);
                setWidget(widgetData);
            } catch (error) {
                if (error instanceof user.AuthenticationError) {
                    user.logOut();
                    navigate("/login");
                    console.log("Credentials Expired");
                } else {
                    console.error('Error fetching widgets:', error);
                }
            }
        };

        fetchWidget();
    }, [widget]);

    const handleClose = () => {
        onClose();
    };

    const handleTimeChange = (time: string | null) => {
        setSelectedTime(time);
    };

    const handleAddToSchedule = () => {
        if (selectedTime && !schedule.includes(selectedTime)) {
            setSchedule([...schedule, selectedTime]);
            setSelectedTime(null);
        }
    };

    const handleToggleWidget = () => {
        setWidgetActive(!widgetActive);
    };

    const handleSaveToSchedule = () => {
        if (selectedTime && !schedule.includes(selectedTime)) {
            setSchedule([...schedule, selectedTime]);
            setSelectedTime(null);
        }
    };

    return (
        <Dialog dialogTitle={widget ? widget.title : 'Widget does not exist'} isOpen={isOpen} allowCloseX={true} onClose={handleClose}>
            <div className="flex flex-row items-center">
                <h6 className="text-base opacity-70 mr-4">Activation Time:</h6>
                <TimePicker
                    onChange={handleTimeChange}
                    value={selectedTime}
                    className="w-32" // Set the width of the TimePicker
                    clockClassName="!text-lg" // Set the font size of the clock
                    clearIcon={null} // Remove the clear icon if not needed
                />
                <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToSchedule}>Add to Schedule</button>
            </div>
            <div className="mt-4">
                <h6 className="text-base opacity-70">Schedule:</h6>
                <ul>
                    {schedule.map((time, index) => (
                        <li key={index} className="mt-2">
                            {time}
                            {/* Toggle switch for activating the widget */}
                            <label className="switch ml-4">
                                <input type="checkbox" checked={widgetActive} onChange={handleToggleWidget} />
                                <span className="slider round"></span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveToSchedule}>Save</button>
        </Dialog>
    );
};

export default WidgetDetailsDialog;
