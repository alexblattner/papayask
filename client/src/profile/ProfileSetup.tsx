import React, { useState, useEffect } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import { auth } from '../firebase-auth';
import styled from 'styled-components';

import {
  University,
  UserEducation,
  UserExperience,
  UserSkill,
  EducationLevel,
  Company,
} from '../models/User';
import ProfileSetupFooter from './ProfileSetupFooter';
import ProfileSetupPagination from './ProfileSetupPagination';
import { Container } from './components/Container';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';

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
  university: University;
  name: string;
  level: EducationLevel;
  startDate: Date | null;
  endDate: Date | string | null;
}

export interface Experience {
  company: Company;
  name: string;
  startDate: Date | null;
  endDate: Date | string | null;
  type: string;
  geographic_specialization: string;
}

const ProfileSetup = ({
  setShowProfileSetup,
  type,
  initialStep,
}: ProfileSetupProps) => {
  const [title, setTitle] = useState<string>('');
  const [image, setImage] = React.useState<string>('');
  const [token, setToken] = useState<string>('');
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { user, updateUser } = React.useContext(AuthContext);
  const [step, setStep] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [country, setCountry] = useState<string>('');
  const [cloudinaryImageId, setCloudinaryImageId] = React.useState<string>('');

  const [inputSkill, setInputSkill] = useState<UserSkill>({
    name: '',
    educations: [],
    experiences: [],
  });
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [inputEducation, setInputEducation] = useState<Education>({
    university: {
      name: '',
      _id: '',
      country: '',
      rank: 1800,
    },
    level: '',
    name: '',
    startDate: null,
    endDate: null,
  });
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [inputExperience, setInputExperience] = useState<Experience>({
    company: { name: '' },
    name: '',
    startDate: null,
    endDate: null,
    type: '',
    geographic_specialization: '',
  });

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const onChangeEducation = (
    name: string,
    value: string | University | Date
  ) => {
    if (value instanceof Object && !(value instanceof Date)) {
      setInputEducation({
        ...inputEducation,
        university: value,
      });
    } else if (name.includes('university')) {
      name = name.split('-')[1];

      setInputEducation({
        ...inputEducation,
        university: {
          ...inputEducation.university,
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
      university: {
        ...inputEducation.university,
        country,
      },
    });
  };

  const onChangeExperience = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (name === 'company') {
      setInputExperience({
        ...inputExperience,
        company: {
          name: event.target.value,
        },
      });
    } else {
      setInputExperience({
        ...inputExperience,
        [name]: event.target.value,
      });
    }
  };

  const addEducation = () => {
    if (!inputEducation.startDate) {
      return;
    }

    const newEducation: UserEducation = {
      university: {
        name: inputEducation.university.name,
        _id: inputEducation.university._id,
        country: inputEducation.university.country,
        rank: inputEducation.university.rank,
      },
      level: inputEducation.level,
      name: inputEducation.name,
      startDate: inputEducation.startDate,
      endDate: inputEducation.endDate || undefined,
    };
    setEducation([...education, newEducation]);
    setInputEducation({
      university: { name: '', _id: '', country: '', rank: 1800 },
      name: '',
      level: '',
      startDate: null,
      endDate: null,
    });
  };

  const addExperience = () => {
    if (!inputExperience.startDate) {
      return;
    }
    const newExperience: UserExperience = {
      company: inputExperience.company,
      name: inputExperience.name,
      startDate: inputExperience.startDate,
      endDate: inputExperience.endDate || undefined,
      geographic_specialization: inputExperience.geographic_specialization,
      type: inputExperience.type,
    };
    setExperience([...experience, newExperience]);
    setInputExperience({
      company: { name: '' },
      name: '',
      startDate: null,
      endDate: null,
      type: '',
      geographic_specialization: '',
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

  const addLanguage = (language: string) => {
    setLanguages([...languages, language]);
  };

  const removeLanguage = (text: string) => {
    const newLanguages = [...languages];
    const index = newLanguages.indexOf(text);
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
  };

  const onChangeExperienceCountry = (country: string) => {
    setInputExperience({
      ...inputExperience,
      geographic_specialization: country,
    });
  };

  const submit = () => {
    try {
      updateUser(token, {
        isSetUp: true,
        title: title,
        bio: bio,
        skills: skills,
        education: education,
        experience: experience,
        languages: languages,
        country: country,
        picture: cloudinaryImageId,
      });
      setShowProfileSetup(false);
    } catch (error) {
      console.log(error);
    }
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
      setLanguages(user.languages);
      setCountry(user.country);
      if (user.picture?.name) {
        setImage(
          `https://res.cloudinary.com/snipcritics/image/upload/v1668941778/${process.env.REACT_APP_ENV}/${user.picture.name}.jpg`
        );
        setCloudinaryImageId(user.picture.name);
      }
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
        align="center"
        pt={100}
        pb={50}
      >
        <ProfileSetupPagination
          setStep={setStep}
          step={step}
          stepsDone={stepsDone}
        />
        <Container width="75%" pt={50}>
          {step === 0 && (
            <StepOne
              bio={bio}
              setBio={setBio}
              setTitle={setTitle}
              title={title}
              setCloudinaryImageId={setCloudinaryImageId}
              image={image}
              setImage={setImage}
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
              onChangeCountry={onChangeCountry}
              onChangeExperienceCountry={onChangeExperienceCountry}
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
              removeSkill={removeSkill}
            />
          )}

          {step === 3 && (
            <StepFour
              addLanguage={addLanguage}
              languages={languages}
              removeLanguage={removeLanguage}
              country={country}
              setCountry={setCountry}
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
