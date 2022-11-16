import React from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import { Button } from './components/Button';
import { Container } from './components/Container';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
  setStepsDone: React.Dispatch<React.SetStateAction<number[]>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  submit: () => void;
  token: string;
  type: 'initial' | 'edit-all' | 'edit-one';
}

const ProfileSetupFooter = ({
  step,
  setStep,
  submit,
  token,
  stepsDone,
  setStepsDone,
  setShowProfileSetup,
  type,
}: Props) => {
  const { updateUser } = React.useContext(AuthContext);
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

  const skip = () => {
    if (type === 'initial') {
      updateUser(token, { isSetUp: true });
    }
    setShowProfileSetup(false);
  };

  return (
    <Container flex align="center" gap={16} width="75%" mt={'auto'}>
      <Button variant="secondary" onClick={skip}>
        {type === 'initial' ? 'Skip' : 'Cancel'}
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
    </Container>
  );
};

export default ProfileSetupFooter;
