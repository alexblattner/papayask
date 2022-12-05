import React from 'react';
import styled from 'styled-components';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  submit: () => void;
  type: 'initial' | 'edit-all' | 'edit-one';
  progress: number;
}

const Progress = styled.div<{ progress: number }>`
  width: 60px;
  height: 60px;
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

const ProfileSetupFooter = ({
  step,
  setStep,
  submit,
  stepsDone,
  setStepsDone,
  setShowProfileSetup,
  type,
  progress,
}: Props) => {
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setStepsDone([...stepsDone, step + 1]);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Container flex align="center" gap={16} width="75%" mt={'auto'}>
      <Button variant="secondary" onClick={() => setShowProfileSetup(false)}>
        Cancel
      </Button>
      {type !== 'edit-one' && (
        <Button variant="primary" disabled={step === 0} onClick={prevStep}>
          Back
        </Button>
      )}
      {step !== 3 && type !== 'edit-one' && (
        <Button variant="primary" onClick={nextStep}>
          Next
        </Button>
      )}
      {(step === 3 || type === 'edit-one') && (
        <Button variant="primary" onClick={submit}>
          Submit
        </Button>
      )}
      <Progress progress={progress}>
        <Text fontWeight={'bold'}>{progress}%</Text>
      </Progress>
    </Container>
  );
};

export default ProfileSetupFooter;
