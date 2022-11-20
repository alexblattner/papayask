import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

import {
  RelatedEducation,
  RelatedExperience,
  UserEducation,
  UserExperience,
  UserSkill,
} from '../models/User';
import { Container } from './components/Container';
import Icon from '../shared/Icon';
import { Text } from './components/Text';
import styled from 'styled-components';
import { Button } from './components/Button';
import { Input } from './components/Input';
import formatDate from '../utils/formatDate';

const ListItem = styled('div')`
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary_L2};
  }
`;

const CheckIcon = styled('div')<{ selected: boolean }>`
  transition: all 0.3s ease-in-out;
  opacity: ${(props) => (props.selected ? 1 : 0)};
`;

interface Props {
  skill: UserSkill;
  education: UserEducation[];
  experience: UserExperience[];
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
}

const SkillRow = ({
  skill,
  education,
  experience,
  skills,
  setSkills,
}: Props) => {
  const [relatedEducation, setRelatedEducation] = React.useState<
    RelatedEducation[]
  >(skill.educations);
  const [relatedExperience, setRelatedExperience] = React.useState<
    RelatedExperience[]
  >(skill.experiences);
  const [showRelatedEducation, setShowRelatedEducation] = React.useState(false);
  const [showRelatedExperience, setShowRelatedExperience] =
    React.useState(false);
  const [educationIndexSelected, setEducationIndexSelected] = React.useState<
    number[]
  >([]);
  const [experienceIndexSelected, setexperienceIndexSelected] = React.useState<
    number[]
  >([]);
  const [yearsInputs, setYearsInput] = React.useState<number[]>([]);

  const selectEducation = (index: number) => {
    if (educationIndexSelected.includes(index)) {
      setEducationIndexSelected(
        educationIndexSelected.filter((i) => i !== index)
      );
    } else {
      setEducationIndexSelected([...educationIndexSelected, index]);
    }
  };

  const selectExperience = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }
    if (experienceIndexSelected.includes(index)) {
      setexperienceIndexSelected(
        experienceIndexSelected.filter((i) => i !== index)
      );
      const newYears = [...yearsInputs];
      newYears[index] = 0;
      setYearsInput(newYears);
    } else {
      setexperienceIndexSelected([...experienceIndexSelected, index]);
    }
  };

  const numberOfYears = (field: UserEducation | UserExperience): number => {
    const start = new Date(field.startDate).getFullYear();
    const end = field.endDate
      ? new Date(field.endDate).getFullYear()
      : new Date().getFullYear();
    const diff = end - start;
    return diff;
  };

  const closeModal = () => {
    setShowRelatedEducation(false);
    setShowRelatedExperience(false);
    setYearsInput([]);
    setEducationIndexSelected([]);
    setexperienceIndexSelected([]);
  };

  const add = () => {
    if (showRelatedEducation) {
      let newRelatedEducation: RelatedEducation[] = [];
      educationIndexSelected.forEach((index) => {
        const years = numberOfYears(education[index]);

        const related = {
          education: education[index],
          years: years,
        };
        newRelatedEducation.push(related);
      });

      const updatedSkill = {
        ...skill,
        education: [...newRelatedEducation],
      };

      const newSkills = skills.map((s) => {
        if (s.name === updatedSkill.name) {
          return updatedSkill;
        }
        return s;
      });

      setSkills(newSkills);
      setShowRelatedEducation(false);
    } else {
      let newRelatedExperience: RelatedExperience[] = [];
      experienceIndexSelected.forEach((index) => {
        const years =
          numberOfYears(experience[index]) < yearsInputs[index] ||
          yearsInputs[index] === 0
            ? numberOfYears(experience[index])
            : yearsInputs[index];
        const related = {
          experience: experience[index],
          years: years,
        };
        newRelatedExperience.push(related);
      });
      const updatedSkill = {
        ...skill,
        experiences: [...newRelatedExperience],
      };

      const newSkills = skills.map((s) => {
        if (s.name === updatedSkill.name) {
          return updatedSkill;
        }
        return s;
      });

      setSkills(newSkills);
      setShowRelatedExperience(false);
    }
  };

  const setYears = (index: number, value: string) => {
    if (!experienceIndexSelected.includes(index)) {
      return;
    }
    const years = parseInt(value);
    if (years) {
      const newYears = [...yearsInputs];
      newYears[index] = years;
      setYearsInput(newYears);
    } else {
      const newYears = [...yearsInputs];
      newYears[index] = 0;
      setYearsInput(newYears);
    }
  };

  useEffect(() => {
    const years = experience.map(() => 0);
    setYearsInput(years);
  }, [experience]);

  useEffect(() => {
    setRelatedEducation(skill.educations);
    setRelatedExperience(skill.experiences);
    const educationIndexes: number[] = [];
    education.forEach((e) => {
      skill.educations.forEach((s) => {
        if (e.name === s.education.name) {
          educationIndexes.push(education.indexOf(e));
        }
      });
    });
    setEducationIndexSelected(educationIndexes);
    const experienceIndexes: number[] = [];
    experience.forEach((e) => {
      skill.experiences.forEach((s) => {
        if (e.name === s.experience.name) {
          experienceIndexes.push(experience.indexOf(e));
        }
      });
    });
    setexperienceIndexSelected(experienceIndexes);
  }, [skill]);

  return (
    <>
      {
        <Modal
          show={showRelatedEducation || showRelatedExperience}
          onHide={closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Add Related {showRelatedEducation ? 'Education' : 'Experience'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Which of the following is relevent to this skill?</p>
            {showRelatedEducation && (
              <>
                {education.map((edu, i) => (
                  <ListItem key={i} onClick={() => selectEducation(i)}>
                    <div>
                      <Text fontSize={18} fontWeight="bold">
                        {edu.name}
                      </Text>
                      <Text fontSize={18}>{edu.university.name}</Text>
                      <Text>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </Text>
                    </div>
                    <CheckIcon selected={educationIndexSelected.includes(i)}>
                      <Icon src="check" width={30} height={30} />
                    </CheckIcon>
                  </ListItem>
                ))}
              </>
            )}
            {showRelatedExperience && (
              <div>
                {experience.map((exp, i) => (
                  <ListItem key={i} onClick={(e) => selectExperience(e, i)}>
                    <div>
                      <Container flex gap={3} align="flex-end" mb={10}>
                        <Text fontSize={18} fontWeight="bold">
                          {exp.name}
                        </Text>
                        <Text>/</Text>
                        <Text fontSize={16}>{exp.company.name}</Text>
                      </Container>
                      <Input
                        name="years"
                        value={yearsInputs[i] === 0 ? '' : yearsInputs[i]}
                        onChange={(e) => setYears(i, e.target.value)}
                        placeholder="Years"
                        type="number"
                      />
                    </div>
                    <CheckIcon selected={experienceIndexSelected.includes(i)}>
                      <Icon src="check" width={30} height={30} />
                    </CheckIcon>
                  </ListItem>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={add}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      }
      <Container
        flex
        align="center"
        py={16}
        borderBottom="1px solid #f8cbc9"
        key={skill.name}
      >
        <Container width="200px" borderRight="1px solid #f8cbc9">
          {skill.name}
        </Container>
        <Container
          width="calc(50% - 112px)"
          px={16}
          flex
          align="center"
          gap={16}
          borderRight="1px solid #f8cbc9"
        >
          <Container flex align="center" gap={16} flexWrap>
            {relatedEducation.map((edu, i) => (
              <div key={i}>
                <Text fontSize={18} fontWeight="bold">
                  {edu.education.university.name}
                  {i !== relatedEducation.length - 1 && `,`}
                </Text>
              </div>
            ))}
          </Container>

          <Container
            width="25px"
            ml={'auto'}
            onClick={() => setShowRelatedEducation(true)}
          >
            {' '}
            <Icon src="plus" width={15} height={15} />
          </Container>
        </Container>
        <Container
          width="calc(50% - 112px)"
          pl={16}
          flex
          align="center"
          gap={16}
        >
          {relatedExperience.map((exp, i) => (
            <div key={i}>
              <Container flex>
                <Text fontSize={18} fontWeight={'bold'}>
                  {exp.experience.company.name}
                </Text>
                <Text fontSize={18}>/</Text>
                <Text fontSize={14}>{exp.experience.name}</Text>
              </Container>

              <Text>{exp.years} Years</Text>
            </div>
          ))}
          <Container
            width="25px"
            ml={'auto'}
            onClick={() => setShowRelatedExperience(true)}
          >
            {' '}
            <Icon src="plus" width={15} height={15} />
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default SkillRow;
