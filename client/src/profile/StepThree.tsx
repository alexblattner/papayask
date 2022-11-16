import React from 'react';
import { UserEducation, UserExperience, UserSkill } from '../models/User';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import SkillRow from './SkillRow';

interface Props {
  inputSkill: UserSkill;
  setInputSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
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
        value={inputSkill.name}
        placeholder="Type a skill and press enter"
        onChange={(e) => setInputSkill({ ...inputSkill, name: e.target.value })}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setSkills([...skills, inputSkill]);
            setInputSkill({
              name: '',
              education: [],
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
        <Container width="200px" borderRight="1px solid #f8cbc9">
          Skill
        </Container>
        <Container
          width="calc(50% - 112px)"
          px={16}
          flex
          align="center"
          gap={16}
          borderRight="1px solid #f8cbc9"
        >
          Related Education
        </Container>
        <Container
          width="calc(50% - 112px)"
          px={16}
          flex
          align="center"
          gap={16}
        >
          Related Experience
        </Container>
      </Container>
      {skills.map((skill, i) => (
        <SkillRow
          skill={skill}
          key={i}
          education={education}
          experience={experience}
          skills={skills}
          setSkills={setSkills}
        />
      ))}
    </Container>
  );
};

export default StepThree;
