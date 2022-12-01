import React from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';

import Modal from '../shared/Modal';
import { Text } from '../shared/Text';

const BoldSpan = styled.span`
  font-weight: bold;
`;

interface Props {
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  submit: () => void;
}

const SetupWarning = (props: Props) => {
  return (
    <Modal setShowModal={props.setShowWarning}>
      <Container px={48} py={36}>
        <Text
          fontSize={48}
          fontWeight={'bold'}
          color="#D75B00"
          align="center"
          mb={24}
        >
          You haven't completed your set up!{' '}
        </Text>
        <Text fontSize={32} align="center" mb={18}>
          In order to become a giver your have to complete at least{' '}
          <BoldSpan> 75%</BoldSpan> of the process.
        </Text>
        <Text fontSize={32} align="center" mb={18}>
          Current progress: <BoldSpan> {props.progress}% </BoldSpan>
        </Text>
        <Text fontSize={32} align="center" mb={36}>
          {' '}
          You can save your progress and complete the process later
        </Text>
        <Container flex align="center" gap={16}>
          <Button variant="outline" onClick={props.submit} width="100%">
          SAVE AND CONTINUE LATER
          </Button>
          <Button
            variant="primary"
            onClick={() => props.setShowWarning(false)}
            width="100%"
          >
            CONTINUE SET UP
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};

export default SetupWarning;