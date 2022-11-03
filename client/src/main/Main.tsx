import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';

import { auth } from '../firebase-auth';
import { AuthContext } from "../Auth/ContextProvider";

const Main = () => {
  const user = useContext(AuthContext);
  console.log(user);

  return <></>;
};

export default Main;
