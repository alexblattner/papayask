import { useContext } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import './App.css';
import { AuthContext } from './Auth/ContextProvider';
import Header from './Header';
import Profile from './profile/Profile';
import Main from './main/Main';
import { theme } from './styledCompunentConfig/theme';
import { EditProfileProvider, useEditProfile } from './profile/profileService';

function App() {
  const user = useContext(AuthContext);

  return (
    <AuthContext.Provider value={user}>
      <EditProfileProvider>
        <PayPalScriptProvider
          options={{
            'client-id': process.env.REACT_APP_PAYPAL_ID as string,
            currency: 'USD',
            components: 'buttons',
          }}
        >
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="*" element={<Header />} />
              </Routes>
              <div className="app-container">
                <Routes>
                  <Route path="/*" element={<Main />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/" element={<Main />}></Route>
                </Routes>
              </div>
            </Router>
          </ThemeProvider>
        </PayPalScriptProvider>
      </EditProfileProvider>
    </AuthContext.Provider>
  );
}

export default App;
