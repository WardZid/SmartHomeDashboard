import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  return (
    <div className='h-screen'>
      <nav className="flex justify-between items-center bg-transparent py-4 px-10 absolute w-full">
          <Logo />
      </nav>

      <div className="flex h-full bg-cover bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-log-in.jpg)` }}>
        
        <div className="w-full bg-gray-300 bg-opacity-10 flex items-center justify-center">
          
          <div className="max-w-md w-full p-10 bg-off-white rounded-xl">
            <h2 className="text-2xl mb-4">Welcome Home!</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 px-3 py-2 rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">Login</button>
            <p>Don't have an account? <Link to="/signup" className='underline text-dark-blue'>Sign up!</Link></p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
