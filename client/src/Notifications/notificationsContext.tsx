import React, { createContext, useContext, useEffect, useState } from 'react';

import { baseURL } from '../utils/api';
import { AuthContext } from '../Auth/ContextProvider';

interface NotificationsContextType {
  toasts: ToastProps[];
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'question';
  message: string;
  created: Date;
  questionId?: string;
  show: boolean;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  toasts: [],
});

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const { user, token, getUser } = useContext(AuthContext);

  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (user && token) {
      const eventSource = new EventSource(
        `${baseURL}realtime-notifications/${user?.id}`,
        {
          withCredentials: true,
        }
      );

      eventSource.onmessage = (e) => {
        if (isJSON(e.data)) {
          const data = JSON.parse(e.data);
          const newToast: ToastProps = {
            id: new Date().getTime().toString(),
            type: 'question',
            questionId: data._id,
            message: `${data.sender.name} sent you a question`,
            created: new Date(),
            show: true,
          };
          setToasts((toasts) => [...toasts, newToast]);
          setTimeout(() => {
            setToasts((toasts) =>
              toasts.map((toast) => {
                if (toast.id === newToast.id) {
                  return { ...toast, show: false };
                }
                return toast;
              })
            );
          }, 5000);
          getUser();
        } else {
          console.log(e.data);
        }
      };
      return () => {
        eventSource.close();
      };
    }
  }, [token, user]);

  const value = {
    toasts: toasts,
  };
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
