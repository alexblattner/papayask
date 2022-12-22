import React, { useContext, useEffect, useState } from 'react';
import { University, UserEducation, UserProps } from '../models/User';
import Modal from '../shared/Modal';
import EducationForm from './EducationForm';
import { Education } from './profileService';
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'Initial' | 'Edit' | 'Add';
  education: Education | null;
  user: UserProps;
  index?: number;
}

const EducationModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [education, setEducation] = useState<Education>({
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

  const { addEducation } = useEditProfile();
  const { updateUser } = useContext(AuthContext);

  const onChangeEducation = (
    name: string,
    value: string | University | Date
  ) => {
    if (value instanceof Object && !(value instanceof Date)) {
      setEducation({
        ...education,
        university: value,
      });
    } else if (name.includes('university')) {
      name = name.split('-')[1];

      setEducation({
        ...education,
        university: {
          ...education.university,
          [name]: value,
        },
      });
    } else {
      setEducation({
        ...education,
        [name]: value,
      });
    }
  };

  const onChangeCountry = (country: string) => {
    setEducation({
      ...education,
      university: {
        ...education.university,
        country,
      },
    });
  };

  const submitEducation = async () => {
    setIsLoading(true);
    const userEducation = props.user.education;
    if (props.type === 'Add') {
      userEducation.push(education as UserEducation);
    } else {
      userEducation[props.index as number] = education as UserEducation;
    }
    await updateUser({
      education: userEducation,
    });
    props.setShowModal(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.education) {
      setEducation(props.education!);
    }
  }, [props.education]);
  return (
    <Modal setShowModal={props.setShowModal}>
      <EducationForm
        onChangeEducation={onChangeEducation}
        inputEducation={education}
        onAddEducation={() => {
          addEducation(education);
        }}
        onChangeCountry={onChangeCountry}
        type={props.type}
        closeForm={() => props.setShowModal(false)}
        submitEducation={submitEducation}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default EducationModal;
