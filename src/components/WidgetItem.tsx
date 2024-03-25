import React, { useState } from 'react';
import * as widget from '../models/Widget'
import * as deviceModel from '../models/Device'

interface WidgetItemProps {
    widget: widget.Widget
}

const WidgetItem: React.FC<WidgetItemProps> = ({ widget }) => {
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
                            className={`rounded w-full p-1 text-off-white
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
                    <div className="flex flex-col">
                        <h6>{deviceState}</h6>
                        <input
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
            className="rounded border-2 
                border-dark-blue
                bg-off-white 
                p-4 m-2 w-48 h-48 
                flex flex-col">
            <h1>{widget.title}</h1>
            {renderValueControl()}
        </div>
    );
};

export default WidgetItem;  