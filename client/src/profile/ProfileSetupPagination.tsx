import React from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import { useEditProfile } from './profileService';

const Progress = styled.div<{ progress: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: circle(50%);
  position: relative;
  background: ${({ theme }) => theme.colors.primary};

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: conic-gradient(
      ${({ theme }) => theme.colors.primary} 0
        calc(${({ progress }) => progress / 100} * 360deg),
      white calc(${({ progress }) => progress / 100} * 360deg) 360deg
    );
    z-index: -3;
    transition: all 0.3s ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    width: 75%;
    height: 75%;
    top: 12.5%;
    left: 12.5%;
    background-color: white;
    z-index: -2;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }
`;

const StyledSpan = styled.span`
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.secondary};
`;

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
}

interface PaginationButtonProps {
  status: StepStatus;
  onClick: () => void;
}

const PaginationButton = styled('div')<PaginationButtonProps>`
  border-radius: 50%;
  color: ${(props) =>
    props.status === 'done' || props.status === 'active'
      ? 'white'
      : props.theme.colors.primary};
  width: 50px;
  height: 50px;
  display: grid;
  place-content: center;
  font-size: 24px;
  cursor: pointer;
  font-weight: bold;
  background-color: ${(props) =>
    props.status === 'active'
      ? props.theme.colors.primary
      : props.status === 'done'
      ? props.theme.colors.primary_L2
      : '#fff'};
  border: 2px solid ${(props) => props.theme.colors.primary_L2};
`;

const PaginationLine = styled('div')`
  width: 50px;
  height: 2px;
  background-color: ${(props) => props.theme.colors.primary_L2};
  margin: 10px;

  @media (max-width: 768px) {
    width: 20px;
  }
`;

type StepStatus = 'done' | 'todo' | 'active';

const ProfileSetupPagination = ({ step, stepsDone, setStep }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { submit, progress } = useEditProfile();

  const submitProfile = async () => {
    setIsLoading(true);
    await submit();
    setIsLoading(false);
  };

  const moveToStep = (step: number) => {
    if (step >= 0 && step <= 3 && stepsDone.includes(step)) {
      setStep(step);
    }
  };

  const getStepStatus = (currentStep: number): StepStatus => {
    if (step === currentStep) {
      return 'active';
    }

    if (stepsDone.includes(currentStep)) {
      return 'done';
    } else {
      return 'todo';
    }
  };
  return (
    <Container flex dir="column" align="center">
      <Container flex align="center" mb={12}>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <React.Fragment key={i}>
              <PaginationButton
                status={getStepStatus(i)}
                onClick={() => moveToStep(i)}
              >
                {i + 1}
              </PaginationButton>
              {i < 3 && <PaginationLine />}
            </React.Fragment>
          ))}
      </Container>
      <Button
        variant="outline"
        onClick={() => submitProfile()}
        disabled={isLoading}
      >
        <Container flex justify="center" align="center" gap={12}>
          {isLoading ? 'Please Wait...' : 'Save Progress'}
          <StyledSpan>|</StyledSpan>
          <Progress progress={progress}>
            <Text fontWeight={'bold'} fontSize={14}>
              {progress}%
            </Text>
          </Progress>
        </Container>
      </Button>
    </Container>
  );
};

export default ProfileSetupPagination;
