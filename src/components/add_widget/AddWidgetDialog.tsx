import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as user from "../../models/User";
import * as deviceModel from "../../models/Device";
import * as widgetModel from "../../models/Widget";


import Dialog from '../generic/Dialog';
import AddWidgetDeviceItem from "./AddWidgetDeviceItem";
import AddWidgetItemsPanel from "./AddWidgetItemsPanel";

interface AddWidgetDialogProps {
    roomId: string;
    isOpen: boolean;
    onClose: () => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ roomId, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<deviceModel.Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<deviceModel.Device | null>(null);
    const [selectedWidget, setSelectedWidget] = useState<widgetModel.Widget | null>(null);


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
        setSelectedWidget(null);
        onClose();
    };

    const handleDeviceSelect = (device: deviceModel.Device) => {
        setSelectedWidget(null);
        setSelectedDevice(device);
    };

    const handleWidgetSelect = (widget: widgetModel.Widget) => {
        setSelectedWidget(widget);
    };

    const handleAddWidgetButton = () => {
        try {
            if (selectedDevice && selectedWidget) {

                widgetModel.addWidget(selectedDevice._id, roomId, selectedWidget.title, selectedWidget.type, -1, -1, selectedWidget.row_span, selectedWidget.col_span)
                    .then((response) => {
                        onClose();
                    })
                    .catch((error) => {
                        if (error instanceof user.AuthenticationError) {
                            user.logOut();
                            navigate("/login");
                            console.log("Credentials Expired");
                        } else {
                            console.error('Error:', error);
                        }
                    });
            }
        } catch (error) {
            if (error instanceof user.AuthenticationError) {
                user.logOut();
                navigate("/login");
                console.log("Credentials Expired");
            } else {
                console.error('Error deleting room:', error);
            }
        }
    };

    return (
        <Dialog dialogTitle='Add Widget' isOpen={isOpen} allowCloseX={true} onClose={handleClose}>
            <div className="flex flex-row max-h-96">
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
                <div
                    className="flex flex-col-reverse min-w-96 px-1"

                >
                    <button
                        className={`w-full py-2 rounded
                        bg-light-blue text-dark-blue font-bold 
                        ${selectedWidget ? ' hover:bg-opacity-90 active:bg-opacity-70' : 'bg-opacity-50 cursor-auto'}`}
                        onClick={handleAddWidgetButton}
                    >Add Widget</button>

                    {selectedDevice &&
                        <AddWidgetItemsPanel
                            key={selectedDevice._id}
                            device={selectedDevice}
                            onSelect={handleWidgetSelect}
                        />
                    }
                </div>
            </div>
        </Dialog>
    );
};

export default AddWidgetDialog;

