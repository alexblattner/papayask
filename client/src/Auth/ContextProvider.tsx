import { useEffect, useState, createContext } from 'react';
import { auth } from '../firebase-auth';
import api, { setTokenForAPI } from '../utils/api';
import { UserProps } from '../models/User';
import { QuestionProps } from '../models/Question';
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
    try {
      const res = await api.get('/questions', {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (token: any, body: any) => {
    const userData = await api({
      method: 'post',
      url: '/user',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: body,
    });

    const questions = await getUserQuestions(token);

    setUser({
      id: userData.data._id,
      ...userData.data,
      questions,
      newQuestionsCount: newQuestionsCount(questions.received),
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

  const newQuestionsCount = (questions: QuestionProps[]) => {
    
    return questions.filter((question) => question.status.action === 'pending')
      .length;
  };

  const getUser = async () => {
    if (!token) {
      return;
    }else{
      setTokenForAPI(token);
    }
    const [updatedUser, questions] = await Promise.all([
      api({
        method: 'get',
        url: `/user/${user?._id}`,
      }),
      getUserQuestions(token),
    ]);
    setUser({
      id: updatedUser.data._id,
      ...updatedUser.data,
      questions,
      newQuestionsCount: newQuestionsCount(questions.received),
    });
  };

  const updateUser = async (token: string, body: any) => {
    try {
      const res = await api({
        method: 'patch',
        url: `/user/${user?._id}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: body,
      });
      const questions = await getUserQuestions(token);
      setUser({
        id: res.data.user._id,
        ...res.data.user,
        questions,
        newQuestionsCount: newQuestionsCount(questions.received),
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
