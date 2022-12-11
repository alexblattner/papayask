import React, { useEffect } from 'react';
import styled from 'styled-components';

import {
  RelatedEducation,
  RelatedExperience,
  UserEducation,
  UserExperience,
  UserSkill,
} from '../models/User';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import SvgIcon from '../shared/SvgIcon';
import useWidth from '../Hooks/useWidth';
import AddRelatedModal from './AddRelatedModal';

interface Props {
  skill: UserSkill;
  index: number;
  education: UserEducation[];
  experience: UserExperience[];
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  removeSkill: (index: number) => void;
}

const InfoContainer = styled('div')`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
`;

const SkillBlock = (props: Props) => {
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
  const [yearsInputs, setYearsInput] = React.useState<
    { index: number; years: number }[]
  >([]);

  const { width } = useWidth();

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
      newYears.splice(index, 1);
      setYearsInput(newYears);
    } else {
      setexperienceIndexSelected([...experienceIndexSelected, index]);
    }
  };

  const selectEducation = (index: number) => {
    if (educationIndexSelected.includes(index)) {
      setEducationIndexSelected(
        educationIndexSelected.filter((i) => i !== index)
      );
    } else {
      setEducationIndexSelected([...educationIndexSelected, index]);
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
    getSelectedIndexes();
  };

  const getYearsNumber = (index: number, field: UserExperience): number => {
    const years = yearsInputs.find((i) => i.index === index)?.years;
    if (!years) {
      return 0;
    }
    return years > numberOfYears(field) ? numberOfYears(field) : years;
  };

  const getInputYears = (index: number) => {
    const years = yearsInputs.find((i) => i.index === index)?.years;
    return years || 0;
  };

  const add = () => {
    if (showRelatedEducation) {
      let newRelatedEducation: RelatedEducation[] = [];
      educationIndexSelected.forEach((index) => {
        const years = numberOfYears(props.education[index]);
        const related = {
          education: props.education[index],
          years: years,
        };
        newRelatedEducation.push(related);
      });

      const updatedSkill = {
        ...props.skill,
        educations: [...newRelatedEducation],
      };

      const newSkills = props.skills.map((s) => {
        if (s.name === updatedSkill.name) {
          return updatedSkill;
        }
        return s;
      });

      props.setSkills(newSkills);
      setShowRelatedEducation(false);
    } else {
      let newRelatedExperience: RelatedExperience[] = [];
      experienceIndexSelected.forEach((index) => {
        const years = getYearsNumber(index, props.experience[index]);
        const related = {
          experience: props.experience[index],
          years: years,
        };
        newRelatedExperience.push(related);
      });
      const updatedSkill = {
        ...props.skill,
        experiences: [...newRelatedExperience],
      };

      const newSkills = props.skills.map((s) => {
        if (s.name === updatedSkill.name) {
          return updatedSkill;
        }
        return s;
      });

      props.setSkills(newSkills);
      setShowRelatedExperience(false);
    }
  };

  const setYears = (index: number, value: string) => {
    const years = parseInt(value);
    if (years) {
      const newYears = [...yearsInputs];
      const indexFound = newYears.findIndex((i) => i.index === index);
      if (indexFound !== -1) {
        newYears[indexFound].years = years;
      } else {
        newYears.push({ index: index, years: years });
      }
      setYearsInput(newYears);
    } else {
      const newYears = [...yearsInputs];
      const indexFound = newYears.findIndex((i) => i.index === index);
      if (indexFound !== -1) {
        newYears[indexFound].years = 0;
      } else {
        newYears.push({ index: index, years: 0 });
      }

      setYearsInput(newYears);
    }
  };

  const getSelectedIndexes = () => {
    const educationIndexes: number[] = [];
    props.education.forEach((e) => {
      props.skill.educations.forEach((s) => {
        if (
          e.name === s.education.name &&
          e.university.name === s.education.university.name
        ) {
          educationIndexes.push(props.education.indexOf(e));
        }
      });
    });
    setEducationIndexSelected(educationIndexes);
    const experienceIndexes: number[] = [];
    props.experience.forEach((e) => {
      props.skill.experiences.forEach((s) => {
        if (
          e.name === s.experience.name &&
          e.company.name === s.experience.company.name
        ) {
          experienceIndexes.push(props.experience.indexOf(e));
        }
      });
    });
    setexperienceIndexSelected(experienceIndexes);
  };

  useEffect(() => {
    const years = props.experience.map((exp, i) => ({
      index: i,
      years:
        props.skill.experiences.find(
          (s) =>
            s.experience.name === exp.name &&
            s.experience.company.name === exp.company.name
        )?.years || 0,
    }));
    setYearsInput(years);
  }, [props.experience, props.skill]);

  useEffect(() => {
    setRelatedEducation(props.skill.educations);
    setRelatedExperience(props.skill.experiences);
    getSelectedIndexes();
  }, [props.skill]);
  return (
    <Container>
      {
        <AddRelatedModal
          showRelatedEducation={showRelatedEducation}
          showRelatedExperience={showRelatedExperience}
          closeModal={closeModal}
          educationIndexSelected={educationIndexSelected}
          experienceIndexSelected={experienceIndexSelected}
          add={add}
          education={props.education}
          experience={props.experience}
          selectExperience={selectExperience}
          selectEducation={selectEducation}
          getInputYears={getInputYears}
          setYears={setYears}
          getYearsNumber={getYearsNumber}
        />
      }
      <Container
        flex
        align="center"
        gap={12}
        borderBottom="1px solid var(--primary-l1)"
      >
        <Text fontSize={24} fontWeight={600}>
          {props.skill.name}
        </Text>
        <Container
          ml={'auto'}
          onClick={() => {
            props.removeSkill(props.index);
          }}
        >
          <SvgIcon src="delete" color="primary" />
        </Container>
      </Container>
      <InfoContainer>
        <Container flex align="center" justify="space-between" mb={16}>
          <Text fontSize={16} fontWeight={600}>
            Related Education:
          </Text>

          <Container>
            <Container onClick={() => setShowRelatedEducation(true)}>
              {' '}
              <SvgIcon src="pencil_fill" color="primary" size={16} />
            </Container>
          </Container>
        </Container>
        {relatedEducation.map((edu, i) => (
          <Container
            key={i}
            flex
            align={width > 600 ? 'center' : 'flex-start'}
            gap={width > 600 ? 6 : 0}
            dir={width > 600 ? 'row' : 'column'}
          >
            <Text fontSize={16}>{edu.education.university.name}</Text>
            {width > 600 && (
              <Text fontSize={24} fontWeight="bold">
                ·
              </Text>
            )}
            <Text color="#888">{edu.education.name}</Text>
          </Container>
        ))}
      </InfoContainer>
      <InfoContainer>
        <Container flex align="center" justify="space-between" mb={16}>
          <Text fontSize={16} fontWeight={600}>
            Related Experience:
          </Text>

          <Container>
            <Container onClick={() => setShowRelatedExperience(true)}>
              {' '}
              <SvgIcon src="pencil_fill" color="primary" size={16} />
            </Container>
          </Container>
        </Container>
        {relatedExperience.map((exp, i) => (
          <Container
            key={i}
            flex
            align={width > 600 ? 'center' : 'flex-start'}
            dir={width > 600 ? 'row' : 'column'}
            gap={width > 600 ? 6 : 0}
          >
            <Text fontSize={16}>{exp.experience.company.name}</Text>
            {width > 600 && (
              <Text fontSize={24} fontWeight="bold">
                ·
              </Text>
            )}
            <Text color="#888">{exp.years} Years</Text>
          </Container>
        ))}
      </InfoContainer>
    </Container>
  );
};

export default SkillBlock;
