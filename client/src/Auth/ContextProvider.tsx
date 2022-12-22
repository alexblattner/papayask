import { useEffect, useState, createContext } from 'react';
import { auth } from '../firebase-auth';
import api, { setTokenForAPI } from '../utils/api';
import { UserProps } from '../models/User';

interface AuthContextReturn {
  user: UserProps | null | undefined;
  updateUser: (body: any) => Promise<void>;
  token: string | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null | undefined>>;
  getUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextReturn>({
  user: null,
  updateUser: async () => {},
  token: null,
  setUser:  () => {},
  getUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (user && auth.currentUser) {
      auth.currentUser.getIdToken(true).then((token) => {
        setToken(token);
      });
    } else if (user === null) {
      setToken(null);
    }
  }, [user]);

  const register = async (token: any, body: any) => {
    // we use promise all setteled beacuse of the first register
    const [userData] = await Promise.allSettled([
      api({
        method: 'post',
        url: '/user',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: body,
      }),
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
        let name = user.displayName
          ? user.displayName
          : window.localStorage.getItem('firstName') +
            ' ' +
            window.localStorage.getItem('lastName');

        const token = await user.getIdToken();
        register(token, {
          email: user.email,
          displayName: name,
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
    const updatedUser = await 
      api({
        method: 'get',
        url: `/user/${user?._id}`,
      });
  
    setUser({
      id: updatedUser.data._id,
      ...updatedUser.data,
    });
  };

  const updateUser = async (body: any) => {
    console.log(body);

    try {
      const res = await api({
        method: 'patch',
        url: `/user/${user?._id}`,
        data: body,
      });
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
