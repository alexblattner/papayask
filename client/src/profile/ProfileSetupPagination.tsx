import React from 'react';
import styled from 'styled-components';
import { Container } from './components/Container';

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
`;

type StepStatus = 'done' | 'todo' | 'active';

const ProfileSetupPagination = ({ step, stepsDone, setStep }: Props) => {
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
    <Container flex align="center">
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
  );
};

export default ProfileSetupPagination;
