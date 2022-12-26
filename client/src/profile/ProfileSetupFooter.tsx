import React, { useContext, useState } from 'react';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import useWidth from '../Hooks/useWidth';
import { useEditProfile } from './profileService';
import { Text } from '../shared/Text';
import { ToastsContext } from '../toast/ToastContext';
import { ToastProps } from '../toast/Toast';
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
      gap={12}
      width={width > 768 ? '75%' : '90%'}
      mt={'auto'}
      justify={width > 768 ? 'flex-end' : 'center'}
    >
      <Button
        variant="outline"
        onClick={() => submitProfile('save')}
        disabled={isSaving}
      >
        <Container flex gap={12} align="center">
          <Text fontWeight="bold" color="primary" fontSize={16}>
            SAVE PROGRESS
          </Text>
          <Text color="primary">({progress}% COMPLETE)</Text>
        </Container>
      </Button>
      <Container ml={width > 768 ? 'auto' : 0} flex gap={12} align="center">
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
