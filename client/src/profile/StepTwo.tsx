import React from 'react';

import { School, UserEducation, UserExperience } from '../models/User';
import CountriesSelect from '../shared/CountriesSelect';
import Icon from '../shared/Icon';
import UniversitiesSelect from '../shared/UniversitiesSelect';
import { Button } from './components/Button';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import { Education, Experience } from './ProfileSetup';

interface Props {
  inputEducation: Education;
  onChangeEducation: (name: string, value: string | School) => void;
  addEducation: () => void;
  education: UserEducation[];
  removeEducation: (index: number) => void;
  inputExperience: Experience;
  onChangeExperience: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  } = props;


  return (
    <Container flex justify="space-between" height="100%">
      <Container width="50%">
        <Text fontSize={32} fontWeight={600} mb={16}>
          Education
        </Text>
        <Container flex dir="column">
          <Input
            type="text"
            value={inputEducation.fieldOfStudy}
            placeholder="field of study"
            name="fieldOfStudy"
            onChange={(e) => onChangeEducation('fieldOfStudy', e.target.value)}
          />

          <UniversitiesSelect
            value={inputEducation.school.name}
            onChange={onChangeEducation}
          />

          <CountriesSelect
            value={inputEducation.school.country}
            onChange={onChangeCountry}
            inputName="school-country"
          />

          <Container flex gap={12} align="center">
            <Input
              type="date"
              value={
                inputEducation.startDate
                  ? inputEducation.startDate.toString()
                  : new Date().toString()
              }
              placeholder="Start year"
              name="startDate"
              onChange={(e) => onChangeEducation('startDate', e.target.value)}
            />
            <Input
              type="date"
              value={
                inputEducation.endDate
                  ? inputEducation.endDate.toString()
                  : new Date().toString()
              }
              placeholder="End year"
              name="endDate"
              onChange={(e) => onChangeEducation('endDate', e.target.value)}
            />
          </Container>
          <Button width={300} variant="primary" onClick={addEducation}>
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
                {edu.fieldOfStudy}
              </Text>
              <Text fontSize={16}>{edu.school.name}</Text>
              <Text>
                {edu.startDate.toString()} -{' '}
                {edu.endDate?.toString() ?? 'Present'}
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
            value={inputExperience.position}
            placeholder="Position"
            name="position"
            onChange={(e) => onChangeExperience(e)}
          />
          <Input
            type="text"
            value={inputExperience.company}
            placeholder="Company"
            name="company"
            onChange={(e) => onChangeExperience(e)}
          />
          <Input
            type="text"
            value={inputExperience.type}
            placeholder="Experience type"
            name="type"
            onChange={(e) => onChangeExperience(e)}
          />

          <Container flex gap={12} align="center">
            <Input
              type="date"
              value={
                inputExperience.startDate
                  ? inputExperience.startDate.toString()
                  : new Date().toString()
              }
              placeholder="Start year"
              name="startDate"
              onChange={(e) => onChangeExperience(e)}
            />
            <Input
              type="date"
              value={
                inputExperience.endDate
                  ? inputExperience.endDate.toString()
                  : new Date().toString()
              }
              placeholder="End year"
              name="endDate"
              onChange={(e) => onChangeExperience(e)}
            />
          </Container>
          <Button variant="primary" width={300} onClick={addExperience}>
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
                  {exp.position}
                </Text>
                <Text fontSize={18}>{exp.company.name}</Text>
                <Text>
                  {exp.startDate.toString()} -{' '}
                  {exp.endDate?.toString() ?? 'Present'}
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
