import React from "react";
import Dialog from '../Dialog';

interface AddWidgetDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ isOpen, onClose }) => {

    return (
        <Dialog dialogTitle='Add Widget' isOpen={isOpen} onClose={onClose}>
            <div className=" flex flex-row">
                <div className="flex flex-col space-y-2">
                    
                </div>
            </div>
        </Dialog>
    );
};

export default AddWidgetDialog;

