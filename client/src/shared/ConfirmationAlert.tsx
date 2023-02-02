import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { Container } from './Container';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAlert = styled.div<{ loaded: boolean }>`
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

interface Props {
  onConfirm: () => void;
  closeAlert: () => void;
  message: string;
  title: string;
  type: 'delete' | 'confirm';
}

const ConfirmationAlert = (props: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { onConfirm, message, closeAlert, title, type } = props;

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <Background onClick={() => closeAlert()}>
      <StyledAlert loaded={loaded}>
        <h2>{title}</h2>
        <Container width="100%" height="16px" />
        <p>{message}</p>
        <Container width="100%" height="16px" />
        <Container flex gap={16}>
          <Button
            variant="outline"
            width={'125px'}
            onClick={() => closeAlert()}
          >
            Cancel
          </Button>
          <Button variant="primary" width={'125px'} onClick={() => onConfirm()}>
            Confirm
          </Button>
        </Container>
      </StyledAlert>
    </Background>
  );
};

export default ConfirmationAlert;
