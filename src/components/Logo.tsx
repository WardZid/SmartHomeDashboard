import React from "react";
import WatchingCircle from "./WatchingCircle";


const Logo: React.FC = () => {
    

    return (
        <>
            <div className="flex items-center px-2 bg-off-white rounded-xl">
                <WatchingCircle innerCircleColor="#EEEEEE" outerCircleColor="#042A35" />
                <div className="text-dark-blue text-2xl font-bold px-2 py-2">Smart Home Automation Dashboard</div>
            </div>
        </>
    );
};

export default Logo;

