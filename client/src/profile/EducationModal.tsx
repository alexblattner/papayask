import React, { useContext, useEffect, useState } from 'react';
import { University, UserEducation, UserProps } from '../models/User';
import Modal from '../shared/Modal';
import EducationForm from './EducationForm';
import { Education } from './profileService';
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';
import ConfirmationAlert from '../shared/ConfirmationAlert';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'Initial' | 'Edit' | 'Add';
  education: Education | null;
  user: UserProps;
  index?: number;
}

const EducationModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [inputEducation, setInputEducation] = useState<Education>({
    university: {
      name: '',
      country: '',
      rank: 1800,
      logo: '',
    },
    name: '',
    level: '',
    startDate: null,
    endDate: '',
  });

  const {
    addEducation,
    deleteEducation,
    education: userEducation,
  } = useEditProfile();
  const { updateUser } = useContext(AuthContext);

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

  const onConfirmDelete = async () => {
    setShowAlert(false);
    setIsDeleting(true);
    const educationIndex = userEducation.findIndex(
      (edu) =>
        edu.name === inputEducation.name &&
        edu.university.name === inputEducation.university.name
    );

    const body = {
      education: userEducation.filter(
        (edu) =>
          edu.name !== inputEducation.name ||
          edu.university.name !== inputEducation.university.name
      ),
    };
    if (educationIndex !== -1) {
      deleteEducation(educationIndex);
    }

    await updateUser(body);
    setIsDeleting(false);
    props.setShowModal(false);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const deleteCurrentEducation = async () => {
    setShowAlert(true);
  };

  const submitEducation = async () => {
    setIsLoading(true);
    const userEducation = props.user.education;
    if (props.type === 'Add') {
      userEducation.push(inputEducation as UserEducation);
    } else {
      userEducation[props.index as number] = inputEducation as UserEducation;
    }
    await updateUser({
      education: userEducation,
    });
    props.setShowModal(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.education) {
      setInputEducation(props.education!);
    }
  }, [props.education]);
  return (
    <>
      {showAlert && (
        <ConfirmationAlert
          onConfirm={onConfirmDelete}
          closeAlert={closeAlert}
          message="Are you sure you want to delete this education? this action is irreversible"
          title="Delete Education"
          type="delete"
        />
      )}
      <Modal setShowModal={props.setShowModal} closeButton = {false}>
        <EducationForm
          onChangeEducation={onChangeEducation}
          inputEducation={inputEducation}
          onAddEducation={() => {
            addEducation(inputEducation);
          }}
          onChangeCountry={onChangeCountry}
          type={props.type}
          closeForm={() => props.setShowModal(false)}
          submitEducation={submitEducation}
          isLoading={isLoading}
          deleteCurrentEducation={deleteCurrentEducation}
          isDeleting={isDeleting}
        />
      </Modal>
    </>
  );
};

export default EducationModal;
