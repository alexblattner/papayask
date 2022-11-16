import React, { useContext, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Question from './Question';
import firebase from 'firebase/compat/app';
import { auth } from './firebase-auth';
import { AuthContext } from './Auth/ContextProvider';
import Header from './Header';
import Search from './Search';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile';
import Main from './main/Main';
import { ThemeProvider } from 'styled-components';
import { theme } from './styledCompunentConfig/theme';
function App() {
  const user = useContext(AuthContext);
  return (
    <AuthContext.Provider value={user}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="*" element={<Header />} />
          </Routes>
          <div className="app-container">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />}></Route>
              <Route path="/search/:query" element={<Search />}></Route>
              <Route path="/" element={<Main />}></Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
