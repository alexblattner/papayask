import React, { useContext, useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import ExperienceForm from './ExperienceForm';
import { Experience } from './profileService';
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';
import { UserExperience, UserProps } from '../models/User';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'Initial' | 'Edit' | 'Add';
  experience: Experience | null;
  index?: number;
  user: UserProps;
}

const ExperienceModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [experience, setExperience] = useState<Experience>({
    company: {
      name: '',
    },
    name: '',
    type: '',
    startDate: null,
    endDate: '',
    geographic_specialization: '',
  });

  const { addExperience } = useEditProfile();
  const { updateUser } = useContext(AuthContext);

  const onChangeExperience = (
    name: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => {
    if (name === 'company') {
      setExperience({
        ...experience,
        company: {
          name: (
            event as
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ).target.value,
        },
      });
    } else if (name === 'startDate' || name === 'endDate') {
      setExperience({
        ...experience,
        [name]: event,
      });
    } else {
      setExperience({
        ...experience,
        [name]: (
          event as
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
        ).target.value,
      });
    }
  };

  const onChangeExperienceCountry = (country: string) => {
    setExperience({
      ...experience,
      geographic_specialization: country,
    });
  };

  const submitExperience = async () => {
    setIsLoading(true);
    const userExperience = props.user.experience;
    if (props.type === 'Add') {
      userExperience.push(experience as UserExperience);
    } else {
      userExperience[props.index as number] = experience as UserExperience;
    }
    await updateUser({
      experience: userExperience,
    });
    props.setShowModal(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.experience) {
      setExperience(props.experience);
    }
  }, [props.experience]);
  return (
    <Modal setShowModal={props.setShowModal}>
      <ExperienceForm
        onChangeExperience={onChangeExperience}
        inputExperience={experience}
        onAddExperience={() => {
          addExperience(experience);
        }}
        onChangeExperienceCountry={onChangeExperienceCountry}
        type={props.type}
        closeForm={() => props.setShowModal(false)}
        submitExperience={submitExperience}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default ExperienceModal;
