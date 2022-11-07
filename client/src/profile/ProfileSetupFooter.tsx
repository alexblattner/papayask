import React from 'react';

import { AuthContext } from '../Auth/ContextProvider';

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
    <div className="setup-footer">
      <button className="footer-button skip" onClick={skip}>
        {type === 'initial' ? 'Skip' : 'Cancel'}
      </button>
      {type !== 'edit-one' && (
        <button
          className="footer-button"
          disabled={step === 0}
          onClick={prevStep}
        >
          Back
        </button>
      )}
      {step !== 3 && type !== 'edit-one' && (
        <button
          className="footer-button"
          onClick={nextStep}
        >
          Next
        </button>
      )}
      {(step === 3 || type === 'edit-one') && (
        <button className="footer-button" onClick={submit}>
          Submit
        </button>
      )}
    </div>
  );
};

export default ProfileSetupFooter;
