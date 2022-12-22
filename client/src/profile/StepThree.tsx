import { useEditProfile } from './profileService';
import SkillsForm from './SkillsForm';

const StepThree = () => {
  const {
    setSkills,
    skills,
    education,
    experience,
    removeSkill,
  } = useEditProfile();
  return (
    <SkillsForm
   
      setSkills={setSkills}
      skills={skills}
      education={education}
      experience={experience}
      removeSkill={removeSkill}
    />
  );
};

export default StepThree;
