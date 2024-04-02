import React, { useState } from 'react';
import * as widget from '../models/Widget'
import * as deviceModel from '../models/Device'
import { useDarkMode } from '../contexts/DarkModeContext';

interface WidgetItemProps {
    widget: widget.Widget
}

const WidgetItem: React.FC<WidgetItemProps> = ({ widget }) => {
    const { darkMode } = useDarkMode();
    const [deviceState, setDeviceState] = useState(widget.device.measurement.state);

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
                bg-off-white dark:bg-slate-700
                text-dark-blue dark:text-off-white
                p-4 m-2 w-full h-full
                flex flex-col justify-between
                overflow-hidden`}
            style={{
                userSelect: 'none'
            }}>
            {/*TODO dark mode hover fix*/}
            <div className="flex flex-row">
                <div className=" react-grid-drag-handle
                text-xl mx-1 px-1 rounded-full cursor-grab active:cursor-grabbing hover:bg-slate-600">✣</div>
                <h1 className="text-xl font-semibold">{widget.title}</h1>
            </div>

            {renderValueControl()}
        </div>

    );
};

export default WidgetItem;  