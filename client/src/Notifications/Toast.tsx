import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ToastProps } from './notificationsContext';

interface Props {
  toast: ToastProps;
}

const StyledToast = styled('div')<{ loaded: boolean; show: boolean }>`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  margin-bottom: 8px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) =>
    props.loaded ? 'translateY(0)' : 'translateY(100%)'};
  transition: all 0.3s ease-in-out;
  font-weight: bold;
  border-radius: 4px;
`;

const Toast = (props: Props) => {
  const { toast } = props;
  const [toastLoaded, setToastLoaded] = useState<boolean>(false);

  useEffect(() => {
    setToastLoaded(true);
  }, []);

  return (
    <StyledToast loaded={toastLoaded} show={props.toast.show} key={toast.id}>
      {toast.message}
    </StyledToast>
  );
};

export default Toast;
