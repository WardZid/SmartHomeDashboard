import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import * as userModel from '../models/User'
import { useDarkMode } from '../contexts/DarkModeContext';
import Input from '../components/generic/Input';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [homeId, setHomeId] = useState('65e488cf4e1cb47031e17d01');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');


  const [conditionChecked, setConditionChecked] = useState(false);

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

    var allInputsValid = (isValidInput(firstName) ||
      isValidInput(lastName) ||
      isValidInput(homeId) ||
      isValidInput(username) ||
      isValidPassword(password) ||
      isValidPasswordRepeat(password, passwordRepeat)
    );

    if (allInputsValid === false) {
      alert("Please fill in all required fields properly");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwords don't match");
      return;
    }


    if(conditionChecked === false){
      alert("Please accept the terms and conditions");
      return
    }
    userModel.register(username.toLowerCase(), password, firstName, lastName, homeId)
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

  const isValidPassword = (value: string) => {
    return isValidInput(value) && value.length >= 6 && value.length <= 128;
  };

  const isValidPasswordRepeat = (password: string, repeatPassword: string) => {
    const isValidRepeat = (
      password === repeatPassword
    );
    setPasswordMatchMessage(
      isValidRepeat ? "" : "The password you entered does not match"
    )
    return (
      isValidPassword(repeatPassword) &&
      isValidRepeat
    );
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
              <div className="text-sm text-slate-600 dark:text-slate-300">Personal Information</div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                isValid={isValidInput}
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                isValid={isValidInput}
              />
              <div className="text-sm text-slate-600 dark:text-slate-300">Home Device Information</div>
              <Input
                type="text"
                placeholder="Home Code"
                value={homeId}
                onChange={handleHomeIdChange}
                isValid={isValidInput}
                infoText="For development purposes, there is only one Home Code."
              />
              <div className="text-sm text-slate-600 dark:text-slate-300">Account Credentials</div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                isValid={isValidInput}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                isValid={isValidPassword}
                infoText="password must be between 6 and 128 characters"
              />
              <Input
                type="password"
                placeholder="Repeat Password"
                value={passwordRepeat}
                onChange={handlePasswordRepeatChange}
                isValid={(value) => isValidPasswordRepeat(password, value)}
                infoText={passwordMatchMessage}
              />
              <div className="my-1 text-sm">
                <input
                  className="mx-2"
                  type="checkbox"
                  checked={conditionChecked}
                  onChange={() => setConditionChecked(!conditionChecked)}
                />
                I accept to the <Link to="" onClick={()=> alert("We JUST told you not to read the Terms and Conditions!")} className="underline hover:text-light-blue">Terms and Conditions</Link> without reading.
              </div>

              <button className="w-full bg-light-blue text-off-white dark:text-dark-blue font-bold py-2 rounded hover:bg-indigo-600"
                onClick={handleSignup}>
                Create Account
              </button>
              <p>Already have an account? <Link to="/login" className="underline hover:text-light-blue">Log in!</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default SignupPage;
