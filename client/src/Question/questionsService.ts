import { useContext } from 'react';
import { AuthContext } from '../Auth/ContextProvider';
import api from '../utils/api';

const useQuestionsService = () => {
  const { token, setUser, user } = useContext(AuthContext);

  const sendQuestion = async (
    recieverId: string,
    description: string,
    files?: File[]
  ) => {
    try {
      const res = await api.post(
        '/question',
        {
          receiver: recieverId,
          description,
        },
      );

      return res;
    } catch (error) {
      throw error;
    }
  };

  const rejectQuestion = async (questionId: string, reason: string) => {
    try {
      const res = await api.post(
        `/question/update-status/${questionId}`,
        { reason, action: 'rejected' },
      );

      const question = res.data;

      if (user?.questions) {
        const updatedUser = {
          ...user,
          questions: {
            sent: [...user.questions.sent],
            received: user.questions.received.map((q) => {
              if (q._id === questionId) {
                return question;
              }
              return q;
            }),
          },
        };
        setUser(updatedUser);
      }
    } catch (error) {
      throw error;
    }
  };

  return { sendQuestion, rejectQuestion };
};

export default useQuestionsService;
