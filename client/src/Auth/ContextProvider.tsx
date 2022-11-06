import { useEffect, useState, createContext } from 'react';
import { auth } from '../firebase-auth';
import api from '../utils/api';
import { UserProps } from '../models/User';

interface AuthContextReturn {
  user: UserProps | null;
  updateUser: (utoken: any, body: any) => void;
}

export const AuthContext = createContext<AuthContextReturn>({
  user: null,
  updateUser: () => {},
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const register = async (token: any, body: any) => {
    const res = await api({
      method: 'post',
      url: '/user',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: body,
    });

    setUser(res.data);
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

  const updateUser = async (token: any, body: any) => {
    const res = await api({
      method: 'patch',
      url: `/user/${user?.uid}`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: body,
    });
    setUser(res.data);
  };

  const value: AuthContextReturn = {
    user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
