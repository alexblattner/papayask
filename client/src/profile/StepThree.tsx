import React from 'react';
import { UserEducation, UserExperience, UserSkill } from '../models/User';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import SkillRow from './SkillRow';

interface Props {
  inputSkill: UserSkill;
  setInputSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  removeSkill: (index: number) => void;
  skills: UserSkill[];
  education: UserEducation[];
  experience: UserExperience[];
}

const StepThree = (props: Props) => {
  const {
    inputSkill,
    setInputSkill,
    setSkills,
    skills,
    education,
    experience,
  } = props;
  return (
    <Container>
      <Text fontSize={32} fontWeight={600} mb={16}>
        What skills do you have?
      </Text>
      <Input
        name="skills"
        type="text"
        width='400px'
        value={inputSkill.name}
        placeholder="Type a skill and press enter"
        onChange={(e) => setInputSkill({ ...inputSkill, name: e.target.value })}
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

      <Container
        flex
        align="center"
        py={12}
        borderBottom="1px solid var(--primary)"
      >
        <Container width="20%" borderRight="1px solid #f8cbc9">
          Skill
        </Container>
        <Container
          width="40%"
          px={16}
          flex
          align="center"
          gap={16}
          borderRight="1px solid #f8cbc9"
        >
          Related Education
        </Container>
        <Container
          width="40%"
          px={16}
          flex
          align="center"
          gap={16}
        >
          Related Experience
        </Container>
      </Container>
      <Container mb={12}>
        {skills.map((skill, i) => (
          <SkillRow
            skill={skill}
            key={i}
            index={i}
            education={education}
            experience={experience}
            skills={skills}
            setSkills={setSkills}
            removeSkill={props.removeSkill}
          />
        ))}
      </Container>
    </Container>
  );
};

export default StepThree;
