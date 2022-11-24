import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { UserProps } from '../models/User';
import { Text } from '../shared/Text';
import { TextArea } from '../shared/TextArea';
import Alert from '../shared/Alert';
import formatCurrency from '../utils/formatCurrency';
import { AuthContext } from '../Auth/ContextProvider';
import useQuestionsService from './questionsService';

import api from '../utils/api';
import { Container } from '../shared/Container';
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
  padding-top: 50px;
`;

const Modal = styled.div<{ modalLoaded: boolean }>`
  background-color: #fff;
  width: 50%;
  border-radius: 8px;
  transform: translateY(${(props) => (props.modalLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  text-align: center;
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
  }
`;
const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 32px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const BoldSpan = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const ItalicText = styled(Text)`
  font-style: italic;
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

  const { token } = React.useContext(AuthContext);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const { sendQuestion } = useQuestionsService();

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.setShowQuestionModal(false);
    }
  };

  const responseTime = (days: number, hours: number) => {
    let responseTime = '';
    if (days > 0) {
      responseTime = `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      if (days > 0) {
        responseTime += ' and ';
      }
      responseTime = `${responseTime} ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return responseTime;
  };

  const sendRequest = async () => {
    if (!token) {
      return;
    }

    try {
      setAlertType('info');
      setAlertMessage('Sending Your Question...');
      setShowAlert(true);
      const res = await sendQuestion(
        props.user.id,
        messageRef.current?.value as string
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

  const createOrder = async () => {
    setLoading(true);
    if (!token) {
      return;
    }
    let finalInfo = { cost: props.user.request_settings.cost };
    try {
      const res = await api.post('/pay', finalInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.result.id;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onApprove = async (data: any, actions: any) => {
    let info = {
      cost: props.user.request_settings.cost,
      capture: data.orderID,
    };
    try {
      const res = await api.post('/pay', info);
      if (res.status === 200) {
        sendRequest();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <BackDrop onClick={(e) => closeModal(e)}>
      <Modal modalLoaded={modalLoaded}>
        <CloseButton onClick={() => props.setShowQuestionModal(false)}>
          X
        </CloseButton>
        <Text fontSize={32} fontWeight="bold" align="center">
          Ask {props.user.name.split(' ')[0]} a Question
        </Text>
        <Text fontSize={18} align="center">
          This will cost you{' '}
          <BoldSpan>
            {formatCurrency(props.user.request_settings.cost)}
          </BoldSpan>
        </Text>
        <Text
          fontSize={18}
          mb={props.user.questionsInstructions ? 0 : 32}
          align="center"
        >
          {props.user.name.split(' ')[0]} will respond within{' '}
          {responseTime(
            props.user.request_settings.time_limit.days,
            props.user.request_settings.time_limit.hours
          )}
        </Text>
        {props.user.questionsInstructions && (
          <Container width="100%">
            <Text fontSize={18} fontWeight={700}>
              {props.user.name.split(' ')[0]}'s instruction for questions:
            </Text>
          </Container>
        )}
        {props.user.questionsInstructions && (
          <ItalicText fontSize={18} mb={32} align="center">
            "{props.user.questionsInstructions}"
          </ItalicText>
        )}
        <Alert
          show={showAlert}
          message={alertMessage}
          type={alertType}
          loading={loading}
        />
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={messageRef}
        />

        <PayPalButtons
          disabled={loading || message === ''}
          fundingSource={undefined}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </Modal>
    </BackDrop>
  );
};

export default Creator;
