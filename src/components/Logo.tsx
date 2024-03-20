import React from "react";
import WatchingCircle from "./WatchingCircle";

const Logo: React.FC = () => {
    

    return (
        <>
            <div className="flex items-center px-2">
                <WatchingCircle innerCircleColor="#F05622" />
                <div className="text-off-white text-2xl font-bold px-2 py-2">Smart Home Automation Dashboard</div>
            </div>
        </>
    );
};

export default Logo;
