import React, { createContext, useState } from 'react';

interface ToastsContextType {
  toasts: ToastProps[];
  showToast: (toast: ToastProps, duration: number) => void;
  hideToast: (id: string) => void;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'question';
  message: string;
  questionId?: string;
  show: boolean;
}

export const ToastsContext = createContext<ToastsContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (toast: ToastProps, duration?: number) => {
    setToasts((toasts) => [...toasts, toast]);
    setTimeout(
      () => {
        setToasts((toasts) =>
          toasts.map((t) => {
            if (t.id === toast.id) {
              return { ...t, show: false };
            }
            return t;
          })
        );
      },
      duration ? duration * 1000 : 5000
    );
  };

  const hideToast = (id: string) => {
    setToasts((toasts) =>
      toasts.map((t) => {
        if (t.id === id) {
          return { ...t, show: false };
        }
        return t;
      })
    );
  };

  const value = {
    toasts: toasts,
    showToast: showToast,
    hideToast: hideToast,
  };
  return (
    <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
  );
};
