import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import { EditProfileContext } from './profileService';

interface Props {
  setAdvisorWarning: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledSpan = styled.span`
  font-weight: bold;
`;

const AdvisorWarning = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { progress, submit } = useContext(EditProfileContext);

  const saveProgress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await submit();
    setIsLoading(false);
    props.setAdvisorWarning(false);
    props.setShowProfileSetup(false);
  };
  return (
    <Modal setShowModal={props.setAdvisorWarning} size="sm">
      <Container flex dir="column" align="center">
        <Container mb={36}>
          <Text fontSize={32} fontWeight="bold" color="primary" align="center">
            You haven't completed your set up!
          </Text>
        </Container>

        <Text fontSize={18} mb={24} align="justify">
          In order to become an advisor your have to complete at least 75% of
          the process
        </Text>

        <Text fontSize={24} color="primary">
          Current progress: <StyledSpan>{progress}%</StyledSpan>
        </Text>
      </Container>

      <Container flex gap={12} mt={36}>
        <Button
          variant="outline"
          onClick={() => {
            props.setAdvisorWarning(false);
            props.setShowProfileSetup(false);
          }}
        >
          Keep editing
        </Button>
        <Button variant="primary" onClick={saveProgress} disabled={isLoading}>
          Save progress
        </Button>
      </Container>
    </Modal>
  );
};

export default AdvisorWarning;
