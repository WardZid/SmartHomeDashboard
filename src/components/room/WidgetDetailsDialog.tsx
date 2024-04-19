import React, { useEffect, useState } from "react";
import * as user from "../../models/User";
import Dialog from '../generic/Dialog';
import Clock from 'react-clock';
import { useNavigate } from "react-router-dom";
import * as widgetModel from '../../models/Widget';
import 'react-time-picker/dist/TimePicker.css'; // Import TimePicker CSS
import 'react-clock/dist/Clock.css'; // Import Clock CSS

interface WidgetDetailsDialogProps {
    roomId: string;
    isOpen: boolean;
    onClose: () => void;
    widgetId: string;
}

interface ScheduleItem {
    day: string;
    time: string;
    active: boolean;
}

const WidgetDetailsDialog: React.FC<WidgetDetailsDialogProps> = ({ isOpen, onClose, widgetId }) => {
    const navigate = useNavigate();
    const [widget, setWidget] = useState<widgetModel.Widget>();
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>('Monday');
    const [selectedHour, setSelectedHour] = useState<string>('00');
    const [selectedMinute, setSelectedMinute] = useState<string>('00');
    const [showActivationTime, setShowActivationTime] = useState<boolean>(false);
    const [showDaysSelection, setShowDaysSelection] = useState<boolean>(false); // Declare here
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleDeleteWidget = async () => {
        try {
            // Perform deletion of the widget from the database
            // await widgetModel.deleteWidget(widgetId);
            // Close the dialog after successful deletion
            onClose();
        } catch (error) {
            console.error('Error deleting widget:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleAddToSchedule = () => {
        const hour = parseInt(selectedHour);
        const minute = parseInt(selectedMinute);

        if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
            alert("Please enter valid hour (0-23) and minute (0-59).");
            return;
        }

        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!schedule.find(item => item.day === selectedDay && item.time === time)) {
            setSchedule([...schedule, { day: selectedDay, time: time, active: false }]);
            setSelectedHour('00');
            setSelectedMinute('00');
        }
    };

    const handleToggleActivationTime = () => {
        setShowActivationTime(!showActivationTime);
    };

    const handleToggleTime = (day: string, time: string) => {
        setSchedule(schedule.map(item => {
            if (item.day === day && item.time === time) {
                return { ...item, active: !item.active };
            }
            return item;
        }));
    };

    const handleDeleteScheduleItem = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule.splice(index, 1);
        setSchedule(newSchedule);
    };

    const handleSaveToSchedule = () => {
        // Save schedule to database or perform other actions
    };


    return (
        <Dialog dialogTitle={widget ? widget.title : 'Widget does not exist'} isOpen={isOpen} allowCloseX={true} onClose={handleClose}>

            <div className="flex flex-col h-full">
                <div className="flex items-center border-b border-light-blue pb-4 justify-evenly">
                   
                        <h6 className="text-base opacity-70">Current Time</h6>
                        <p className="text-lg font-bold">{`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`}</p>

                </div>
                <div className="flex-grow overflow-auto p-4">
                    <div className="flex flex-row justify-center items-baseline">
                       {/*  <h6 className="text-base opacity-70 px-2 font-bold">Add Event</h6> */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={selectedHour}
                                onChange={(e) => setSelectedHour(e.target.value)}
                                className="border border-gray-300 rounded mr-2 w-16 p-1 text-center dark:bg-slate-700"
                                placeholder="HH"
                            />
                            :
                            <input
                                type="text"
                                value={selectedMinute}
                                onChange={(e) => setSelectedMinute(e.target.value)}
                                className="border border-gray-300 rounded ml-2 w-16 p-1 text-center dark:bg-slate-700"
                                placeholder="MM"
                            />
                            <button className="ml-2 bg-blue-500 text-white px-3 py-1 rounded font-bold" onClick={handleAddToSchedule}>Add Event</button>
                        </div>
                    </div>

                    <div className={`mt-4 ${schedule.length > 2 ? 'overflow-y-scroll max-h-40' : ''}`}>
                        <ul>
                            {schedule.map((item, index) => (
                                <li key={index} className="mt-2 flex flex-col gap-2 p-4 rounded-lg bg-slate-200 dark:bg-slate-800">
                                    <div className="flex flex-row items-center justify-between">

                                        <span className="mr-4 text-2xl font-bold">{item.time}</span>
                                        <button
                                            className={`ml-4 ${item.active ? 'bg-blue-500' : 'bg-gray-400'} rounded-full w-12 h-6 relative focus:outline-none`}
                                            onClick={() => handleToggleTime(item.day, item.time)}
                                        >
                                            <span
                                                className={`block w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${item.active ? 'translate-x-6' : 'translate-x-0'}`}
                                            ></span>
                                        </button>
                                    </div>
                                    <div className="flex flex-row justify-between items-end">
                                        <div className="flex flex-col">
                                            <h6 className="font-semibold text-sm text-slate-500">Repeat</h6>
                                            <div className="flex flex-row gap-1">
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  `}>Sun</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  `}>Mon</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  `}>Tue</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 `}>Wed</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  `}>Thu</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  `}>Fri</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 `}>Sat</button>
                                            </div>
                                        </div>
                                        <img
                                            className="h-6 opacity-50 hover:opacity-70 cursor-pointer"
                                            src={`${process.env.PUBLIC_URL}/icons/delete-room.png`}
                                            alt="Delete"
                                            onClick={() => handleDeleteScheduleItem(index)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-light-blue px-4 pt-4 flex flex-row-reverse">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteWidget}>Delete Widget </button>
                </div>
            </div>

        </Dialog>
    );
};

export default WidgetDetailsDialog;
