import styled from 'styled-components';

import { UserEducation, UserExperience, UserSkill } from '../models/User';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import React, { useContext, useEffect, useState } from 'react';
import { DetailedSkill } from './DetailedSkill';
import SvgIcon from '../shared/SvgIcon';
import { formatDateNamed } from '../utils/formatDate';
import Badge from '../shared/Badge';
import { Button } from '../shared/Button';
import { EditProfileContext } from './profileService';

interface Props {
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  skills: UserSkill[];
  education: UserEducation[];
  experience: UserExperience[];
  removeSkill: (index: number) => void;
}

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  grid-gap: 12px;
  margin-bottom: 24px;
`;

const RelatedContainer = styled.div`
  width: 100%;
  min-height: 50px;
  border: 2px solid
    ${(props) => (props.color ? props.color : props.theme.colors.secondary_L1)};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
`;

const RelatedList = styled.div<{ expanded: boolean }>`
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  z-index: 9;
  transition: all 0.3s ease-in-out;
  max-height: ${(props) => (props.expanded ? '300px' : '0')};
  overflow: ${(props) => (props.expanded ? 'auto' : 'hidden')};
`;

const Arrow = styled(Container)<{ expanded: boolean }>`
  transition: all 0.3s ease-in-out;
  transform: ${(props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  pointer-events: none;
  &:hover {
    background-color: transparent;
  }
`;

const Row = styled(Container)`
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_L2};
  }
`;
const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
`;

type Mode = 'edit' | 'add';

