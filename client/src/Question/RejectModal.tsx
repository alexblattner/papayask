import React, {useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '../shared/Button';
import Checkbox from '../shared/Checkbox';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import useQuestionsService from './questionsService';

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
  width: 45%;
  border-radius: 8px;
  transform: translateY(${(props) => (props.modalLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  text-align: center;
  padding: 32px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Reason = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
  cursor: pointer;
`;

interface Props {
  setShowRejectModal: React.Dispatch<React.SetStateAction<boolean>>;
  questionId: string;
}

const RejectModal = (props: Props) => {
  const [modalLoaded, setModalLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const reasons = [
    'I don’t have the time to complete this request',
    'Out of my area of expertise',
    'Too much effort',
    'Other',
  ];

  const { rejectQuestion } = useQuestionsService();
  

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.setShowRejectModal(false);
    }
  };

  const selectReason = (text: string) => {
    setReason(text);
    if (text === 'Other') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };

  const disableButton = () => {
    return (
      reason === '' || loading || (reason === 'Other' && customReason === '')
    );
  };

  const onChangeReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomReason(e.target.value);
  };

  const submit = async () => {
    setLoading(true);
    const finalReason = reason === 'Other' ? customReason : reason;
    await rejectQuestion(props.questionId, finalReason);
    setLoading(false);

    props.setShowRejectModal(false);
  };

  useEffect(() => {
    setModalLoaded(true);
  }, []);

  return (
    <BackDrop onClick={(e) => closeModal(e)}>
      <Modal modalLoaded={modalLoaded}>
        <Text align="center" fontSize={26} fontWeight="bold">
          Why did you choose to decline?
        </Text>
        {reasons.map((r, index) => (
          <Reason key={index} onClick={() => selectReason(r)}>
            <Checkbox checked={r === reason} />
            <Text align="center" fontSize={18} ml={8}>
              {r}
            </Text>
          </Reason>
        ))}
        {showInput && (
          <Input
            value={customReason}
            onChange={(e) => onChangeReason(e)}
            type="text"
            placeholder="Reason"
            name=""
            width="100%"
          />
        )}
        <Container flex align="center" justify="flex-end" gap={16}>
          <Button
            variant="secondary"
            onClick={() => props.setShowRejectModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={disableButton()}>
            Send
          </Button>
        </Container>
      </Modal>
    </BackDrop>
  );
};

export default RejectModal;
