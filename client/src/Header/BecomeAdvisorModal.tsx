import React from 'react';
import styled from 'styled-components';

import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import { EditProfileContext } from '../profile/profileService';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';

interface Props {
  setShowBecomeAdvisorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledSpan = styled.span`
  font-weight: bold;
`;

const BecomeAdvisorModal = (props: Props) => {
  const { progress } = React.useContext(EditProfileContext);

  return (
    <Modal setShowModal={props.setShowBecomeAdvisorModal} size="sm">
      <Container my={36}>
        <Text fontSize={32} fontWeight="bold" color="primary" align='center'>
          You haven't completed your set up!
        </Text>
      </Container>
      <Text fontSize={24} mb={24} align="center">
        In order to become an advisor your have to complete at least 75% of the
        process
      </Text>

      <Text fontSize={24} color="primary">
        Current progress: <StyledSpan>{progress}%</StyledSpan>
      </Text>
      <Container flex gap={12} mt={36}>
        <Button
          variant="outline"
          onClick={() => props.setShowBecomeAdvisorModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.setShowBecomeAdvisorModal(false);
            props.setShowProfileSetup(true);
          }}
        >
          Complete Setup
        </Button>
      </Container>
    </Modal>
  );
};

export default BecomeAdvisorModal;
