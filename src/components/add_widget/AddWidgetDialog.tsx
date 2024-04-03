import React, { useEffect, useState } from "react";
import Dialog from '../Dialog';
import * as deviceModel from "../../models/Device";
import AddWidgetDeviceItem from "./AddWidgetItem";

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
                // if (roomsData.length > 0) {
                //     setSelectedDevice(roomsData[0]);
                // }

            } catch (error) {
                console.error('Error fetching rooms:', error);
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
        <Dialog dialogTitle='Add Widget' isOpen={isOpen} onClose={handleClose}>
            <div className=" flex flex-row">
                <div className="flex flex-col w-64
                border-r border-light-blue">
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

