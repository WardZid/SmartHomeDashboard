import React, { useState } from 'react';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isValid?: (value: string) => boolean;
    mandatory?: boolean;
    infoText?: string;
}

const Input: React.FC<InputProps> = ({
    type = "text",
    placeholder = "",
    value,
    onChange,
    isValid,
    infoText
}) => {
    const [showInfo, setShowInfo] = useState(false);

    var isValidInput = isValid ? isValid(value) : true;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isValidInput = isValid ? isValid(event.target.value) : true;
        onChange(event);
    };
    return (
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleValueChange}
                className={`w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400 ${isValidInput ? '' : 'border-red-500'
                    }`}
            />
            {infoText && (
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                >
                    <span className="font-mono">ℹ</span>
                    {showInfo && (
                        <div className="bg-white border dark:bg-slate-500 border-gray-300 rounded p-2 shadow-md text-sm absolute top-0 left-full ml-2 w-48">
                            {infoText}
                        </div>
                    )}
                </div>
            )}
            {isValidInput ?
                <span className="absolute -left-4 top-2.5 text-green-500 text-sm">✔</span>
                :
                <span className="absolute -left-2 top-2.5 text-red-500 text-sm">!</span>
            }
        </div>
    );
};

export default Input;
