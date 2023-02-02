import React, { useContext, useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import ExperienceForm from './ExperienceForm';
import { Experience } from './profileService';
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';
import { Company, UserExperience, UserProps } from '../models/User';
import ConfirmationAlert from '../shared/ConfirmationAlert';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'Initial' | 'Edit' | 'Add';
  experience: Experience | null;
  index?: number;
  user: UserProps;
}

const ExperienceModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [inputExperience, setInputExperience] = useState<Experience>({
    company: {
      name: '',
    },
    name: '',
    type: '',
    startDate: null,
    endDate: '',
    geographic_specialization: '',
  });

  const {
    addExperience,
    deleteExperience,
    experience: userExperience,
  } = useEditProfile();
  const { updateUser } = useContext(AuthContext);

  const onChangeExperienceCompany = (company: Company | string) => {
    if (company instanceof Object) {
      setInputExperience({
        ...inputExperience,
        company,
      });
    } else {
      setInputExperience({
        ...inputExperience,
        company: {
          name: company,
        },
      });
    }
  };

  const onChangeExperience = (
    name: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => {
    if (name === 'startDate' || name === 'endDate') {
      setInputExperience({
        ...inputExperience,
        [name]: event,
      });
    } else {
      setInputExperience({
        ...inputExperience,
        [name]: (
          event as
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
        ).target.value,
      });
    }
  };

  const onChangeExperienceCountry = (country: string) => {
    setInputExperience({
      ...inputExperience,
      geographic_specialization: country,
    });
  };

  const submitExperience = async () => {
    setIsLoading(true);
    const userExperience = props.user.experience;
    if (props.type === 'Add') {
      userExperience.push(inputExperience as UserExperience);
    } else {
      userExperience[props.index as number] = inputExperience as UserExperience;
    }
    await updateUser({
      experience: userExperience,
    });
    props.setShowModal(false);
    setIsLoading(false);
  };

  const deleteCurrentExperience = () => {
    setShowAlert(true);
  };

  const onConfirmDelete = async () => {
    setShowAlert(false);
    setIsDeleting(true);
    const experienceIndex = userExperience.findIndex(
      (exp) =>
        exp.name === inputExperience.name &&
        exp.company.name === inputExperience.company.name
    );

    const newExp = userExperience.filter(
      (exp) =>
        exp.name !== inputExperience.name ||
        exp.company.name !== inputExperience.company.name
    );

    const body = {
      experience: newExp,
    };
    await updateUser(body);
    if (experienceIndex !== -1) {
      deleteExperience(experienceIndex);
    }
    setIsDeleting(false);
    props.setShowModal(false);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (props.experience) {
      setInputExperience(props.experience);
    }
  }, [props.experience]);
  return (
    <>
      {showAlert && (
        <ConfirmationAlert
          onConfirm={onConfirmDelete}
          closeAlert={closeAlert}
          message="Are you sure you want to delete this experience? this action is irreversible"
          title="Delete Experience"
          type="delete"
        />
      )}
      <Modal setShowModal={props.setShowModal} closeButton = {false}>
        <ExperienceForm
          onChangeExperience={onChangeExperience}
          inputExperience={inputExperience}
          onAddExperience={() => {
            addExperience(inputExperience);
          }}
          onChangeExperienceCountry={onChangeExperienceCountry}
          onChangeExperienceCompany={onChangeExperienceCompany}
          type={props.type}
          closeForm={() => props.setShowModal(false)}
          submitExperience={submitExperience}
          isLoading={isLoading}
          deleteCurrentExperience={deleteCurrentExperience}
        />
      </Modal>
    </>
  );
};

export default ExperienceModal;
