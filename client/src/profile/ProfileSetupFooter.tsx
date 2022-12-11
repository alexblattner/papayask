import React, { useContext } from 'react';
import styled from 'styled-components';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import useWidth from '../Hooks/useWidth';
import { EditProfileContext, useEditProfile } from './profileService';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
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
  stepsDone,
  setStepsDone,
  setShowProfileSetup,
  type,
}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { width } = useWidth();
  const { submit, progress } = useEditProfile();

  const submitProfile = async () => {
    setIsLoading(true);
    await submit();
    setIsLoading(false);
    setShowProfileSetup(false);
  };

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
    <Container
      flex
      align="center"
      gap={10}
      width={width > 768 ? '75%' : '90%'}
      mt={'auto'}
    >
      <Button variant="outline" onClick={() => setShowProfileSetup(false)}>
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
        <Button variant="primary" onClick={submitProfile} disabled={isLoading}>
          {isLoading ? 'Please Wait...' : 'Submit'}
        </Button>
      )}
      <Progress progress={progress}>
        <Text fontWeight={'bold'}>{progress}%</Text>
      </Progress>
    </Container>
  );
};

export default ProfileSetupFooter;
