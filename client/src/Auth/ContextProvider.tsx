import { useEffect, useState, createContext } from 'react';
import { auth } from '../firebase-auth';
import api from '../utils/api';
import { UserProps } from '../models/User';

interface AuthContextReturn {
  user: UserProps | null;
  updateUser: (utoken: any, body: any) => void;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

export const AuthContext = createContext<AuthContextReturn>({
  user: null,
  updateUser: () => {},
  token: null,
  setUser: () => {},
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      auth.currentUser?.getIdToken().then((token) => {
        setToken(token);
      });
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
    const [user, questions] = await Promise.all([
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

    setUser({ id: user.data._id, ...user.data, questions });
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

      setUser({ id: res.data.user._id, ...res.data.user });
    } catch (error) {
      console.log(error);
    }
  };

  const value: AuthContextReturn = {
    user,
    updateUser,
    token,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
