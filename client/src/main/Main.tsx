import React, { useContext, useEffect } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import ProfileSetup from '../profile/ProfileSetup';
import './main.css';
import Landing from '../Landing';
const Main = () => {
  const [showProfileSetup, setShowProfileSetup] = React.useState<boolean>(true);
  const {user} = useContext(AuthContext);
  
  useEffect(() => {
   if(user?.isSetUp){
     setShowProfileSetup(false);
   }
  }, [user]);

  return (
    <div className="main-app">
      {user?
      <ProfileSetup
        showProfileSetup={showProfileSetup}
        setShowProfileSetup={setShowProfileSetup}
      />:<Landing/>}
    </div>
  );
};

export default Main;
