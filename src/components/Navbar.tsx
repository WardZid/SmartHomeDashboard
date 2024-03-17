import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center bg-dark-blue py-4 px-6">
            <div className="text-white text-xl font-bold">Smart Home Automation Dashboard</div>
            <div>
                <Link to="/login" className="text-white px-4 py-2 rounded-md">Login</Link>
                <Link to="/signup" className="bg-orange text-white px-4 py-2 rounded-md mr-4">Sign Up</Link>
            </div>
        </nav>
    );
};

export default Navbar;
