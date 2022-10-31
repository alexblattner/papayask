import React, { useContext, useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import Question from './Question';
import firebase from "firebase/compat/app";
import { auth } from "./firebase-auth";
import { AuthContext } from "./Auth/ContextProvider";
import SignUp from "./Auth/SignUp";
import Header from "./Header";
import {
  BrowserRouter as Router,
  Route,
  //Switch,
} from 'react-router-dom';
function App() {
  const [auth, setAuth] = useState<boolean>(false);
  const user = useContext(AuthContext);
  return (
    <AuthContext.Provider value={user}><Router><Header />{user?<>{JSON.stringify(user)}</>:<SignUp  setAuth={setAuth}/>}</Router></AuthContext.Provider>
  );
}

export default App;
