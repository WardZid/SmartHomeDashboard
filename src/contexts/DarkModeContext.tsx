import React, { createContext, useContext, useEffect, useState } from 'react';
import * as lsApi from '../utils/localStorage';

enum Theme {
    system = 'system',
    light = 'light',
    dark = 'dark'
}
type DarkModeContextType = {
    darkMode: boolean;
    themePreference: Theme;
    setThemePreference: (preference: Theme) => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    themePreference: Theme.system,
    setThemePreference: () => { },
});

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const [themePreference, setThemePreference] = useState<Theme>(() => {
        //fetch from local storage the theme preference
        const savedThemePreference = lsApi.getItem('themePreference');
        //set as system if it doesnt exist
        return savedThemePreference || Theme.system;
    });
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        //check if theme is system, and get system's prefered theme
        if (themePreference === Theme.system) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        return themePreference === Theme.dark;
    });

    useEffect(() => {
        const updateDarkMode = () => {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        updateDarkMode(); // Initial call

        const handleChange = () => updateDarkMode();

        if (themePreference === Theme.system) {
            //create a changelistener for the system's theme
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        // update themePreference in localStorage
        lsApi.setItem('themePreference', themePreference);

    }, [themePreference]);


    return (
        <DarkModeContext.Provider value={{ darkMode, themePreference, setThemePreference }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