const SkillsForm = (props: Props) => {
  const [disabledAdd, setDisabledAdd] = useState<boolean>(false);
  const [disabledEdit, setDisabledEdit] = useState<boolean>(false);
  const [showEducationList, setShowEducationList] = useState<boolean>(false);
  const [showExperienceList, setShowExperienceList] = useState<boolean>(false);

  const {
    selectedExperienceIndexes,
    setSelectedExperienceIndexes,
    selectedEducationIndexes,
    setSelectedEducationIndexes,
    skills,
    removeSkill,
    addSkill,
    currentSkill,
    setCurrentSkill,
  } = useContext(EditProfileContext);

  const [mode, setMode] = useState<Mode>('add');

  const { education, experience } = props;

  const isSkillNameExists = (name: string) => {
    return skills.some((skill) => skill.name === name);
  };

  const toggleShowExperience = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (showEducationList) setShowEducationList(!showEducationList);
    setShowExperienceList(!showExperienceList);
  };

  const toggleShowEducation = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (showExperienceList) setShowExperienceList(!showExperienceList);
    setShowEducationList(!showEducationList);
  };

  const selectIndex = (index: number, type: 'experience' | 'education') => {
    if (type === 'experience') {
      if (selectedExperienceIndexes.includes(index)) {
        setSelectedExperienceIndexes(
          selectedExperienceIndexes.filter((i) => i !== index)
        );
      } else {
        setSelectedExperienceIndexes([...selectedExperienceIndexes, index]);
      }
    } else {
      if (selectedEducationIndexes.includes(index)) {
        setSelectedEducationIndexes(
          selectedEducationIndexes.filter((i) => i !== index)
        );
      } else {
        setSelectedEducationIndexes([...selectedEducationIndexes, index]);
      }
    }
  };

  const add = () => {
    addSkill();
    resetMode();
  };

  const getSelectedIndexes = () => {
    const educationIndexes: number[] = [];
    props.education.forEach((e) => {
      currentSkill.educations.forEach((s) => {
        if (
          e.name === s.education.name &&
          e.university.name === s.education.university.name
        ) {
          educationIndexes.push(props.education.indexOf(e));
        }
      });
    });
    setSelectedEducationIndexes(educationIndexes);
    const experienceIndexes: number[] = [];
    props.experience.forEach((e) => {
      currentSkill.experiences.forEach((s) => {
        if (
          e.name === s.experience.name &&
          e.company.name === s.experience.company.name
        ) {
          experienceIndexes.push(props.experience.indexOf(e));
        }
      });
    });
    setSelectedExperienceIndexes(experienceIndexes);
  };

  const resetMode = () => {
    setMode('add');
    setCurrentSkill({
      name: '',
      educations: [],
      experiences: [],
    });
    setSelectedEducationIndexes([]);
    setSelectedExperienceIndexes([]);
  };

  useEffect(() => {
    if (currentSkill.name.length > 0 && !isSkillNameExists(currentSkill.name)) {
      setDisabledAdd(false);
    } else {
      setDisabledAdd(true);
    }
  }, [currentSkill.name]);

  useEffect(() => {
    if (currentSkill.name.length > 0) {
      setDisabledEdit(false);
    } else {
      setDisabledEdit(true);
    }
  }, [currentSkill.name]);

  useEffect(() => {
    getSelectedIndexes();
  }, [currentSkill]);

  return (
    <Container flex dir="column">
      {showEducationList || showExperienceList ? (
        <BackDrop
          onClick={() => {
            setShowEducationList(false);
            setShowExperienceList(false);
          }}
        />
      ) : null}
      <Text fontSize={32} fontWeight={600} mb={16} color="primary">
        Add your skills
      </Text>

      <Input
        name=""
        value={currentSkill.name}
        type="text"
        label="Add Skill"
        onChange={(e) =>
          setCurrentSkill({ ...currentSkill, name: e.target.value })
        }
      />
      <Container flex gap={12} align="center" mb={24}>
        <Container width="100%">
          <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
            Add Related Experience
          </Text>
          <RelatedContainer onClick={toggleShowExperience}>
            <Container flex flexWrap gap={12}>
              {selectedExperienceIndexes.map((index) => (
                <Badge
                  text={experience[index].company.name}
                  key={index}
                  isRemovable
                  onRemove={() => selectIndex(index, 'experience')}
                />
              ))}
            </Container>

            <Arrow ml={'auto'} expanded={showExperienceList}>
              <SvgIcon src="arrow" size={12} color="primary" />
            </Arrow>

            <RelatedList expanded={showExperienceList}>
              {experience.map((exp, i) => (
                <Row
                  key={i}
                  px={12}
                  py={8}
                  borderBottom={`1px solid var(--secondary-l1)`}
                  onClick={() => selectIndex(i, 'experience')}
                  position="relative"
                >
                  <Text fontWeight={'bold'} fontSize={18}>
                    {exp.company.name}
                  </Text>
                  <Text color="black" fontSize={16}>
                    {formatDateNamed(exp.startDate)} -{' '}
                    {formatDateNamed(exp.endDate)}
                  </Text>
                  {selectedExperienceIndexes.includes(i) ? (
                    <Container position="absolute" right="12px" top="14px">
                      <SvgIcon src="check" size={24} color="primary" />
                    </Container>
                  ) : null}
                </Row>
              ))}
            </RelatedList>
          </RelatedContainer>
        </Container>
        <Container width="100%">
          <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
            Add Related Education
          </Text>

          <RelatedContainer onClick={toggleShowEducation}>
            <Container flex flexWrap gap={12}>
              {selectedEducationIndexes.map((index) => (
                <Badge
                  text={education[index].university.name}
                  key={index}
                  isRemovable
                  onRemove={() => selectIndex(index, 'education')}
                />
              ))}
            </Container>

            <Arrow ml={'auto'} expanded={showEducationList}>
              <SvgIcon src="arrow" size={12} color="primary" />
            </Arrow>

            <RelatedList expanded={showEducationList}>
              {education.map((edu, i) => (
                <Row
                  key={i}
                  px={12}
                  py={8}
                  borderBottom={`1px solid var(--secondary-l1)`}
                  onClick={() => selectIndex(i, 'education')}
                  position="relative"
                >
                  <Text fontWeight={'bold'} fontSize={18}>
                    {edu.university.name}
                  </Text>
                  <Text color="black" fontSize={16}>
                    {formatDateNamed(edu.startDate)} -{' '}
                    {formatDateNamed(edu.endDate)}
                  </Text>
                  {selectedEducationIndexes.includes(i) ? (
                    <Container position="absolute" right="12px" top="14px">
                      <SvgIcon src="check" size={24} color="primary" />
                    </Container>
                  ) : null}
                </Row>
              ))}
            </RelatedList>
          </RelatedContainer>
        </Container>
      </Container>
      <Container flex gap={12} mb={24} justify="flex-end">
        {mode === 'edit' ? (
          <Button
            variant="primary"
            disabled={disabledEdit}
            onClick={() => {
              add();
            }}
          >
            <Text color="white" fontSize={20} fontWeight="bold">
              Update
            </Text>
          </Button>
        ) : null}
        <Button
          variant={mode === 'add' ? 'primary' : 'outline'}
          disabled={disabledAdd}
          onClick={() => {
            if (mode === 'add') {
              add();
            } else {
              resetMode();
            }
          }}
        >
          {mode === 'edit' ? 'Add New Skill' : 'Add'}
        </Button>
      </Container>
      <SkillsGrid>
        {skills.map((skill, i) => (
          <DetailedSkill
            skill={skill}
            index={i}
            key={i}
            removeSkill={removeSkill}
            setCurrentSkill={setCurrentSkill}
            setMode={setMode}
            currentSkill={currentSkill}
          />
        ))}
      </SkillsGrid>
    </Container>
  );
};

export default SkillsForm;
