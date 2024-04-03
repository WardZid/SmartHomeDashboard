import React from 'react';

interface DialogProps {
    dialogTitle: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ dialogTitle, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                <div className="relative rounded-lg min-w-80
                 bg-off-white dark:bg-dark-blue
                 text-dark-blue dark:text-off-white">
                    <div className="flex flex-row justify-between p-4 border-b border-light-blue">
                        <h1 className="text-lg font-bold">{dialogTitle}</h1>
                        <button
                            className=""
                            onClick={onClose}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
