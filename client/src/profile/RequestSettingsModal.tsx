import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../Auth/ContextProvider';
import { RequestSettings } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { TextArea } from '../shared/TextArea';

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

interface Props {
  setShowRequestSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestSettingsModal = (props: Props) => {
  const [modalLoaded, setModalLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionsInstructions, setQuestionsInstructions] =
    useState<string>('');
  const [requestSettings, setRequestSettings] = useState<RequestSettings>({
    concurrent: 0,
    time_limit: {
      days: 0,
      hours: 0,
    },
    cost: 0,
  });
  const { user, token, updateUser } = React.useContext(AuthContext);

  const onChangeSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('time_limit')) {
      const name = e.target.name.split('-')[1];
      setRequestSettings({
        ...requestSettings,
        time_limit: {
          ...requestSettings.time_limit,
          [name]: parseInt(value) || '',
        },
      });
      return;
    }

    setRequestSettings({ ...requestSettings, [name]: value });
  };

  const submit = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      updateUser(token, {
        request_settings: requestSettings,
        questionsInstructions,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      props.setShowRequestSettingsModal(false);
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.setShowRequestSettingsModal(false);
    }
  };
  useEffect(() => {
    setModalLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      setRequestSettings(user.request_settings);
      setQuestionsInstructions(user.questionsInstructions || '');
    }
  }, [user]);
  return (
    <BackDrop onClick={closeModal}>
      <Modal modalLoaded={modalLoaded}>
        <Text fontSize={36} fontWeight={'bold'} align="center" mb={32}>
          Questios Settings
        </Text>
        <Container flex flexWrap gap={18} mb={32} align="center">
          <Text fontSize={18}>How many requests can you handle at once?</Text>
          <Input
            value={requestSettings.concurrent}
            onChange={(e) => onChangeSettings(e)}
            name="concurrent"
            placeholder="Concurrent"
            type="number"
            width="80px"
            mb="0px"
          />
        </Container>
        <Container flex flexWrap gap={18} mb={32} align="center">
          <Text fontSize={18}>How much do you charge for a question?</Text>
          <Container flex align="center" gap={4}>
            <Input
              value={requestSettings.cost}
              onChange={(e) => onChangeSettings(e)}
              name="cost"
              placeholder="Cost"
              type="number"
              width="80px"
              mb="0px"
            />
            <Text fontWeight={'bold'} fontSize={18}>
              $
            </Text>
          </Container>
        </Container>
        <Container flex flexWrap gap={18} mb={32}>
          <Text fontSize={18}>How long do you take to answer a question?</Text>
          <Input
            value={requestSettings.time_limit.days}
            onChange={(e) => onChangeSettings(e)}
            name="time_limit-days"
            placeholder="Days"
            type="number"
            width="80px"
            mb="0px"
          />
          <Input
            value={requestSettings.time_limit.hours}
            onChange={(e) => onChangeSettings(e)}
            name="time_limit-hours"
            placeholder="Hours"
            type="number"
            width="80px"
            mb="0px"
          />
        </Container>
        <Text fontSize={32} fontWeight="bold" mb={16}>
          Questions Instructions
        </Text>
        <TextArea
          value={questionsInstructions}
          onChange={(e) => setQuestionsInstructions(e.target.value)}
        />
        <Container flex align="center" justify="flex-end" gap={16}>
          <Button
            variant="secondary"
            onClick={() => props.setShowRequestSettingsModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={loading}>
            Send
          </Button>
        </Container>
      </Modal>
    </BackDrop>
  );
};

export default RequestSettingsModal;
