import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const SettingsDialog: React.FC = () => {
    const { themePreference, setThemePreference } = useDarkMode();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = event.target.value as 'light' | 'dark' | 'system';
        //setThemePreference(selectedTheme);
    };

    return (
        <div>
            <h2>Theme Preferences</h2>
            <label>
                Select Theme Preference:
                <select value={themePreference} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                </select>
            </label>
        </div>
    );
};

export default SettingsDialog;
