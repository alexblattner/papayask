import React, { useContext, useState } from 'react';
import { UserProps } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import Modal from '../shared/Modal';
import { EditProfileContext } from './profileService';
import SkillsForm from './SkillsForm';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

const SkillsModal = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { skills, setSkills, updateSkills, removeSkill } =
    useContext(EditProfileContext);

  const update = async () => {
    setLoading(true);
    await updateSkills();
    setLoading(false);
    props.setShowModal(false);
  };

  return (
    <Modal setShowModal={props.setShowModal} closeButton = {true}>
      <Container flex dir="column" width="100%" pl={40} pt={20}>
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
          <Button variant="primary" onClick={update} disabled={loading}>
            {loading ? 'Please Wait...' : 'Save'}
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};

export default SkillsModal;
