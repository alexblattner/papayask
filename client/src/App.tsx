import React, { useContext, useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import Question from './Question';
import firebase from "firebase/compat/app";
import { auth } from "./firebase-auth";
import { AuthContext } from "./Auth/ContextProvider";
import SignUp from "./Auth/SignUp";
import LogIn from "./Auth/LogIn";
import Header from "./Header";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
function App() {
  const user = useContext(AuthContext);
  return (
    <AuthContext.Provider value={user}>
      <Router>
        <Routes>
          <Route path="/log-in"><></></Route>
          <Route path="/sign-up"><></></Route>
          <Route path="*" element={<Header />}/>
        </Routes>
        <Routes>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/log-in" element={<LogIn/>}/>
          <Route path="*" element={<>{JSON.stringify(user)}</>}></Route>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
