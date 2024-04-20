import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as user from "../../models/User";
import * as eventModel from "../../models/Event";
import * as widgetModel from '../../models/Widget';
import Dialog from '../generic/Dialog';

interface WidgetDetailsDialogProps {
    widgetId: string;
    isOpen: boolean;
    onClose: () => void;
}


const WidgetDetailsDialog: React.FC<WidgetDetailsDialogProps> = ({ widgetId, isOpen, onClose }) => {
    const navigate = useNavigate();

    const [widget, setWidget] = useState<widgetModel.Widget>();
    const [eventSchedule, setEventSchedule] = useState<eventModel.Event[]>([]);

    //new event time and state for entry
    const [newEventTime, setNewEventTime] = useState<string>('00:00');
    const [newState, setNewState] = useState<string>('0');

    //display only
    const [currentTime, setCurrentTime] = useState<Date>(new Date());


    useEffect(() => {
        if (isOpen) {

            const fetchWidget = () => {
                try {
                    widgetModel
                        .getWidget(widgetId)
                        .then((widgetData) => {
                            setWidget(widgetData);

                        })
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
        }
    }, [isOpen]);

    useEffect(() => {
        if (widget) {

            try {
                eventModel
                    .getEvents(widget.device_id)
                    .then((events) => {
                        setEventSchedule(events);
                    })
            } catch (error) {
                if (error instanceof user.AuthenticationError) {
                    user.logOut();
                    navigate("/login");
                    console.log("Credentials Expired");
                } else {
                    console.error('Error fetching events:', error);
                }
            }

        }
    }, [widget]);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleDeleteWidget = async () => {
        if (widget) {
            try {

                widgetModel.deleteWidget(widget._id).then(() => {

                    handleClose();
                });
            } catch (error) {
                console.error('Error deleting widget:', error);
            }
        }
    };

    const handleClose = () => {
        setWidget(undefined);
        setEventSchedule([]);
        setNewEventTime('00:00')
        setNewState('');
        onClose();
    };

    const handleAddToSchedule = () => {
        if (widget) {
            if (newState === '')
                return;

            //preparing time for event
            const [hourStr, minuteStr] = newEventTime.split(":");
            const hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);

            if (isNaN(hour) || isNaN(minute)) {
                console.error("Invalid time input format");
                return null;
            }

            const now = new Date();
            const eventDateTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hour,
                minute
            );

            // Check if the time has already passed today
            if (eventDateTime < now) {
                // add 1 day 
                eventDateTime.setDate(eventDateTime.getDate() + 1);
            }

            eventModel
                .addEvent(widget.device_id, eventDateTime, '0000000', newState, true)
                .then((response) => {
                    setNewEventTime('00:00')
                    setNewState('');

                    const newEvent: eventModel.Event = {
                        _id: response.insertedId,
                        device_id: widget.device_id,
                        datetime: eventDateTime,
                        week_days: "0000000",
                        state: newState,
                        active: true,
                    }

                    eventSchedule.push(newEvent);
                });
        }
    };

    const handleDeleteScheduleItem = (eventId: string,) => {
        eventModel.deleteEvent(eventId).then(() => {
            const updatedEventSchedule = eventSchedule.filter(item => item._id !== eventId); //copy array without this event
            setEventSchedule(updatedEventSchedule);
        });
    };

    const handleToggleWeekDay = (eventId: string, daysOfWeek: string, dayIndex: number) => {
        if (widget) {

            let daysArray = daysOfWeek.split('');

            // Flip the bit at the corresponding index
            daysArray[dayIndex] = daysArray[dayIndex] === '0' ? '1' : '0';

            const updatedDaysOfWeek = daysArray.join('');


            eventModel.updateDaysOfWeek(eventId, updatedDaysOfWeek).then(() => {

                // Update the eventSchedule state
                const updatedEventSchedule = [...eventSchedule]; // Create a copy of the current state
                const updatedItemIndex = updatedEventSchedule.findIndex(item => item._id === eventId); // Find the index of the updated item
                if (updatedItemIndex !== -1) {
                    updatedEventSchedule[updatedItemIndex].week_days = updatedDaysOfWeek; // Update the days of the week in the copy
                    setEventSchedule(updatedEventSchedule); // Update the state with the modified copy
                }
            })

        }
    }
    const handleToggleEventActive = (eventId: string, oldActive: boolean) => {


        const updateActive = (eventId: string, activeState: boolean) => {
            // Update the eventSchedule active
            const updatedEventSchedule = [...eventSchedule]; // Create a copy of the current usestate of events
            const updatedItemIndex = updatedEventSchedule.findIndex(item => item._id === eventId); // Find the index of the updated item
            if (updatedItemIndex !== -1) {
                updatedEventSchedule[updatedItemIndex].active = activeState;
                setEventSchedule(updatedEventSchedule);
            }
        };

        //UPDATE LOCAL VALUE 
        const newActive = !oldActive;
        updateActive(eventId, newActive);


        eventModel
            .updateActive(eventId, newActive)
            .then((response) => {
                if (response.modifiedCount === 0) {
                    //IF MODIFICATION UNSUCCESSFUL, RETURN ACTIVE TO OLD VALUE
                    updateActive(eventId, oldActive);
                }
            })
            .catch((error) => {
                //IF MODIFICATION UNSUCCESSFUL, RETURN ACTIVE TO OLD VALUE
                updateActive(eventId, oldActive);
            });
    }

    return (
        <Dialog dialogTitle={widget ? widget.title : 'Widget does not exist'} isOpen={isOpen} allowCloseX={true} onClose={handleClose}>

            <div className="flex flex-col h-full">
                <div className="flex items-center justify-evenly">

                    <h6 className="text-base opacity-70">Current Time</h6>
                    <p className="text-lg font-bold">{`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`}</p>

                </div>
                <div className="flex-grow overflow-auto p-1">
                    <div className="flex flex-row justify-around p-1 mx-2 my-1 items-end border border-light-blue rounded">
                        {
                            widget &&
                            widget.device.measurement.type === "bool" &&
                            <div className="flex flex-col items-center">
                                <div className="w-full text-sm text-slate-500">Do</div>
                                <button
                                    className={`rounded w-24 p-1 px-4  text-off-white ${newState === '0' || newState === '' ? 'bg-rose-800' : 'bg-lime-800'}`}
                                    onClick={() => setNewState(newState === '0' || newState === '' ? '1' : '0')}
                                >
                                    {newState === '0' || newState === '' ? 'Turn Off' : 'Turn On'}
                                </button>
                            </div>

                        }
                        {
                            widget &&
                            widget.device.measurement.type === "int" &&
                            <div className="flex flex-col items-center">
                                <div className="w-full text-sm text-slate-500">Set</div>
                                <input
                                    type="number"
                                    value={newState}
                                    step={1}
                                    min={widget.device.measurement.min}
                                    max={widget.device.measurement.max}
                                    onChange={(e) => setNewState(e.target.value)}
                                    className="border dark:border-slate-700 rounded p-1 text-center dark:bg-slate-700 w-32"
                                    placeholder="-"
                                />
                            </div>
                        }

                        <div className="flex flex-col items-center">
                            <div className="w-full text-sm text-slate-500">At</div>
                            <input
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                                className="rounded p-1 text-center dark:bg-slate-700 w-32"
                            />
                        </div>
                        <button className={`bg-light-blue p-1 rounded h-12 w-16 text-base font-semibold ${newState === '' ? 'opacity-45' : ''} `} onClick={handleAddToSchedule}>Add</button>

                    </div>

                    <div className={`overflow-y-scroll h-80 max-h-96`}>
                        <ul>
                            {eventSchedule.map((item) => (
                                <li key={item._id} className="mt-2 flex flex-col gap-2 p-4 rounded-lg bg-slate-200 dark:bg-slate-800">
                                    <div className="flex flex-row items-center justify-between">

                                        <span className="mr-4 text-2xl font-bold">{new Date(item.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <button
                                            className={`ml-4 ${item.active ? 'bg bg-light-blue' : 'bg-gray-400'} rounded-full w-12 h-6 relative focus:outline-none`}
                                            onClick={() => handleToggleEventActive(item._id, item.active)}
                                        >
                                            <span
                                                className={`block w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${item.active ? 'translate-x-6' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold text-sm text-slate-500">Set Device to: </h6>
                                        <div className="font-bold">
                                            {
                                                widget &&
                                                widget.device.measurement.type === "bool" &&
                                                <div className={`rounded w-24 p-1 px-4  text-off-white text-center ${item.state === "0" ? 'bg-rose-800' : 'bg-lime-800'}`}>
                                                    {item.state === '0' ? 'OFF' : 'ON'}
                                                </div>
                                            }
                                            {
                                                widget &&
                                                widget.device.measurement.type === "int" &&
                                                <div className={`rounded w-24 p-1 px-4 text-center border border-slate-500`}>
                                                    {item.state}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-end">
                                        <div className="flex flex-col">
                                            <h6 className="font-semibold text-sm text-slate-500">Repeat</h6>
                                            <div className="flex flex-row gap-1">
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 64 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 0) }} >Sun</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 32 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 1) }} >Mon</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 16 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 2) }} >Tue</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 8 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 3) }} >Wed</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 4 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 4) }} >Thu</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 2 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 5) }} >Fri</button>
                                                <button className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${parseInt(item.week_days, 2) & 1 ? "bg-slate-300 dark:bg-slate-700" : ''} `} onClick={() => { handleToggleWeekDay(item._id, item.week_days, 6) }} >Sat</button>
                                            </div>
                                        </div>
                                        <img
                                            className="h-6 opacity-50 hover:opacity-70 cursor-pointer"
                                            src={`${process.env.PUBLIC_URL}/icons/delete-room.png`}
                                            alt="Delete"
                                            onClick={() => handleDeleteScheduleItem(item._id)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-light-blue px-4 pt-4 flex flex-row-reverse">
                    <button className="px-4 py-2 rounded text-rose-500 font-bold" onClick={handleDeleteWidget}>Delete Widget </button>
                </div>
            </div>

        </Dialog>
    );
};

export default WidgetDetailsDialog;
