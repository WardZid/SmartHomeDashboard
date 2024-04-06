import React, { useState } from "react";


export interface SettingsCategory {
    title: string;
    icon: React.ReactNode;
}

interface SettingsCategoryItemProps {
    settingsCategory: SettingsCategory;
    onSelect: (category: SettingsCategory) => void;
    isSelected: boolean;
}

const SettingsCategoryItem: React.FC<SettingsCategoryItemProps> = ({ settingsCategory, onSelect, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleCategoryClick = () => {
        onSelect(settingsCategory);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`py-1 px-2 cursor-pointer rounded-lg flex flex-row items-center w-full
            ${isSelected ? 'bg-slate-400 dark:bg-slate-600' : ''}
            ${isSelected ? '' : 'hover:bg-slate-300 dark:hover:bg-slate-700'}`}
            onClick={handleCategoryClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {settingsCategory.icon}
            <div className={`flex-grow px-2 text-lg text-dark-blue dark:text-white `}>{settingsCategory.title}</div>
            {(isHovered || isSelected) && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 28"
                    width="28"
                    height="28"
                >
                    <path
                        d="M10 19a1 1 0 0 1-.64-.23 1 1 0 0 1-.13-1.41L13.71 12 9.39 6.63a1 1 0 0 1 .15-1.41 1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z"
                        fill="currentColor"
                        transform="translate(0, 2)"
                    />
                </svg>
            )}
        </div>

    );
};

export default SettingsCategoryItem;
