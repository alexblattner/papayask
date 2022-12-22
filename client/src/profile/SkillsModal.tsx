import React, { useContext, useEffect, useState } from 'react';
import { UserProps, UserSkill } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import Modal from '../shared/Modal';
import SkillsForm from './SkillsForm';
import { AuthContext } from '../Auth/ContextProvider';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

const SkillsModal = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const [skills, setSkills] = useState<UserSkill[]>([]);

  const { updateUser } = useContext(AuthContext);

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const updateSkills = async () => {
    setLoading(true);
    try {
      await updateUser({ skills });
      props.setShowModal(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    props.setShowModal(false);
  };

  useEffect(() => {
    setSkills(props.user.skills);
  }, [props.user.skills]);

  return (
    <Modal setShowModal={props.setShowModal}>
      <Container flex dir="column" width="100%" pl={40} pt ={20}>
        <SkillsForm
       
          setSkills={setSkills}
          skills={skills}
          education={props.user.education}
          experience={props.user.experience}
          removeSkill={removeSkill}
        />
        <Container flex justify="flex-end" gap={12} mt={16}>
          <Button variant="outline" onClick={() => props.setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateSkills} disabled={loading}>
            {loading ? 'Please Wait...' : 'Save'}
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};

export default SkillsModal;
