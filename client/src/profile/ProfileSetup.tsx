import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ProfileSetupFooter from './ProfileSetupFooter';
import ProfileSetupPagination from './ProfileSetupPagination';
import { Container } from '../shared/Container';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import SetupWarning from './SetupWarning';
import useWidth from '../Hooks/useWidth';
import { EditProfileContext } from './profileService';
import { AdvisorStatus } from '../models/User';
const SetupModal = styled('div')<{ pageLoaded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background-color: #fff;
  transform: translateY(${(props) => (props.pageLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 100;
`;

interface ProfileSetupProps {
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
  initialStep?: number | null;
  advisor: AdvisorStatus|boolean;
}

const ProfileSetup = ({
  setShowProfileSetup,
  type,
  initialStep,
  advisor,
}: ProfileSetupProps) => {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const { width } = useWidth();
  const { setEditProfileShown } = React.useContext(EditProfileContext);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (type !== 'initial') {
      setStepsDone([0, 1, 2, 3]);
    }
  }, [type]);

  useEffect(() => {
    setPageLoaded(true);
    setEditProfileShown(true);

    return () => {
      setEditProfileShown(false);
    };
  }, []);

  return (
    <SetupModal pageLoaded={pageLoaded}>
      {showWarning && <SetupWarning setShowWarning={setShowWarning} />}
      <Container
        width="100%"
        minH="100vh"
        flex
        dir="column"
        align="center"
        pt={100}
        pb={50}
      >
        <ProfileSetupPagination
          setStep={setStep}
          step={step}
          stepsDone={stepsDone}
        />
        <Container width={width > 950 ? '75%' : '90%'} pt={50}>
          {step === 0 && <StepOne />}
          {step === 1 && <StepTwo />}
          {step === 2 && <StepThree />}
          {step === 3 && <StepFour />}
        </Container>
        <ProfileSetupFooter
          step={step}
          setStep={setStep}
          stepsDone={stepsDone}
          setStepsDone={setStepsDone}
          setShowProfileSetup={setShowProfileSetup}
          type={type}
          advisor={advisor}
        />
      </Container>
    </SetupModal>
  );
};

export default ProfileSetup;
