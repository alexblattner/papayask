import React, { useContext, useEffect } from "react";

import { AuthContext } from "../Auth/ContextProvider";
import ProfileSetup from "../profile/ProfileSetup";
import "./main.css";
import Landing from "../Landing";
import Toasts from "../Notifications/Toast";
import { NotificationsContext } from "../Notifications/notificationsContext";
const Main = () => {
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && !user.isSetUp) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [user]);

  return (
    <div className="main-app">
      <Landing />
    </div>
  );
};

export default Main;
