import { useContext,useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import './App.css';
import { AuthContext } from './Auth/ContextProvider';
import Header from './Header';
import Profile from './profile/Profile';
import Main from './main/Main';
import { theme } from './styledCompunentConfig/theme';
import { EditProfileProvider } from './profile/profileService';
import { analytics } from './firebase-auth';
import { getAnalytics, logEvent } from "firebase/analytics";
function App() {
  const user = useContext(AuthContext);
  useEffect(() => {
    logEvent(analytics, 'select_item', {
      content_type: 'image',
      content_id: 'P12453',
      items: [{ name: 'Kittens' }]
    });
  }, []);
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
                  {user?.user ? (
                    <Route path="*" element={<Profile />} />
                  ) : (
                    <Route path="*" element={<Main />} />
                  )}
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
