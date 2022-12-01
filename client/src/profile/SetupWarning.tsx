import React from 'react';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';

import Modal from '../shared/Modal';
import { Text } from '../shared/Text';

interface Props {
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  submit: () => void;
}

const SetupWarning = (props: Props) => {
  return (
    <Modal setShowModal={props.setShowWarning}>
      <Text fontSize={24} fontWeight={'bold'}>
        You haven't completed you set up!{' '}
      </Text>
      <Text>
        In order to become a giver your have to complete at least 75% of the
        process
      </Text>
      <Text>Current progress: {props.progress}%</Text>
      <Text> You can save your progress and complete the process later</Text>
      <Container flex align="center" justify="flex-end" gap={16}>
        <Button variant="outline" onClick={() => props.setShowWarning(false)}>
          Go back
        </Button>
        <Button variant="primary" onClick={props.submit}>
          Complete later
        </Button>
      </Container>
    </Modal>
  );
};

export default SetupWarning;