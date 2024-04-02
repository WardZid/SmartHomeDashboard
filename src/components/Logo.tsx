import React from "react";
import { useNavigate } from 'react-router-dom';
import WatchingCircle from "./WatchingCircle";
import { useDarkMode } from "../contexts/DarkModeContext";



const Logo: React.FC = () => {
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const handleLogoClick = () => {
        navigate("/");
    };
    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="flex items-center px-2 rounded-xl cursor-pointer bg-off-white dark:bg-dark-blue"
                onClick={handleLogoClick}>
                <WatchingCircle innerCircleColor={darkMode ? "#042A35" : "#EEEEEE"} outerCircleColor={darkMode ? "#EEEEEE" : "#042A35"} />
                <div className="text-dark-blue dark:text-off-white text-2xl font-bold px-2 py-2">Smart Home Automation Dashboard</div>
            </div>
        </div>
    );
};

export default Logo;

