import React from 'react';

import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import useWidth from '../Hooks/useWidth';
import { useEditProfile } from './profileService';
import { Text } from '../shared/Text';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
}

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
  const { submit } = useEditProfile();

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
      justify="flex-end"
    >
      <Button variant="outline" onClick={() => setShowProfileSetup(false)}>
        Close
      </Button>
      {type !== 'edit-one' && (
        <Button variant="text" disabled={step === 0} onClick={prevStep}>
          <Text color={step === 0 ? 'var(--secondary)' : 'var(--primary)'} fontWeight ='bold'>
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
          onClick={() => submitProfile()}
          disabled={isLoading}
        >
          {isLoading ? 'Please Wait...' : 'Submit'}
        </Button>
      )}
    </Container>
  );
};

export default ProfileSetupFooter;
