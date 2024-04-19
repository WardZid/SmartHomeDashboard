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
    const [selectedHour, setSelectedHour] = useState<number>(0);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
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

    const handleClose = () => {
        onClose();
    };

    const handleAddToSchedule = () => {
        const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        if (!schedule.find(item => item.day === selectedDay && item.time === time)) {
            setSchedule([...schedule, { day: selectedDay, time: time, active: false }]);
            setSelectedHour(0);
            setSelectedMinute(0);
        }
    };

    const handleToggleTime = (day: string, time: string) => {
        setSchedule(schedule.map(item => {
            if (item.day === day && item.time === time) {
                return { ...item, active: !item.active };
            }
            return item;
        }));
    };

    const handleSaveToSchedule = () => {
        // Save schedule to database or perform other actions
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Dialog dialogTitle={widget ? widget.title : 'Widget does not exist'} isOpen={isOpen} allowCloseX={true} onClose={handleClose}>
            <div className="p-4 flex justify-between">
                <div className="mt-2"> {/* Added mt-2 class */}
                    <div className="flex items-center mb-4">
                        <Clock className="mr-4" value={currentTime} />
                        <div>
                            <h6 className="text-base opacity-70">Current Time</h6>
                            <p className="text-lg font-bold">{`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <h6 className="text-base opacity-70 mr-4">Activation Time:</h6>
                        <div className="flex items-center">
                            <select
                                className="border border-gray-300 rounded mr-2"
                                value={selectedHour}
                                onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                            >
                                {[...Array(24)].map((_, index) => (
                                    <option key={index} value={index}>{index.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                            <span>:</span>
                            <select
                                className="border border-gray-300 rounded ml-2"
                                value={selectedMinute}
                                onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                            >
                                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                    <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>
                        <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToSchedule}>Add to Schedule</button>
                    </div>
                </div>
                <div className="ml-8 mt-2"> {/* Added mt-2 class */}
                    <h6 className="text-base opacity-70 mb-2">Weekly Schedule:</h6>
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={day}
                                checked={selectedDay === day}
                                onChange={() => setSelectedDay(day)}
                                className="mr-2"
                            />
                            <label htmlFor={day}>{day}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 ml-8">
                <h6 className="text-base opacity-70">Schedule:</h6>
                <ul>
                    {schedule.map((item, index) => (
                        <li key={index} className="mt-2 flex items-center">
                            <span className="mr-4">{item.time}</span>
                            <button
                                className={`ml-4 ${item.active ? 'bg-blue-500' : 'bg-gray-400'} rounded-full w-12 h-6 relative focus:outline-none`}
                                onClick={() => handleToggleTime(item.day, item.time)}
                            >
                                <span
                                    className={`block w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${item.active ? 'translate-x-6' : 'translate-x-0'}`}
                                ></span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveToSchedule}>Save</button>

        </Dialog>
    );
};

export default WidgetDetailsDialog;
