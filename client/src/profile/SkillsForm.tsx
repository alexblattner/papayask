import styled from 'styled-components';

import { UserEducation, UserExperience, UserSkill } from '../models/User';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import SkillBlock from './SkillBlock';
import useWidth from '../Hooks/useWidth';
import SvgIcon from '../shared/SvgIcon';
import { useEffect, useState } from 'react';

interface Props {
  inputSkill: UserSkill;
  setInputSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  skills: UserSkill[];
  education: UserEducation[];
  experience: UserExperience[];
  removeSkill: (index: number) => void;
}

const SubmitIcon = styled.div<{ disabled: boolean }>`
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  background-color: ${(props) => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 4px;

  position: absolute;
  top: 5px;
  right: 5px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.primary
        : props.theme.colors.primary_L1};
  }
`;

const SkillsForm = (props: Props) => {
  const [disabled, setDisabled] = useState<boolean>(false);

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

  const isSkillNameExists = (name: string) => {
    return skills.some((skill) => skill.name === name);
  };

  useEffect(() => {
    if (inputSkill.name.length > 0 && !isSkillNameExists(inputSkill.name)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputSkill.name]);

  return (
    <Container>
      <Text fontSize={32} fontWeight={600} mb={16}>
        What skills do you have?
      </Text>
      <Container width="100%" flex>
        <Container width="300px" position="relative">
          <SubmitIcon
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              setSkills([...skills, inputSkill]);
              setInputSkill({
                name: '',
                educations: [],
                experiences: [],
              });
            }}
          >
            <Text color="white" fontSize={12} fontWeight="bold">
              Add
            </Text>
          </SubmitIcon>
          <Input
            name="skills"
            type="text"
            width="300px"
            value={inputSkill.name}
            placeholder="Enter a skill"
            onChange={(e) =>
              setInputSkill({ ...inputSkill, name: e.target.value })
            }
          />
        </Container>
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
