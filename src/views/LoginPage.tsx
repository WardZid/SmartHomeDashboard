import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDarkMode } from '../contexts/DarkModeContext';

import * as userModel from '../models/User'

import Logo from '../components/Logo';
import Input from '../components/generic/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (await userModel.isLoggedIn()) {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = () => {
    if (!isValidInput(username) || !isValidInput(password)) {
      alert("Please fill in all required fields properly");
      return;
    }

    userModel.logIn(username.toLowerCase(), password)
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
    <div className={darkMode ? 'dark' : ''}>
      <div className='h-screen'>
        <nav className="flex justify-between items-center bg-transparent py-4 px-10 absolute w-full">
          <Logo />
        </nav>

        <div className="flex h-full bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg-log-in.jpg)` }}>

          <div className="w-full bg-gray-500 bg-opacity-20 flex items-center justify-center">

            <div className="max-w-md w-full p-10 bg-off-white dark:bg-dark-blue text-dark-blue dark:text-off-white rounded-xl">
              <h2 className="text-2xl mb-4">Welcome Home!</h2>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                isValid={isValidInput}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyPress} 
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                isValid={isValidInput}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyPress} 
              />
              <button className="w-full font-bold py-2 rounded bg-light-blue hover:bg-opacity-90 active:bg-opacity-70 text-off-white dark:text-dark-blue "
                onClick={handleLogin}>
                Login
              </button>
              <p>Don't have an account? <Link to="/signup" className="underline hover:text-light-blue">Sign up!</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default LoginPage;
