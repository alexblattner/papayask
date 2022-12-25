import React, { useContext, useState } from 'react';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import useWidth from '../Hooks/useWidth';
import { useEditProfile } from './profileService';
import { Text } from '../shared/Text';
import SvgIcon from '../shared/SvgIcon';
import styled from 'styled-components';
import { ToastsContext } from '../toast/ToastContext';
import { ToastProps } from '../toast/Toast';
import CircularLoader from '../shared/CircularLoader';
import { AdvisorStatus } from '../models/User';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
  advisor: AdvisorStatus|boolean;
}

const Progress = styled.div<{ progress: number }>`
  width: 20px;
  height: 20px;
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
  font-weight: bold;
`;

const SaveButton = styled('div')<{ isLoading: boolean }>`
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  display: flex;
  gap: 8px;
  align-items: center;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};

  &:hover {
    color: ${(props) =>
      props.isLoading ? props.theme.colors.primary : 'white'};
    background-color: ${(props) =>
      props.isLoading ? 'white' : props.theme.colors.primary};
  }
`;

const ProfileSetupFooter = ({
  step,
  setStep,
  stepsDone,
  setStepsDone,
  setShowProfileSetup,
  type,
  advisor,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { width } = useWidth();
  const { submit, progress, becomeAdvisor } = useEditProfile();
  const { showToast } = useContext(ToastsContext);

  const submitProfile = async (type: 'save' | 'submit') => {
    if (isLoading || isSaving) return;
    if (type === 'save') {
      setIsSaving(true);
    } else {
      setIsLoading(true);
    }
    await submit();

    if (advisor&&progress>=75) {
      await becomeAdvisor();
    }
    if (type === 'save') {
      setIsSaving(false);
      const toast: ToastProps = {
        id: Date.now().toString(),
        type: 'success',
        message: 'Profile saved successfully',
        show: true,
      };
      showToast(toast, 3);
    }
    if (type === 'submit') {
      setIsLoading(false);
      const toast: ToastProps = {
        id: Date.now().toString(),
        type: 'success',
        message: 'Your request to become an advisor has been sent successfully',
        show: true,
      };
      if (advisor) {
        showToast(toast, 3);
      }
      setShowProfileSetup(false);
    }
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
      dir={width > 670 ? 'row' : 'column'}
      gap={width > 670 ? 12 : 0}
      width={width > 768 ? '75%' : '90%'}
      mt={'auto'}
      justify="flex-end"
    >
      <Container
        dir={width > 670 ? 'row' : 'column'}
        flex
        justify="center"
        align="center"
        gap={width > 670 ? 12 : 0}
        mx="auto"
        mb={12}
      >
        <Container flex align="center" gap={12}>
          <Progress progress={progress} />
          <Text>
            <StyledSpan>{progress}%</StyledSpan> complete
          </Text>
        </Container>
        <SaveButton onClick={() => submitProfile('save')} isLoading={isSaving}>
          {isSaving ? 'Saving..' : 'Save my progress'}{' '}
          {!isSaving ? <SvgIcon src="check" size={12} /> : <CircularLoader />}
        </SaveButton>
      </Container>
      <Container ml={'auto'} flex gap={12} align="center">
        <Button variant="outline" onClick={() => setShowProfileSetup(false)}>
          Close
        </Button>
        {type !== 'edit-one' && (
          <Button variant="text" disabled={step === 0} onClick={prevStep}>
            <Text
              color={step === 0 ? 'var(--secondary)' : 'var(--primary)'}
              fontWeight="bold"
            >
              Back
            </Text>
          </Button>
        )}
        {step !== 3 && type !== 'edit-one' && (
          <Button variant="primary" onClick={nextStep}>
            Next
          </Button>
        )}

        {(step === 3 || type === 'edit-one') && (
          <Button
            variant="primary"
            onClick={() => submitProfile('submit')}
            disabled={isLoading || isSaving}
          >
            {isLoading
              ? 'Please Wait...'
              : !advisor&&progress<75
              ? 'Submit'
              : 'Become an advisor'}
          </Button>
        )}
      </Container>
    </Container>
  );
};

export default ProfileSetupFooter;
