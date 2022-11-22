import { useContext } from 'react';

import './App.css';
import { AuthContext } from './Auth/ContextProvider';
import Header from './Header';
import Search from './Search';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile';
import Main from './main/Main';
import { ThemeProvider } from 'styled-components';
import { theme } from './styledCompunentConfig/theme';
import QuestionsList from './Question/QuestionsList';
import Question from './Question';
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
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/search" element={<Search />}></Route>
              <Route path="/search/:query" element={<Search />}></Route>
              <Route path="/questions" element={<QuestionsList />}></Route>
              <Route path="/questions/:id" element={<Question />}></Route>
              <Route path="/" element={<Main />}></Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
