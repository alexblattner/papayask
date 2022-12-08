import { UserEducation, UserExperience, UserSkill } from '../models/User';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import SkillBlock from './SkillBlock';
import useWidth from '../Hooks/useWidth';

interface Props {
  inputSkill: UserSkill;
  setInputSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  skills: UserSkill[];
  education: UserEducation[];
  experience: UserExperience[];
  removeSkill: (index: number) => void;
}

const SkillsForm = (props: Props) => {
  const {
    inputSkill,
    setInputSkill,
    setSkills,
    skills,
    education,
    experience,
    removeSkill,
  } = props;

  const { width } = useWidth();
  return (
    <Container>
      <Text fontSize={32} fontWeight={600} mb={16}>
        What skills do you have?
      </Text>
      <Container width="100%" flex>
        <Input
          name="skills"
          type="text"
          width="300px"
          value={inputSkill.name}
          placeholder="Type a skill and press enter"
          onChange={(e) =>
            setInputSkill({ ...inputSkill, name: e.target.value })
          }
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setSkills([...skills, inputSkill]);
              setInputSkill({
                name: '',
                educations: [],
                experiences: [],
              });
            }
          }}
        />
      </Container>

      <Container mb={12} width={width > 800 ? '60%' : '100%'} mx="auto">
        {skills.map((skill, i) => (
          <SkillBlock
            skill={skill}
            key={i}
            index={i}
            education={education}
            experience={experience}
            skills={skills}
            setSkills={setSkills}
            removeSkill={removeSkill}
          />
        ))}
      </Container>
    </Container>
  );
};

export default SkillsForm;
