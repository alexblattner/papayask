import React, { useContext, useState } from 'react';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import useWidth from '../Hooks/useWidth';
import { EditProfileContext, useEditProfile } from './profileService';
import { Text } from '../shared/Text';
import { ToastsContext } from '../toast/ToastContext';
import { ToastProps } from '../toast/Toast';
import { AdvisorStatus } from '../models/User';
import AdvisorWarning from './AdvisorWarning';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
  advisor: AdvisorStatus | boolean;
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
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const { width } = useWidth();
  const {
    submit,
    progress,
    becomeAdvisor,
    addEducation,
    inputEducation,
    addExperience,
    inputExperience,
  } = useEditProfile();
  const { showToast } = useContext(ToastsContext);
  const { currentSkill, addSkill } = useContext(EditProfileContext);

  const submitProfile = async (type: 'save' | 'submit') => {
    alert(1)
    if (isLoading || isSaving) return;

    if (advisor && type === 'submit' && progress < 75) {
      setShowWarning(true);
      return;
    }

    if (type === 'save') {
      setIsSaving(true);
    } else {
      setIsLoading(true);
    }
    alert(2)

    await submit();
    alert(3)

    if (advisor && progress >= 75) {
      const res=await becomeAdvisor();
      if(res){
        const toast: ToastProps = {
          id: Date.now().toString(),
          type: 'success',
          message: 'Your request to become an advisor has been sent successfully',
          show: true,
        };
        showToast(toast, 3);
      }
    }
    alert(4)

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
    alert(5)

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
    alert(6)

  };

  const nextStep = () => {
    if (step === 1) {
      if (
        inputEducation.startDate &&
        inputEducation.name &&
        inputEducation.level &&
        inputEducation.university.name &&
        inputEducation.university.country
      ) {
        addEducation(inputEducation);
      }
      if (
        inputExperience.startDate &&
        inputExperience.company.name &&
        inputExperience.name &&
        inputExperience.type &&
        inputExperience.geographic_specialization
      ) {
        addExperience(inputExperience);
      }
    }
    if (step === 2) {
      if (currentSkill.name !== '') {
        addSkill();
      }
    }
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
      {showWarning ? (
        <AdvisorWarning
          setAdvisorWarning={setShowWarning}
          setShowProfileSetup={setShowProfileSetup}
        />
      ) : null}
      {advisor ? (
        <Button
          variant="primary"
          onClick={() => submitProfile('save')}
          disabled={isSaving}
        >
          <Container flex gap={12} align="center">
            <Text fontWeight="bold" color="white" fontSize={16}>
              SAVE PROGRESS
            </Text>
            <Text color="white">({progress}% COMPLETE)</Text>
          </Container>
        </Button>
      ) : null}
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
              : !advisor
              ? 'Save'
              : 'Become an advisor'}
          </Button>
        )}
      </Container>
    </Container>
  );
};

export default ProfileSetupFooter;
