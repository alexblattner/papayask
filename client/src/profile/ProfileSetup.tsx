import React, { useState, useEffect } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import { auth } from '../firebase-auth';
import styled from 'styled-components';

import {
  School,
  UserEducation,
  UserExperience,
  UserSkill,
} from '../models/User';
import ProfileSetupFooter from './ProfileSetupFooter';
import ProfileSetupPagination from './ProfileSetupPagination';
import { Container } from './components/Container';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

const SetupModal = styled('div')<{ pageLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  width: 100%;
  z-index: 999;
  transform: translateY(${(props) => (props.pageLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
`;

interface ProfileSetupProps {
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
  initialStep?: number | null;
}

export interface Education {
  school: School;
  fieldOfStudy: string;
  startDate: Date | null;
  endDate: Date | string | null;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date | null;
  endDate: Date | string | null;
  type: string;
}

const ProfileSetup = ({
  setShowProfileSetup,
  type,
  initialStep,
}: ProfileSetupProps) => {
  const [title, setTitle] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { user, updateUser } = React.useContext(AuthContext);
  const [step, setStep] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [inputSkill, setInputSkill] = useState<UserSkill>({
    name: '',
    relatedEducation: [],
    relatedExperience: [],
  });
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [inputEducation, setInputEducation] = useState<Education>({
    school: {
      name: '',
      id: '',
      country: '',
      rank: 1800,
    },
    fieldOfStudy: '',
    startDate: new Date(),
    endDate: null,
  });
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [inputExperience, setInputExperience] = useState<Experience>({
    company: '',
    position: '',
    startDate: new Date(),
    endDate: null,
    type: '',
  });

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const onChangeEducation = (name: string, value: string | School | Date) => {
    if (value instanceof Object && !(value instanceof Date)) {
      setInputEducation({
        ...inputEducation,
        school: value,
      });
    } else if (name.includes('school')) {
      name = name.split('-')[1];

      setInputEducation({
        ...inputEducation,
        school: {
          ...inputEducation.school,
          [name]: value,
        },
      });
    } else {
      setInputEducation({
        ...inputEducation,
        [name]: value,
      });
    }
  };

  const onChangeCountry = (country: string) => {
    setInputEducation({
      ...inputEducation,
      school: {
        ...inputEducation.school,
        country,
      },
    });
  };

  const onChangeExperience = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputExperience({
      ...inputExperience,
      [event.target.name]: event.target.value,
    });
  };

  const addEducation = () => {
    if (!inputEducation.startDate) {
      return;
    }

    const newEducation: UserEducation = {
      school: {
        name: inputEducation.school.name,
        id: inputEducation.school.id,
        country: inputEducation.school.country,
        rank: inputEducation.school.rank,
      },
      fieldOfStudy: inputEducation.fieldOfStudy,
      startDate: inputEducation.startDate,
      endDate: inputEducation.endDate || 'Present',
    };
    setEducation([...education, newEducation]);
    setInputEducation({
      school: { name: '', id: '', country: '', rank: 1800 },
      fieldOfStudy: '',
      startDate: new Date(),
      endDate: null,
    });
  };

  const addExperience = () => {
    if (!inputExperience.startDate) {
      return;
    }
    const newExperience: UserExperience = {
      company: { name: inputExperience.company },
      position: inputExperience.position,
      startDate: inputExperience.startDate,
      endDate: inputExperience.endDate || 'Present',

      type: inputExperience.type,
    };
    setExperience([...experience, newExperience]);
    setInputExperience({
      company: '',
      position: '',
      startDate: new Date(),
      endDate: null,
      type: '',
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const removeExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const submit = () => {
    updateUser(token, {
      isSetUp: true,
      title: title,
      bio: bio !== '' ? bio : undefined,
      skills: skills.length > 0 ? skills : undefined,
      education: education.length > 0 ? education : undefined,
      experience: experience.length > 0 ? experience : undefined,
    });
    setShowProfileSetup(false);
  };

  useEffect(() => {
    auth.currentUser?.getIdToken().then((token) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setBio(user.bio);
      setSkills(user.skills);
      setEducation(user.education);
      setExperience(user.experience);
      setTitle(user.title ?? '');
    }
  }, [user]);

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
  }, []);

  return (
    <SetupModal pageLoaded={pageLoaded}>
      <Container
        width="100%"
        minH="100vh"
        flex
        dir="column"
        justify="space-between"
        align="center"
        pt={100}
        pb={50}
      >
        <ProfileSetupPagination
          setStep={setStep}
          step={step}
          stepsDone={stepsDone}
        />
        <Container width="75%" height="75%">
          {step === 0 && (
            <StepOne
              bio={bio}
              setBio={setBio}
              setTitle={setTitle}
              title={title}
            />
          )}
          {step === 1 && (
            <StepTwo
              addEducation={addEducation}
              education={education}
              inputEducation={inputEducation}
              onChangeEducation={onChangeEducation}
              removeEducation={removeEducation}
              addExperience={addExperience}
              experience={experience}
              inputExperience={inputExperience}
              onChangeExperience={onChangeExperience}
              removeExperience={removeExperience}
              onChangeCountry ={onChangeCountry}
            />
          )}
          {step === 2 && (
            <StepThree
              inputSkill={inputSkill}
              setInputSkill={setInputSkill}
              skills={skills}
              setSkills={setSkills}
              education={education}
              experience={experience}
            />
          )}
        </Container>
        <ProfileSetupFooter
          step={step}
          submit={submit}
          setStep={setStep}
          stepsDone={stepsDone}
          setStepsDone={setStepsDone}
          token={token}
          setShowProfileSetup={setShowProfileSetup}
          type={type}
        />
      </Container>
    </SetupModal>
  );
};

export default ProfileSetup;
