import React, { useState } from 'react';
import Dialog from '../Dialog';
import SettingsCategoryItem from './SettingsCategoryItem';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}
export interface SettingsCategory {
    title: string;
}
const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const [SettingsCategories, setSettingsCategories] = useState<SettingsCategory[]>(() => {
        const categories: SettingsCategory[] = [
            { title: "General" },
            { title: "Appearance" }
        ];
        return categories;
    });
    const [selectedSettingsCategory, setSelectedSettingsCategory] = useState<SettingsCategory | null>(null);

    const handleClose = () => {
        setSelectedSettingsCategory(null);
        onClose();
    };

    const handleCategorySelect = (category: SettingsCategory) => {
        setSelectedSettingsCategory(category);
    };

    return (
        <Dialog dialogTitle='Settings' isOpen={isOpen} allowCloseX={true} onClose={handleClose}>

            <div className="flex flex-col w-64 px-1
                border-r border-light-blue">
                {SettingsCategories.map(category => (
                    <SettingsCategoryItem
                        key={category.title}
                        settingsCategory={category}
                        onSelect={handleCategorySelect}
                        isSelected={selectedSettingsCategory !== null && selectedSettingsCategory.title === category.title}
                    />
                ))}
            </div>
        </Dialog>
    );
};

export default SettingsDialog;