import React, { useEffect, useState } from "react";
import * as user from "../../models/User";
import Dialog from '../generic/Dialog';
import * as deviceModel from "../../models/Device";
import { useNavigate } from "react-router-dom";
import AddWidgetDeviceItem from "../add_widget/AddWidgetDeviceItem";

interface WidgetDetailsDialogProps {
    roomId: string;
    isOpen: boolean;
    onClose: () => void;
    widgetId: string;
}

const WidgetDetailsDialog: React.FC<WidgetDetailsDialogProps> = ({ isOpen, onClose, widgetId }) => {
    // Add your state and logic here

    const navigate = useNavigate();
    const [devices, setDevices] = useState<deviceModel.Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<deviceModel.Device | null>(null);
    

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devicesData = await deviceModel.getDevices();
                setDevices(devicesData);

            } catch (error) {
                if (error instanceof user.AuthenticationError) {
                    user.logOut();
                    navigate("/login");
                    console.log("Credentials Expired");
                } else {
                    console.error('Error fetching devices:', error);
                }
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
                <div className="flex flex-col w-64 h-96 px-4
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
                <div className="w-96 px-1">
                    {/*Widget Options here*/}
                </div>
            </div>
        </Dialog>
    );
};
export default WidgetDetailsDialog;
