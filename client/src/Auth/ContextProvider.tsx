import { useEffect, useState, createContext } from 'react';
import { auth } from '../firebase-auth';
import api, { setTokenForAPI } from '../utils/api';
import { UserProps } from '../models/User';

interface AuthContextReturn {
  user: UserProps | null | undefined;
  updateUser: (utoken: any, body: any) => void;
  token: string | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null | undefined>>;
  getUser: () => void;
}

export const AuthContext = createContext<AuthContextReturn>({
  user: null,
  updateUser: () => {},
  token: null,
  setUser: () => {},
  getUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (user) {
      auth.currentUser?.getIdToken().then((token) => {
        setToken(token);
      });
    } else if (user === null) {
      setToken(null);
    }
  }, [user]);

  const getUserQuestions = async (utoken: string) => {
    const res = await api.get('/questions', {
      headers: {
        Authorization: `Bearer ${utoken}`,
      },
    });
    return res.data;
  };

  const register = async (token: any, body: any) => {
    // we use promise all setteled beacuse of the first register
    const [userData, questionsData] = await Promise.allSettled([
      api({
        method: 'post',
        url: '/user',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: body,
      }),
      getUserQuestions(token),
    ]);
    if (userData.status == 'rejected') return;
    setUser({
      id: userData.value.data._id,
      ...userData.value.data,
    });
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        register(token, {
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);


  const getUser = async () => {
    if (!token) {
      return;
    }
    const [updatedUser] = await Promise.all([
      api({
        method: 'get',
        url: `/user/${user?.id}`,
      }),
      getUserQuestions(token),
    ]);
    setUser({
      id: updatedUser.data._id,
      ...updatedUser.data,
    });
  };

  const updateUser = async (token: string, body: any) => {
    try {
      const res = await api({
        method: 'patch',
        url: `/user/${user?.id}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: body,
      });
      const questions = await getUserQuestions(token);
      setUser({
        id: res.data.user._id,
        ...res.data.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token !== undefined) {
      setTokenForAPI(token);
    }
  }, [token]);

  const value: AuthContextReturn = {
    user,
    updateUser,
    token,
    setUser,
    getUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
