import React, { useEffect, useState } from "react";
import Dialog from '../Dialog';
import * as deviceModel from "../../models/Device";
import AddWidgetDeviceItem from "./AddWidgetDeviceItem";

interface AddWidgetDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ isOpen, onClose }) => {
    const [devices, setDevices] = useState<deviceModel.Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<deviceModel.Device | null>(null);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devicesData = await deviceModel.getDevices();
                setDevices(devicesData);

            } catch (error) {
                console.error('Error fetching Devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const handleClose = () => {
        setSelectedDevice(null);
        onClose();
    };

    const handleDeviceSelect = (device: deviceModel.Device) => {
        setSelectedDevice(device);
    };

    return (
        <Dialog dialogTitle='Add Widget' isOpen={isOpen} allowCloseX={true} onClose={handleClose}>
            <div className=" flex flex-row">
                <div className="flex flex-col w-64 h-96 px-1
                border-r border-light-blue">
                    <h6 className=" text-base opacity-70">Devices</h6>
                    {devices.map(device => (
                        <AddWidgetDeviceItem
                            key={device._id}
                            device={device}
                            onSelect={handleDeviceSelect}
                            isSelected={selectedDevice !== null && selectedDevice._id === device._id}
                        />
                    ))}
                </div>
            </div>
        </Dialog>
    );
};

export default AddWidgetDialog;

