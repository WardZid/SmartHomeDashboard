import React,{useEffect} from 'react';
import TopDashboardBar from '../components/TopDashboardBar';
import { Link, useNavigate } from 'react-router-dom';
import * as user from '../models/User';

const Dashboard = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await user.isLoggedIn();
      if (!loggedIn) {
        // If not logged in, sign out and redirect to login
        user.signOut();
        navigate('/login');
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <div>
      <header>
        <TopDashboardBar/>
      </header>
      <main>
        
      </main>
    </div>
  );
}

export default Dashboard;