import React, { useEffect } from 'react';
import styled from 'styled-components';
import { School, UserEducation, UserExperience } from '../models/User';
import CountriesSelect from '../shared/CountriesSelect';
import Icon from '../shared/Icon';
import api from '../utils/api';
import { Button } from './components/Button';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import { Education, Experience } from './ProfileSetup';

const Suggestions = styled('div')<{ show: boolean }>`
  position: absolute;
  top: 35px;
  left: 0;
  max-height: 240px;
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  background-color: #fff;
  width: 300px;
  z-index: 999;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: scroll;
`;

const Suggestion = styled('div')`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary20};
  }
`;

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

  const [universities, setUniversities] = React.useState<School[]>([]);
  const [focused, setFocused] = React.useState<boolean>(false);

  useEffect(() => {
    if (inputEducation.school.name !== '' && focused) {
      api.get(`/university/${inputEducation.school.name}`).then((res) => {
        console.log(res.data);

        setUniversities(res.data);
      });
    } else {
      setUniversities([]);
    }
  }, [inputEducation, focused]);

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
          <Container position="relative">
            <Input
              type="text"
              value={inputEducation.school.name}
              placeholder="School"
              name="school-name"
              onChange={(e) => onChangeEducation('school-name', e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            <Suggestions show={universities.length > 0}>
              {universities.map((university, index) => (
                <Suggestion
                  key={index}
                  onClick={() => {                    
                    onChangeEducation('school-name', university);
                    setUniversities([]);
                  }}
                >
                  <Text fontSize={14} fontWeight={'bold'}>
                    {university.name}
                  </Text>
                  <Text fontSize={13}>{university.country}</Text>
                </Suggestion>
              ))}
            </Suggestions>
          </Container>

          <CountriesSelect value={inputEducation.school.country} onChange= {onChangeEducation} inputName = "school-country"/>

          <Container flex gap={12} align="center">
            <Input
              type="number"
              value={inputEducation.startYear ? inputEducation.startYear : ''}
              placeholder="Start year"
              name="startYear"
              onChange={(e) => onChangeEducation('startYear', e.target.value)}
            />
            <Input
              type="number"
              value={inputEducation.endYear ? inputEducation.endYear : ''}
              placeholder="End year"
              name="endYear"
              onChange={(e) => onChangeEducation('endYear', e.target.value)}
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
