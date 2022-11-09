import React from 'react';
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

const ListItem = styled('div')`
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary20};
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
}

const SkillRow = ({ skill, education, experience }: Props) => {
  const [relatedEducation, setRelatedEducation] = React.useState<
    RelatedEducation[]
  >([]);
  const [relatedExperience, setRelatedExperience] = React.useState<
    RelatedExperience[]
  >([]);
  const [showRelatedEducation, setShowRelatedEducation] = React.useState(false);
  const [showRelatedExperience, setShowRelatedExperience] =
    React.useState(false);
  const [educationIndexSelected, setEducationIndexSelected] = React.useState<
    number[]
  >([]);
  const [experienceIndexSelected, setexperienceIndexSelected] = React.useState<
    number[]
  >([]);
  const [yearsInput, setYearsInput] = React.useState<string>('');

  const selectEducation = (index: number) => {
    if (educationIndexSelected.includes(index)) {
      setEducationIndexSelected(
        educationIndexSelected.filter((i) => i !== index)
      );
    } else {
      setEducationIndexSelected([...educationIndexSelected, index]);
    }
  };

  const selectExperience = (index: number) => {
    if (experienceIndexSelected.includes(index)) {
      setexperienceIndexSelected(
        experienceIndexSelected.filter((i) => i !== index)
      );
    } else {
      setexperienceIndexSelected([...experienceIndexSelected, index]);
    }
  };

  const numberOfYears = (field: UserEducation | UserExperience): number => {
    const start = field.years.split('-')[0];
    const end =
      field.years.split('-')[1].trim() !== 'Present'
        ? field.years.split('-')[1]
        : new Date().getFullYear().toString();
    const diff = parseInt(end) - parseInt(start);
    return diff;
  };

  const closeModal = () => {
    setShowRelatedEducation(false);
    setShowRelatedExperience(false);
    setYearsInput('');
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

      setRelatedEducation(newRelatedEducation);
      setShowRelatedEducation(false);
    } else {
      let newRelatedExperience: RelatedExperience[] = [];
      experienceIndexSelected.forEach((index) => {
        const years = numberOfYears(experience[index]);
        const related = {
          experience: experience[index],
          years: years,
        };
        newRelatedExperience.push(related);
      });
      setRelatedExperience(newRelatedExperience);
      setShowRelatedExperience(false);
    }
  };

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
                        {edu.fieldOfStudy}
                      </Text>
                      <Text fontSize={18}>{edu.school.name}</Text>
                      <Text>{edu.years}</Text>
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
                  <ListItem key={i} onClick={() => selectExperience(i)}>
                    <div>
                      <Text fontSize={18} fontWeight="bold">
                        {exp.position}
                      </Text>
                      <Text fontSize={18}>{exp.company.name}</Text>
                      <Text>{exp.years}</Text>
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
          {relatedEducation.map((edu, i) => (
            <div key={i}>
              <Text fontSize={18} fontWeight="bold">
                {edu.education.school.name}
              </Text>
              <Text>{edu.years} Years</Text>
            </div>
          ))}

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
              <Text fontSize={18} fontWeight={'bold'}>
                {exp.experience.company.name}
              </Text>
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
