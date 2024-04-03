import React, { createContext, useContext, useEffect, useState } from 'react';
import * as lsApi from '../utils/localStorage';

export enum Theme {
    system = 'System',
    light = 'Light',
    dark = 'Dark'
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
        // update themePreference in localStorage
        lsApi.setItem('themePreference', themePreference);

        const updateSystemDarkMode = () => {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };

        if (themePreference === Theme.system) {
            updateSystemDarkMode();
            //create a changelistener for the system's theme
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', updateSystemDarkMode);
            return () => mediaQuery.removeEventListener('change', updateSystemDarkMode);
        } else {
            setDarkMode(themePreference === Theme.dark);
        }


    }, [themePreference]);


    return (
        <DarkModeContext.Provider value={{ darkMode, themePreference, setThemePreference }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
