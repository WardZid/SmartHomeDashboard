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
        <div className="relative">
            <select
                value={selectedOption ? selectedOption.value : ''}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selected = options.find(option => option.value === selectedValue);
                    if (selected) {
                        handleSelect(selected);
                    }
                }}
                className=" w-full px-4 pr-8 rounded shadow leading-tight
                 bg-off-white dark:bg-dark-blue focus:outline-none focus:border-gray-500"
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
