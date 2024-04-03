import React, { useState } from "react";
import { SettingsCategory } from "./SettingsCategoryItem";
import ComboBox from "../ComboBox";

export interface SettingsItemProps {
    settingsCategory: SettingsCategory;
    title: string;
    type: string;
    values: any;
    selectedValue: any;
    onSelect: (value: any) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ settingsCategory, title, type, values, selectedValue, onSelect }) => {


    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    const renderSettingControl = () => {
        switch (type) {
            case "bool":
                return (
                    <div>
                        <button
                            className={`rounded w-full p-1 text-dark-blue dark:text-off-white 
                            ${selectedValue ? 'bg-rose-800' : 'bg-lime-800'}`
                            }
                            onClick={() => onSelect(selectedValue === '0' ? '1' : '0')}
                        >
                            {selectedValue === '0' ? 'OFF' : 'ON'}
                        </button>
                    </div>
                );
            case "array":
                return (
                    <div className="flex flex-col items-center">
                        <ComboBox options={values} selectedValue={selectedValue} onSelect={onSelect} />
                    </div>
                );
            default:
                return null;
        }
    };

    
    return (
        <div className="border-b ">
            <div
                className={`py-1 px-2 rounded-lg flex flex-row justify-between w-full `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <h2 className="flex-grow text-lg text-dark-blue dark:text-white ">{title}</h2>
                {renderSettingControl()}
            </div>
        </div>


    );
};

export default SettingsItem;
