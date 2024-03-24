import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import * as dbAPI from '../utils/databaseAPI'
import * as user from '../models/User'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (await user.isLoggedIn()) {
        navigate('/dashboard');
      }
    };
    checkLoggedIn();
  }, []); // Empty dependency array means this effect runs only once, on component mount

  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    if (!isValidInput(username) || !isValidInput(password)) {
      alert("Please fill in all required fields properly");
      return;
    }

    dbAPI.login(username, password)
      .then((success) => {
        if (success) {
          // Redirect or navigate to homepage
          // Example using React Router: history.push('/homepage');
          navigate("/dashboard");
        } else {
          alert("Incorrect Username Or Password");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const isValidInput = (inputStr: string) => {
    return inputStr.trim() !== '';
  };

  return (
    <div className='h-screen'>
      <nav className="flex justify-between items-center bg-transparent py-4 px-10 absolute w-full">
        <Logo />
      </nav>

      <div className="flex h-full bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-log-in.jpg)` }}>

        <div className="w-full bg-gray-300 bg-opacity-20 flex items-center justify-center">

          <div className="max-w-md w-full p-10 bg-off-white rounded-xl">
            <h2 className="text-2xl mb-4">Welcome Home!</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full mb-4 px-3 py-2 rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full mb-4 px-3 py-2 rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
              onClick={handleLogin}>
              Login
            </button>
            <p>Don't have an account? <Link to="/signup" className='underline text-dark-blue'>Sign up!</Link></p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
