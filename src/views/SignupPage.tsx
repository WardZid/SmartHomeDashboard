import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import * as userModel from '../models/User'
import { useDarkMode } from '../contexts/DarkModeContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [homeId, setHomeId] = useState('65e488cf4e1cb47031e17d01');
  const [showHomeIdInfo, setShowHomeIdInfo] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (await userModel.isLoggedIn()) {
        navigate('/dashboard');
      }
    };
    checkLoggedIn();
  }, []); // Empty dependency array means this effect runs only once, on component mount

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleHomeIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHomeId(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordRepeat(event.target.value);
  };

  const handleSignup = () => {
    //to ensure no one tampers with the home id
    setHomeId('65e488cf4e1cb47031e17d01');

    if (!isValidInput(firstName) ||
      !isValidInput(lastName) ||
      !isValidInput(homeId) ||
      !isValidInput(username) ||
      !isValidInput(password) ||
      !isValidInput(passwordRepeat)) {
      alert("Please fill in all required fields properly");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwords don't match");
      return;
    }

    userModel.register(username, password, firstName, lastName, homeId)
      .then((response) => {
        if (response) {
          navigate("/login");
        } else {
          alert("Something went wrong, please try again");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error);
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
              <h2 className="text-2xl mb-4">Getting Started!</h2>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
              />
              <div className="flex flex-row relative">
                <input
                  type="text"
                  placeholder="Home Code"
                  value={homeId}
                  onChange={handleHomeIdChange}
                  className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
                  readOnly
                />
                <div className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
                  onMouseEnter={() => setShowHomeIdInfo(true)}
                  onMouseLeave={() => setShowHomeIdInfo(false)}>
                  <span className="font-mono">ℹ</span>
                  {showHomeIdInfo &&
                    <div className="bg-white border dark:bg-slate-500 border-gray-300 rounded p-2 shadow-md text-sm absolute top-0 left-full ml-2 w-48">
                      For development purposes, there is only one Home Code.
                    </div>}
                </div>
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
              />
              <input
                type="password"
                placeholder="Repeat Password"
                value={passwordRepeat}
                onChange={handlePasswordRepeatChange}
                className="w-full mb-4 px-3 py-2 rounded bg-white dark:bg-slate-500 dark:placeholder-slate-400"
              />
              <button className="w-full bg-light-blue text-off-white dark:text-dark-blue font-bold py-2 rounded hover:bg-indigo-600"
                onClick={handleSignup}>
                Create Account
              </button>
              <p>Already have an account? <Link to="/login" className='underline '>Log in!</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default SignupPage;
