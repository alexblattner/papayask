import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import SkillRow from './SkillRow';
import { useEditProfile } from './profileService';
import SkillsForm from './SkillsForm';

const StepThree = () => {
  const {
    inputSkill,
    setInputSkill,
    setSkills,
    skills,
    education,
    experience,
    removeSkill,
  } = useEditProfile();
  return (
    <SkillsForm
      inputSkill={inputSkill}
      setInputSkill={setInputSkill}
      setSkills={setSkills}
      skills={skills}
      education={education}
      experience={experience}
      removeSkill={removeSkill}
    />
  );
};

export default StepThree;
