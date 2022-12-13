import React from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { UserEducation, UserExperience } from '../models/User';
import { Text } from '../shared/Text';
import SvgIcon from '../shared/SvgIcon';
import { Button } from '../shared/Button';
import formatDate from '../utils/formatDate';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';

interface Props {
  showRelatedEducation: boolean;
  showRelatedExperience: boolean;
  closeModal: () => void;
  education: UserEducation[];
  experience: UserExperience[];
  add: () => void;
  selectEducation: (index: number) => void;
  selectExperience: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => void;
  educationIndexSelected: number[];
  experienceIndexSelected: number[];
  getInputYears: (index: number) => string;
  getYearsNumber: (index: number, experience: UserExperience) => number;
  setYears: (index: number, value: string) => void;
}

const ListItem = styled('div')`
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  &:hover {
    background-color: ${(props) => props.theme.colors.secondary_L2};
  }
`;

const CheckIcon = styled('div')<{ selected: boolean }>`
  transition: all 0.3s ease-in-out;
  opacity: ${(props) => (props.selected ? 1 : 0)};
`;

const AddRelatedModal = (props: Props) => {
  const {
    showRelatedEducation,
    showRelatedExperience,
    closeModal,
    education,
    experience,
    selectEducation,
    selectExperience,
    educationIndexSelected,
    experienceIndexSelected,
    getInputYears,
    getYearsNumber,
    setYears,
    add,
  } = props;

  return (
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
                  <SvgIcon src="check" size={30} />
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
                  {experienceIndexSelected.includes(i) && (
                    <Container flex gap={32} align="center">
                      <Text fontSize={16}> How many years?</Text>
                      <Input
                        name="years"
                        value={getInputYears(i) || getYearsNumber(i, exp) || ''}
                        onChange={(e) => setYears(i, e.target.value)}
                        placeholder=""
                        type="text"
                        width="100px"
                        mb="0px"
                      />
                    </Container>
                  )}
                </div>
                <CheckIcon selected={experienceIndexSelected.includes(i)}>
                  <SvgIcon src="check" size={30} />
                </CheckIcon>
              </ListItem>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => add()}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRelatedModal;
