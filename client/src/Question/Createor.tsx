import React, { useEffect } from 'react';
import styled from 'styled-components';

import { auth } from '../firebase-auth';
import { UserProps } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import { TextArea } from '../shared/TextArea';
import api from '../utils/api';
import { AuthContext } from '../Auth/ContextProvider';
import Alert from '../shared/Alert';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: grid;
  place-items: center;
`;

const Modal = styled.div<{ modalLoaded: boolean }>`
  background-color: #fff;
  width: 50%;
  border-radius: 8px;
  transform: translateY(${(props) => (props.modalLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  text-align: center;
  padding: 32px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

interface Props {
  setShowQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

const Creator = (props: Props) => {
  const [modalLoaded, setModalLoaded] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [alertType, setAlertType] = React.useState<
    'success' | 'error' | 'info'
  >('info');
  const [alertMessage, setAlertMessage] = React.useState<string>('');
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  useEffect(() => {
    setModalLoaded(true);
  }, []);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.setShowQuestionModal(false);
    }
  };

  const sendRequest = async () => {
    setLoading(true);
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      return;
    }
    try {
      setAlertType('info');
      setAlertMessage('Sending Your Question...');
      setShowAlert(true);
      const res = await api.post(
        '/question',
        {
          receiver: props.user.id,
          description: message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setAlertType('success');
          setAlertMessage('Request sent successfully');
        }, 1000);
        setTimeout(() => {
          props.setShowQuestionModal(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setAlertType('error');
      setAlertMessage('Something went wrong');
      console.log(error);
    }
  };
  return (
    <BackDrop onClick={(e) => closeModal(e)}>
      <Modal modalLoaded={modalLoaded}>
        <Text fontSize={32} fontWeight="bold" mb={32}>
          Ask {props.user.name.split(' ')[0]} a Question
        </Text>
        <Alert
          show={showAlert}
          message={alertMessage}
          type={alertType}
          loading={loading}
        />
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextArea>
        <Container flex align="center" justify="flex-end" gap={16}>
          <Button
            variant="secondary"
            onClick={() => props.setShowQuestionModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={sendRequest}
            disabled={loading || message === ''}
          >
            Send
          </Button>
        </Container>
      </Modal>
    </BackDrop>
  );
};

export default Creator;
