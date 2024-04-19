import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

import * as user from "../../models/User";
import * as widgetModel from '../../models/Widget'
import * as deviceModel from '../../models/Device'


interface WidgetItemProps {
    widget: widgetModel.Widget;
    onDetailsOpen: (widgetId: string) => void;
}

const WidgetItem: React.FC<WidgetItemProps> = ({ widget, onDetailsOpen }) => {
    const navigate = useNavigate();
    const [deviceState, setDeviceState] = useState(widget.device.measurement.state);
    // const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [selectedHistoryRange, setSelectedHistoryRange] = useState<string>(() => {
        return widget.history_range ? widget.history_range : '1D';
    });

    const [historyByRange, setHistoryByRange] = useState<deviceModel.History[]>([]);


    //handle control widget actions
    const handleDeviceStateChange = async (newValue: string) => {
        setDeviceState(newValue);
        try {
            await deviceModel.updateDeviceState(widget.device._id, newValue);
            const updatedDevice = await deviceModel.getDevice(widget.device._id);
            widget.device = updatedDevice;
        } catch (error) {
            if (error instanceof user.AuthenticationError) {
                user.logOut();
                navigate("/login");
                console.log("Credentials Expired");
            } else {
                console.error('Error updating device state:', error);
            }
        }
    };
    const handleOpenDetails = () => {
        onDetailsOpen(widget._id);
    };

    const getHistoryByRange = (range: string) => {
        const currentDate = new Date();
        let startDate: Date;

        switch (range) {
            case "1D":
                startDate = new Date(currentDate);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "1W":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of the current week
                startDate.setHours(0, 0, 0, 0);
                break;
            case "1M":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "MTD":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 30); // 30 days ago
                startDate.setHours(0, 0, 0, 0);
                break;
            case "6M":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "1Y":
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "YTD":
                startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
                startDate.setHours(0, 0, 0, 0);
                break;
            case "All":
                startDate = new Date(0); // Beginning of time
                break;
            default:
                startDate = new Date(0); // Default start date (all history)
                break;
        }

        // Filter the history array based on the start date
        return widget.device.history.filter(item => new Date(item.datetime) >= startDate);
    };

    useEffect(() => {
        if (widget.type === "history" && widget.device.history) {
            //filter history
            setHistoryByRange(getHistoryByRange(selectedHistoryRange));
        }

    }, [selectedHistoryRange])

    function generateDateLabels(startDate: Date, endDate: Date): string[] {
        const dateLabels: string[] = [];
        const currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);

        while (currentDate <= endDateObj) {
            dateLabels.push(currentDate.toLocaleDateString()); // Format date as per locale
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateLabels;
    }
    function generateHourMinuteLabels(): string[] {
        const hourMinuteLabels: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) { // Increment by 15 minutes
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                hourMinuteLabels.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        return hourMinuteLabels;
    }


    //Set up line chart for history widgets
    useEffect(() => {
        if (widget.type === "history" && widget.device.history) {
            //update chart
            const ctx = chartRef.current?.getContext('2d');
            if (ctx) {

                var myLabels: string[] = [];


                const today = new Date();
                switch (selectedHistoryRange) {
                    case "1D":
                        myLabels = generateHourMinuteLabels();
                        break;
                    case "1W":
                        const sundayDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
                        sundayDate.setHours(0, 0, 0, 0);
                        const saturdayDate = new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay())));
                        saturdayDate.setHours(23, 59, 59, 999);

                        myLabels = generateDateLabels(sundayDate, saturdayDate);
                        break;
                    case "1M":
                        const startDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
                        const endDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
                        myLabels = generateDateLabels(startDateOfMonth, endDateOfMonth);
                        break;
                    case "MTD":
                        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
                        myLabels = generateDateLabels(thirtyDaysAgo, today);
                        break;
                    case "6M":
                        const sixMonthsAgo = new Date(new Date().getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
                        myLabels = generateDateLabels(sixMonthsAgo, today);
                        break;
                    case "1Y":
                        const startOfYear = new Date(new Date().getFullYear(), 1, 1, 0, 0, 0, 0);
                        const endOfYear = new Date(new Date().getFullYear() + 1, 1, 0, 0, 0, 0, 0);
                        endOfYear.setMilliseconds(endOfYear.getMilliseconds() - 1);
                        myLabels = generateDateLabels(startOfYear, endOfYear);
                        break;
                    case "YTD":
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                        myLabels = generateDateLabels(oneYearAgo, today);
                        break;
                    case "All":
                        myLabels = historyByRange.map(entry => new Date(entry.datetime).toLocaleDateString());
                        break;
                    default:
                        myLabels = historyByRange.map(entry => entry.datetime.toLocaleString());
                        break;
                }


                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: myLabels,
                        datasets: [{
                            label: '',
                            data: historyByRange.map(entry => entry.state),
                            borderColor: '#F05622',
                            tension: 0.1,
                            fill: true
                        }]
                    },
                    options: {
                        animation: {
                            duration: 0 // Disable animations to improve performance
                        },
                        responsive: true, // Enable responsiveness
                        maintainAspectRatio: false, // Allow the chart to resize with its container

                        scales: {
                            x: {
                                display: false // Hide x-axis to simplify the chart
                            },
                        }
                    }
                });
                return () => {
                    myChart.destroy()
                }
            }
        }

    }, [historyByRange]);

    const renderValueControl = () => {
        switch (widget.type) {
            case "control": {

                switch (widget.device.measurement.type) {
                    case "bool":
                        return (
                            <div>
                                <button
                                    className={`rounded w-full p-1 text-off-white ${deviceState === '0' ? 'bg-rose-800' : 'bg-lime-800'}`}
                                    onClick={() => handleDeviceStateChange(deviceState === '0' ? '1' : '0')}
                                >
                                    {deviceState === '0' ? 'OFF' : 'ON'}
                                </button>
                            </div>
                        );
                    case "int":
                        return (
                            <div className="flex flex-col items-center">
                                <h6>{deviceState}</h6>
                                <input
                                    className="w-full"
                                    type="range"
                                    min={widget.device.measurement.min}
                                    max={widget.device.measurement.max}
                                    value={deviceState}
                                    onChange={(event) => setDeviceState(event.target.value)} //changes loacl value
                                    onMouseUp={() => handleDeviceStateChange(deviceState)} //changes db value on release
                                />
                            </div>
                        );
                    default:
                        return null;
                }
            }
            case "history": {
                if (widget.device.history) {
                    return (
                        <div className="flex flex-col max-h-full pb-14">
                            <div className="flex flex-row gap-2 px-16">
                                <button onClick={() => handleRangeSelect('1D')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  ${selectedHistoryRange === '1D' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>1D</button>
                                <button onClick={() => handleRangeSelect('1W')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  ${selectedHistoryRange === '1W' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>1W</button>
                                <button onClick={() => handleRangeSelect('1M')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  ${selectedHistoryRange === '1M' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>1M</button>
                                <button onClick={() => handleRangeSelect('MTD')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${selectedHistoryRange === 'MTD' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>MTD</button>
                                <button onClick={() => handleRangeSelect('6M')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  ${selectedHistoryRange === '6M' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>6M</button>
                                <button onClick={() => handleRangeSelect('1Y')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700  ${selectedHistoryRange === '1Y' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>1Y</button>
                                <button onClick={() => handleRangeSelect('YTD')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${selectedHistoryRange === 'YTD' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>YTD</button>
                                <button onClick={() => handleRangeSelect('All')} className={`px-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${selectedHistoryRange === 'All' ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>All</button>
                            </div>
                            <canvas ref={chartRef} />
                        </div>
                    );
                }
                return null;
            }
            default:
                return null;

        }

    };


    const handleRangeSelect = (range: string) => {
        setSelectedHistoryRange(range);
        // You can perform any additional actions here, like fetching data for the selected range
        widgetModel.updateWidgetHistoryRange(widget._id, range);
    };

    return (
        <div
            className={`
                rounded 
                bg-off-white dark:bg-slate-800  
                text-dark-blue dark:text-off-white
                w-full h-full
                flex flex-col
                overflow-hidden
                shadow-lg
                border-dark-blue`}
            style={{
                userSelect: 'none'
            }}
        >
            <div className="h-4 bg-light-blue
             react-grid-drag-handle cursor-grab active:cursor-grabbing">
                {/*Top bar for moving*/}
            </div>
            <div className=" p-2 flex flex-col justify-between overflow-hidden flex-grow">

                <div className="flex flex-row">
                    <h1 className="text-xl font-semibold flex-grow">{widget.title}</h1>
                    <div>
                        <div
                            className="relative rounded-sm text-xl hover:dark:bg-slate-500"
                            onClick={handleOpenDetails}>
                            <svg fill="currentColor" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"><path d="M3,4V20a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H4A1,1,0,0,0,3,4ZM5,5H19V19H10V15a1,1,0,0,0-1-1H5Zm6.293,7.707a1,1,0,0,1,0-1.414L14.086,8.5H13a1,1,0,0,1,0-2h3.5a1.01,1.01,0,0,1,.382.077A1,1,0,0,1,17.5,7.5V11a1,1,0,0,1-2,0V9.914l-2.793,2.793A1,1,0,0,1,11.293,12.707Z"></path></g></svg>

                        </div>

                        {/* {isMoreMenuOpen &&
                            <div className="absolute right-0 p-1 rounded-lg text-lg
                                bg-off-white dark:bg-slate-700 shadow-md">
                                <div className="block px-3 rounded hover:dark:bg-slate-600">More</div>
                                <div className="block px-3 rounded hover:dark:bg-slate-600 text-red-500">Delete</div>
                            </div>
                        } */}
                    </div>

                </div>

                {renderValueControl()}
            </div>
            {/* {isMoreMenuOpen &&
                <button
                    className="fixed inset-0 h-full w-full bg-red-500"
                    onClick={() => setIsMoreMenuOpen(false)}></button>
            } */}
        </div>

    );
};

export default WidgetItem;  