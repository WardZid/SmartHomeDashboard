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
            {
                title: "General",
                icon: (
                    <svg width="18px" height="18px" viewBox="0 0 192 192"
                        xmlns="http://www.w3.org/2000/svg" fill="none">
                        <g id="SVGRepo_bgCarrier" stroke-width="0">
                        </g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path fill="currentColor" d="m80.16 29.054-5.958-.709 5.958.71Zm31.68 0-5.958.71 5.958-.71Zm34.217 19.756-2.365-5.515 2.365 5.514Zm10.081 3.352 5.196-3-5.196 3Zm7.896 13.676 5.196-3-5.196 3Zm-2.137 10.407-3.594-4.805 3.594 4.805Zm0 39.51 3.593-4.805-3.593 4.805Zm2.137 10.407 5.196 3-5.196-3Zm-7.896 13.676-5.196-3 5.196 3Zm-10.081 3.353 2.364-5.515-2.364 5.515Zm-34.217 19.755 5.958.709-5.958-.709Zm-31.68 0-5.958.709 5.958-.709Zm-34.217-19.755-2.364-5.515 2.364 5.515Zm-10.08-3.353-5.197 3 5.196-3Zm-7.897-13.676 5.196-3-5.196 3Zm2.137-10.407 3.594 4.805-3.594-4.805Zm0-39.51L26.51 81.05l3.593-4.805Zm-2.137-10.407 5.196 3-5.196-3Zm7.896-13.676-5.196-3 5.196 3Zm10.081-3.352-2.364 5.514 2.364-5.514Zm7.85 3.365-2.365 5.515 2.364-5.515Zm0 87.65 2.364 5.514-2.365-5.514ZM36.235 111.17l-3.594-4.805 3.594 4.805Zm76.823 41.535 5.958.71-5.958-.71Zm39.854-69.742-3.593-4.805 3.593 4.805Zm-16.369-30.074 2.364 5.514-2.364-5.514Zm-23.485-13.594-5.958.709 5.958-.71ZM88.104 16a14 14 0 0 0-13.902 12.345l11.916 1.419A2 2 0 0 1 88.104 28V16Zm15.792 0H88.104v12h15.792V16Zm13.902 12.345A14 14 0 0 0 103.896 16v12a2 2 0 0 1 1.986 1.764l11.916-1.419Zm1.219 10.24-1.219-10.24-11.916 1.419 1.219 10.24 11.916-1.419Zm24.675 4.71-9.513 4.08 4.729 11.028 9.513-4.08-4.729-11.028Zm17.642 5.867a14 14 0 0 0-17.642-5.867l4.729 11.029a2 2 0 0 1 2.521.838l10.392-6Zm7.896 13.676-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-3.74 18.212a14 14 0 0 0 3.74-18.212l-10.392 6a2 2 0 0 1-.535 2.602l7.187 9.61Zm-8.984 6.718 8.984-6.718-7.187-9.61-8.983 6.718 7.186 9.61Zm8.984 23.182-8.984-6.718-7.186 9.61 8.983 6.718 7.187-9.61Zm3.74 18.212a14 14 0 0 0-3.74-18.212l-7.187 9.61a2 2 0 0 1 .535 2.602l10.392 6Zm-7.896 13.676 7.896-13.676-10.392-6-7.896 13.676 10.392 6Zm-17.642 5.867a14 14 0 0 0 17.642-5.867l-10.392-6a2.001 2.001 0 0 1-2.521.838l-4.729 11.029Zm-9.513-4.08 9.513 4.08 4.729-11.029-9.512-4.079-4.73 11.028Zm-16.381 19.03 1.219-10.24-11.916-1.419-1.219 10.24 11.916 1.419ZM103.896 176a14 14 0 0 0 13.902-12.345l-11.916-1.419a2 2 0 0 1-1.986 1.764v12Zm-15.792 0h15.792v-12H88.104v12Zm-13.902-12.345A14 14 0 0 0 88.104 176v-12a2 2 0 0 1-1.986-1.764l-11.916 1.419Zm-1.012-8.504 1.012 8.504 11.916-1.419-1.012-8.504-11.916 1.419ZM51.428 134.31l-7.85 3.366 4.73 11.029 7.849-3.366-4.73-11.029Zm-7.85 3.366a2 2 0 0 1-2.52-.838l-10.392 6a14 14 0 0 0 17.642 5.867l-4.73-11.029Zm-2.52-.838-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-7.896-13.676a2 2 0 0 1 .535-2.602l-7.187-9.61a14 14 0 0 0-3.74 18.212l10.392-6Zm.535-2.602 6.132-4.585-7.187-9.61-6.132 4.585 7.187 9.61ZM26.51 81.05l6.132 4.586 7.187-9.61-6.132-4.586-7.187 9.61Zm-3.74-18.212a14 14 0 0 0 3.74 18.212l7.187-9.61a2 2 0 0 1-.535-2.602l-10.392-6Zm7.896-13.676L22.77 62.838l10.392 6 7.896-13.676-10.392-6Zm17.642-5.867a14 14 0 0 0-17.642 5.867l10.392 6a2 2 0 0 1 2.52-.838l4.73-11.029Zm7.849 3.366-7.85-3.366-4.729 11.029 7.85 3.366 4.729-11.029Zm18.045-18.316-1.012 8.504 11.916 1.419 1.012-8.504-11.916-1.419Zm-1.754 27.552c6.078-3.426 11.69-9.502 12.658-17.63L73.19 36.85c-.382 3.209-2.769 6.415-6.635 8.595l5.893 10.453Zm-21.02 1.793c7.284 3.124 15.055 1.57 21.02-1.793l-5.893-10.453c-3.704 2.088-7.481 2.468-10.398 1.217l-4.73 11.029ZM49 96c0-7.1-2.548-15.022-9.171-19.975l-7.187 9.61C35.36 87.668 37 91.438 37 96h12Zm23.448 40.103c-5.965-3.363-13.736-4.917-21.02-1.793l4.729 11.029c2.917-1.251 6.694-.871 10.398 1.218l5.893-10.454Zm-32.62-20.128C46.452 111.022 49 103.1 49 96H37c0 4.563-1.64 8.333-4.358 10.365l7.187 9.61Zm78.679 19.575c-5.536 3.298-10.517 8.982-11.406 16.446l11.916 1.419c.329-2.765 2.318-5.582 5.632-7.557l-6.142-10.308Zm20.402-1.953c-7.094-3.042-14.669-1.463-20.402 1.953l6.142 10.308c3.382-2.015 6.872-2.372 9.53-1.233l4.73-11.028Zm-53.803 20.135c-.968-8.127-6.58-14.202-12.658-17.629l-5.893 10.454c3.866 2.179 6.253 5.385 6.635 8.594l11.916-1.419ZM141 96c0 6.389 2.398 13.414 8.32 17.842l7.186-9.61C154.374 102.638 153 99.668 153 96h-12Zm8.32-17.842C143.398 82.586 141 89.61 141 96h12c0-3.668 1.374-6.638 3.506-8.232l-7.186-9.61ZM118.507 56.45c5.733 3.416 13.308 4.995 20.401 1.953l-4.729-11.029c-2.658 1.14-6.148.782-9.53-1.233l-6.142 10.31Zm-11.406-16.446c.889 7.464 5.87 13.148 11.406 16.446l6.142-10.309c-3.314-1.974-5.303-4.79-5.632-7.556l-11.916 1.419Z"></path>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M96 120c13.255 0 24-10.745 24-24s-10.745-24-24-24-24 10.745-24 24 10.745 24 24 24Z"></path>
                        </g>
                    </svg>
                )
            },
            {
                title: "Appearance",
                icon: (
                    <svg width="18px" height="18px" viewBox="0 0 16.00 16.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(0)" stroke="#000000" stroke-width="0.00016"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="none" stroke-width="0.032"></g><g id="SVGRepo_iconCarrier"> <path fill="currentColor" d="M8,0 C12.4183,0 16,3.58172 16,8 C16,8.15958 15.9953,8.31807 15.9861,8.47533 C15.9328,9.38596 15.1095,10.0039 14.1974,10.0039 L11.0106,10.0039 C9.22875,10.0039 8.33642,12.1582 9.59635,13.4181 C10.4823,14.304 10.198,15.7959 8.95388,15.9437 C8.6411,15.9809 8.32278,16 8,16 C3.58172,16 0,12.4183 0,8 C0,3.58172 3.58172,0 8,0 Z M8,2 C4.68629,2 2,4.68629 2,8 C2,11.1538 4.4333,13.7393 7.52492,13.9815 C6.059,11.4506 7.82321,8.00391 11.0106,8.00391 L14,8.00391 C14,4.68629 11.3137,2 8,2 Z M5,8 C5.55228,8 6,8.44771 6,9 C6,9.55228 5.55228,10 5,10 C4.44772,10 4,9.55228 4,9 C4,8.44771 4.44772,8 5,8 Z M6,5 C6.55228,5 7,5.44772 7,6 C7,6.55228 6.55228,7 6,7 C5.44772,7 5,6.55228 5,6 C5,5.44772 5.44772,5 6,5 Z M9,4 C9.55228,4 10,4.44772 10,5 C10,5.55228 9.55228,6 9,6 C8.44771,6 8,5.55228 8,5 C8,4.44772 8.44771,4 9,4 Z"></path> </g></svg>
                )
            }
        ];
        return categories;
    });
    const [selectedSettingsCategory, setSelectedSettingsCategory] = useState<SettingsCategory>(settingsCategories[0]);
    const [settings, setSettings] = useState<SettingsItemProps[]>([]);


    useEffect(() => {//use effect as to keep themePreference updated
        const updatedSettings = [
            {
                settingsCategory: settingsCategories[1],
                title: "Theme",
                type: "array",
                values: Object.values(Theme).map(theme => ({ value: theme, label: theme })),
                selectedValue: themePreference,
                onSelect: (theme: Theme) => {
                     // Update theme preference
                    setThemePreference(theme);
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

    const filteredSettings = selectedSettingsCategory.title === "General"
        ? settings
        : settings.filter(setting => setting.settingsCategory.title === selectedSettingsCategory.title);

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
                    {filteredSettings.map(setting => (
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