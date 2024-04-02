import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';


interface SettingsDialogProps {
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onClose }) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            
        </div>

    );
};

export default SettingsDialog;
