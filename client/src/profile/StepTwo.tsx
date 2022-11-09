import React from 'react';
import { UserEducation, UserExperience } from '../models/User';
import Icon from '../shared/Icon';
import { Button } from './components/Button';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import { Education, Experience } from './ProfileSetup';

interface Props {
  inputEducation: Education;
  onChangeEducation: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addEducation: () => void;
  education: UserEducation[];
  removeEducation: (index: number) => void;
  inputExperience: Experience;
  onChangeExperience: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addExperience: () => void;
  experience: UserExperience[];

    removeExperience: (index: number) => void;
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
            onChange={(e) => onChangeEducation(e)}
          />
          <Input
            type="text"
            value={inputEducation.school}
            placeholder="School"
            name="school"
            onChange={(e) => onChangeEducation(e)}
          />

          <Container flex gap={12} align="center">
            <Input
              type="number"
              value={inputEducation.startYear ? inputEducation.startYear : ''}
              placeholder="Start year"
              name="startYear"
              onChange={(e) => onChangeEducation(e)}
            />
            <Input
              type="number"
              value={inputEducation.endYear ? inputEducation.endYear : ''}
              placeholder="End year"
              name="endYear"
              onChange={(e) => onChangeEducation(e)}
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
              width="200px"
              border="1px solid #f8cbc9"
              borderRadius="8px"
              position="relative"
              px={16}
              py={16}
            >
              <Text fontSize={18} fontWeight="bold">
                {edu.fieldOfStudy}
              </Text>
              <Text fontSize={18}>{edu.school.name}</Text>
              <Text>{edu.years}</Text>
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

          <Container flex gap={12} align="center">
            <Input
              type="number"
              value={inputExperience.startYear ? inputExperience.startYear : ''}
              placeholder="Start year"
              name="startYear"
              onChange={(e) => onChangeExperience(e)}
            />
            <Input
              type="number"
              value={inputExperience.endYear ? inputExperience.endYear : ''}
              placeholder="End year"
              name="endYear"
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
                <Text>{exp.years}</Text>
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
