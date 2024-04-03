import React, { useState } from 'react';
import * as widget from '../models/Widget'
import * as deviceModel from '../models/Device'
import { useDarkMode } from '../contexts/DarkModeContext';

interface WidgetItemProps {
    widget: widget.Widget
}

const WidgetItem: React.FC<WidgetItemProps> = ({ widget }) => {
    const [deviceState, setDeviceState] = useState(widget.device.measurement.state);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

    const handleDeviceStateChange = async (newValue: string) => {
        setDeviceState(newValue);
        try {
            await deviceModel.updateDeviceState(widget.device._id, newValue);
            const updatedDevice = await deviceModel.getDevice(widget.device._id);
            widget.device = updatedDevice;
        } catch (error) {
            console.error('Error updating device state:', error);
        }
    };

    const renderValueControl = () => {
        switch (widget.device.measurement.type) {
            case "bool":
                return (
                    <div>
                        <button
                            className={`rounded w-full p-1 text-dark-blue dark:text-off-white 
                            ${deviceState === '0' ? 'bg-rose-800' : 'bg-lime-800'}`
                            }
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
                            className="w-full "
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
                            className="relative px-3 rounded-full text-xl hover:dark:bg-slate-500"
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}>
                            ⋮

                        </div>

                        {isMoreMenuOpen &&
                            <div className="absolute right-0 p-1 rounded-lg text-lg
                                bg-off-white dark:bg-slate-700 shadow-md">
                                <div className="block px-3 rounded hover:dark:bg-slate-600">More</div>
                                <div className="block px-3 rounded hover:dark:bg-slate-600 text-red-500">Delete</div>
                            </div>
                        }
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