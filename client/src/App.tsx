import { useContext, useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { analytics } from './firebase-auth';
import { logEvent } from 'firebase/analytics';
import ReactGA from 'react-ga';

import './App.css';
import { AuthContext } from './Auth/ContextProvider';
import Header from './Header';
import Profile from './profile/Profile';
import Landing from './Landing';
import { theme } from './styledCompunentConfig/theme';
import { EditProfileProvider } from './profile/profileService';
import { ToastsContext } from './toast/ToastContext';
import Toast from './toast/Toast';

const ToastsContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  z-index: 1000;
`;

function App() {
  const user = useContext(AuthContext);
  const { toasts } = useContext(ToastsContext);
  useEffect(() => {
      ReactGA.initialize('UA-252855513');
      ReactGA.pageview(window.location.pathname);
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
                    <Route path="*" element={<Landing />} />
                  )}
                </Routes>
                <ToastsContainer>
                  {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} />
                  ))}
                </ToastsContainer>
              </div>
            </Router>
          </ThemeProvider>
        </PayPalScriptProvider>
      </EditProfileProvider>
    </AuthContext.Provider>
  );
}

export default App;
