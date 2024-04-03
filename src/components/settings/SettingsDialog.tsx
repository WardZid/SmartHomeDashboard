import React, { useEffect, useState } from 'react';
import Dialog from '../generic/Dialog';
import SettingsCategoryItem, { SettingsCategory } from './SettingsCategoryItem';
import SettingsItem, { SettingsItemProps } from './SettingsItem';
import { Theme, useDarkMode } from '../../contexts/DarkModeContext';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const { themePreference, setThemePreference } = useDarkMode();
    const [settingsCategories, setSettingsCategories] = useState<SettingsCategory[]>(() => {
        const categories: SettingsCategory[] = [
            { title: "General" },
            { title: "Appearance" }
        ];
        return categories;
    });
    const [selectedSettingsCategory, setSelectedSettingsCategory] = useState<SettingsCategory>(settingsCategories[0]);
    const [settings, setSettings] = useState<SettingsItemProps[]>([]);

    
    useEffect(() => {
        const updatedSettings = [
            {
                settingsCategory: { title: "Appearance" },
                title: "Theme",
                type: "array",
                values: Object.values(Theme).map(theme => ({ value: theme, label: theme })),
                selectedValue: themePreference, // Reflects the current value of themePreference
                onSelect: (theme: Theme) => {
                    setThemePreference(theme); // Update theme preference
                }
            }
        ];
        setSettings(updatedSettings);
    }, [themePreference]);


    const handleClose = () => {
        setSelectedSettingsCategory(settingsCategories[0]);
        onClose();
    };

    const handleCategorySelect = (category: SettingsCategory) => {
        setSelectedSettingsCategory(category);
    };

    return (
        <Dialog dialogTitle='Settings' isOpen={isOpen} allowCloseX={true} onClose={handleClose}>
            <div className=" flex flex-row">
                <div className="flex flex-col w-64 h-96 px-4 space-y-1
                ">
                    {settingsCategories.map(category => (
                        <SettingsCategoryItem
                            key={category.title}
                            settingsCategory={category}
                            onSelect={handleCategorySelect}
                            isSelected={selectedSettingsCategory !== null && selectedSettingsCategory.title === category.title}
                        />
                    ))}
                </div>
                <div className="w-96 px-1">
                    {settings.map(setting => (
                        <SettingsItem
                            key={setting.title}
                            settingsCategory={setting.settingsCategory}
                            title={setting.title}
                            type={setting.type}
                            values={setting.values}
                            selectedValue={setting.selectedValue}
                            onSelect={setting.onSelect}
                        />
                    ))}
                </div>
            </div>
        </Dialog>
    );
};

export default SettingsDialog;