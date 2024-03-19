import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  return (
    <>
      <div className='h-screen overflow-hidden'>
        

        <nav className="flex justify-between items-center bg-transparent py-4 px-10 absolute w-full">
          <div className="text-white text-xl font-bold px-4 py-2 bg-opacity-10 bg-off-white rounded">Smart Home Automation Dashboard</div>
          <div>
            <Link to="/login" className="text-white bg-light-blue px-4 py-2 rounded-md">Login</Link>
            {/* <Link to="/signup" className="bg-light-blue text-white px-4 py-2 rounded-md mr-4">Sign Up</Link> */}
          </div>
        </nav>

        <div className="h-screen overflow-y-scroll" >


          <section className="h-screen flex flex-col justify-center items-center bg-orange text-white snap-align-start">
            <h1 className="text-4xl font-bold mb-4">Welcome to Smart Home Automation</h1>
            <p className="text-lg text-center">Control your home with ease using our intuitive dashboard.</p>
          </section>

          <section className="h-screen flex flex-col justify-center items-center bg-dark-blue text-white snap-align-start">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <ul className="text-lg text-center">
              <li>Manage lighting, temperature, and security systems</li>
              <li>Customize schedules and routines</li>
              <li>Receive real-time notifications</li>
            </ul>
          </section>

          <section className="h-screen flex flex-col justify-center items-center bg-light-blue text-dark-blue snap-align-start">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-center">Transform your home into a smart home today with our easy-to-use dashboard.</p>
          </section>
        </div>

      </div>
    </>
  );
};

export default HomePage;
