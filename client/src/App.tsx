import React, { useContext, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Question from './Question';
import firebase from "firebase/compat/app";
import { auth } from "./firebase-auth";
import { AuthContext } from "./Auth/ContextProvider";
import Header from "./Header";
import Search from "./Search";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile';
import Main from './main/Main';
function App() {
  const user = useContext(AuthContext);
  return (
    <AuthContext.Provider value={user}>
      <Router>
        <Routes>
          <Route path="/log-in">
            <></>
          </Route>
          <Route path="/sign-up">
            <></>
          </Route>
          <Route path="/profile">
            <></>
          </Route>
          {/* <Route path="/">
            <></>
          </Route> */}
          <Route path="*" element={<Header />} />
        </Routes>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/" element={<Main/>}></Route>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
