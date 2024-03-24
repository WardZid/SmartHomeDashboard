import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import WatchingCircle from "./WatchingCircle";
import * as user from '../models/User'

const TopDashboardBar: React.FC = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState<string>("");

    useEffect(() => {
        user.getUserInfo()
            .then((userInfo) => {
                if (userInfo !== null) {
                    setFullName(userInfo.first_name + " " + userInfo.last_name);
                } else {
                    console.error("User info is null");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []); // Empty dependency array ensures the effect runs only once after the initial render

    const handleLogout = () => {
        user.signOut();
        navigate("/login");
    };
    const handleSettings = () => {
    };

    const handleEyeClick = () => {
        navigate("/");
    };
    return (
        <>
            <nav className="flex justify-between items-center bg-off-white px-4 py-2 border-b-2 ">
                <div className="flex justify-center items-center">
                    <div onClick={handleEyeClick}>
                        <WatchingCircle outerCircleColor="#042A35" innerCircleColor="#EEEEEE" />
                    </div>
                    <h1 className="px-2">Hello, {fullName}!</h1>
                </div>

                <div className="flex justify-center items-center">
                    <button className="mx-1 px-2 py-1 rounded hover:bg-slate-300"
                        onClick={handleSettings}>
                        Settings
                    </button>
                    <button className="mx-1 px-2 py-1 rounded hover:bg-slate-300"
                        onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </nav>
        </>
    );
};

export default TopDashboardBar;
