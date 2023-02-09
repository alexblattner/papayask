import { useContext, useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import LogRocket from 'logrocket';
import ReactPixel from 'react-facebook-pixel';
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
    if (process.env.REACT_APP_ENV === 'production') {
      ReactGA.initialize('UA-252855513-1');
      ReactGA.pageview(window.location.pathname);
      ReactPixel.init('904568947349328');
      ReactPixel.pageView(); // For tracking page view
      LogRocket.init('n4odyt/papayask');
    }
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
