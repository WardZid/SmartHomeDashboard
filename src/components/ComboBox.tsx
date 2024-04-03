import React, { useState } from 'react';

export interface Option {
    value: string;
    label: string;
}

interface ComboBoxProps {
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, selectedValue, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(() => {
        return options.find(option => option.value === selectedValue) || null;
    });

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onSelect(option.value);
    };

    return (
        <div className="relative px-2">
            <select
                value={selectedOption ? selectedOption.value : ''}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selected = options.find(option => option.value === selectedValue);
                    if (selected) {
                        handleSelect(selected);
                    }
                }}
                className=" w-full px-4 py-2 pr-8 rounded
                 bg-off-white dark:bg-dark-blue
                 dark:hover:bg-slate-700
                 focus:outline-none"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

        </div>
    );
};

export default ComboBox;
