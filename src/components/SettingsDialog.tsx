import React from 'react';
import Dialog from './Dialog';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog dialogTitle='Settings' isOpen={isOpen} allowCloseX={true} onClose={onClose}>
            
            <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                    <input type="checkbox" id="darkMode" name="darkMode" className="mr-2" />
                    <label htmlFor="darkMode">Dark Mode</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="notifications" name="notifications" className="mr-2" />
                    <label htmlFor="notifications">Notifications</label>
                </div>
                {/* Add more settings options as needed */}
            </div>
        </Dialog>
    );
};

export default SettingsDialog;