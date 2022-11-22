import React from 'react';

import { University, UserEducation, UserExperience } from '../models/User';
import CountriesSelect from '../shared/CountriesSelect';
import { DateInput } from '../shared/DateInput';
import Icon from '../shared/Icon';
import UniversitiesSelect from '../shared/UniversitiesSelect';
import formatDate from '../utils/formatDate';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { Education, Experience } from './ProfileSetup';

interface Props {
  inputEducation: Education;
  onChangeEducation: (name: string, value: string | University) => void;
  onChangeExperienceCountry: (country: string) => void;
  addEducation: () => void;
  education: UserEducation[];
  removeEducation: (index: number) => void;
  inputExperience: Experience;
  onChangeExperience: (
    name: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  addExperience: () => void;
  experience: UserExperience[];
  removeExperience: (index: number) => void;
  onChangeCountry: (country: string) => void;
}

const StepTwo = (props: Props) => {
  const {
    inputEducation,
    onChangeEducation,
    addEducation,
    education,
    removeEducation,
    inputExperience,
    onChangeExperience,
    addExperience,
    experience,
    removeExperience,
    onChangeCountry,
    onChangeExperienceCountry,
  } = props;

  const addEducationDisabled = () => {
    return (
      !inputEducation.startDate ||
      !inputEducation.name ||
      !inputEducation.level ||
      !inputEducation.university.name ||
      !inputEducation.university.country
    );
  };

  const addExperienceDisabled = () => {
    return (
      !inputExperience.startDate ||
      !inputExperience.company.name ||
      !inputExperience.name ||
      !inputExperience.type ||
      !inputExperience.geographic_specialization
    );
  };

  return (
    <Container flex justify="space-between" height="100%">
      <Container width="50%">
        <Text fontSize={32} fontWeight={600} mb={16}>
          Education
        </Text>
        <Container flex dir="column">
          <Container flex gap={8}>
            <Input
              type="text"
              value={inputEducation.name}
              placeholder="field of study"
              name="name"
              width="282px"
              onChange={(e) => onChangeEducation('name', e.target.value)}
            />
            <Input
              type="text"
              placeholder="Level"
              name="level"
              width="110px"
              value={inputEducation.level}
              onChange={(e) => onChangeEducation('level', e.target.value)}
            />
          </Container>

          <UniversitiesSelect
            value={inputEducation.university.name}
            onChange={onChangeEducation}
          />

          <CountriesSelect
            value={inputEducation.university.country}
            onChange={onChangeCountry}
            inputName="university-country"
          />

          <Container flex gap={12} align="center">
            <DateInput
              value={inputEducation.startDate}
              onChange={(e) => onChangeEducation('startDate', e.target.value)}
              name="startDate"
              placeholder="Start Date"
              inputEducation={inputEducation}
            />
            <DateInput
              value={inputEducation.endDate}
              onChange={(e) => onChangeEducation('endDate', e.target.value)}
              name="endDate"
              placeholder="End Date"
              inputEducation={inputEducation}
            />
          </Container>
          <Button
            width={400}
            variant="primary"
            onClick={addEducation}
            disabled={addEducationDisabled()}
          >
            Add
          </Button>
        </Container>
        <Container flex flexWrap gap={20} my={20}>
          {education.map((edu, i) => (
            <Container
              key={i}
              width="220px"
              border="1px solid #f8cbc9"
              borderRadius="8px"
              position="relative"
              px={16}
              py={16}
            >
              <Text fontSize={18} fontWeight="bold">
                {edu.name}
              </Text>
              <Text fontSize={16}>{edu.university.name}</Text>
              <Text>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Text>
              <Container
                position="absolute"
                top={10}
                right={15}
                onClick={() => removeEducation(i)}
              >
                <Icon src="close" width={20} height={20} />
              </Container>
            </Container>
          ))}
        </Container>
      </Container>
      <Container width="50%" pl={100} borderLeft="1px solid #f8cbc9">
        <Text fontSize={32} fontWeight={600} mb={16}>
          Experience
        </Text>
        <Container flex dir="column">
          <Input
            type="text"
            value={inputExperience.name}
            placeholder="Position"
            name="name"
            onChange={(e) => onChangeExperience('name', e)}
          />
          <Input
            type="text"
            value={inputExperience.company.name}
            placeholder="Company"
            name="company"
            onChange={(e) => onChangeExperience('company', e)}
          />
          <Container flex gap={12} align="center">
            <Input
              type="text"
              value={inputExperience.type}
              placeholder="Experience type"
              name="type"
              width="200px"
              onChange={(e) => onChangeExperience('type', e)}
            />
            <CountriesSelect
              value={inputExperience.geographic_specialization}
              onChange={onChangeExperienceCountry}
              inputName="geographic_specialization"
              size="small"
            />
          </Container>
          <Container flex gap={12} align="center">
            <DateInput
              value={inputExperience.startDate}
              onChange={(e) => onChangeExperience('startDate', e)}
              name="startDate"
              placeholder="Start Date"
              inputExperience={inputExperience}
            />
            <DateInput
              value={inputExperience.endDate}
              onChange={(e) => onChangeExperience('endDate', e)}
              name="endDate"
              placeholder="End Date"
              inputExperience={inputExperience}
            />
          </Container>
          <Button
            variant="primary"
            width={400}
            onClick={addExperience}
            disabled={addExperienceDisabled()}
          >
            Add
          </Button>
          <Container flex flexWrap gap={20} my={20}>
            {experience.map((exp, i) => (
              <Container
                key={i}
                width="200px"
                border="1px solid #f8cbc9"
                borderRadius="8px"
                position="relative"
                px={16}
                py={16}
              >
                <Text fontSize={18} fontWeight="bold">
                  {exp.name}
                </Text>
                <Text fontSize={18}>{exp.company.name}</Text>
                <Text>
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </Text>
                <Container
                  onClick={() => removeExperience(i)}
                  position="absolute"
                  top={10}
                  right={15}
                >
                  <Icon src="close" width={20} height={20} />
                </Container>
              </Container>
            ))}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default StepTwo;
