import { useState } from 'react';
import styled from 'styled-components';

import SvgIcon from '../shared/SvgIcon';
import { UserSkill } from '../models/User';
import { Text } from '../shared/Text';
import { Container } from '../shared/Container';
import { formatDateNamed } from '../utils/formatDate';

const StyledBadge = styled('div')`
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.primary_L2};
  color: ${(props) => props.theme.colors.primary_D2};
  cursor: pointer;
  font-weight: bold;
`;

const Arrow = styled('div')<{ expanded: boolean }>`
  transition: all 0.3s ease-in-out;
  transform: ${(props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const BadgeContent = styled('div')<{ expanded: boolean }>`
  display: ${(props) => (props.expanded ? 'block' : 'none')};
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary_L2};
  border-radius: 4px;
  margin-top: 8px;
`;

interface Props {
  skill: UserSkill;
}

const SkillBadge = ({ skill }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <StyledBadge onClick={() => setExpanded((prevState) => !prevState)}>
      <Container flex justify="space-between" align="center">
        <Text color="#92462A" fontSize={16} fontWeight={'bold'}>
          {skill.name}
        </Text>
        {skill.educations.length || skill.experiences.length ? (
          <Arrow expanded={expanded}>
            <SvgIcon src="arrow" color="#92462A" size={12} />
          </Arrow>
        ) : null}
      </Container>
      <BadgeContent expanded={expanded}>
        {skill.experiences.length > 0 && (
          <Text color="var(--primary)" fontSize={18} fontWeight={'bold'}>
            Experience
          </Text>
        )}
        {skill.experiences.map((experience) => (
          <Container key={experience.experience.name}>
            <Text color="black" fontSize={16} fontWeight={'bold'}>
              {experience.experience.company.name}
            </Text>
            <Container flex align="center" mb={12} gap={4}>
              <Text color="black" fontSize={16}>
                {formatDateNamed(experience.experience.startDate)} -{' '}
                {formatDateNamed(experience.experience.endDate)}
              </Text>
              <Text fontSize={24} fontWeight="bold">
                ·
              </Text>
              <Text color="var(--secondary)" fontSize={16}>
                {experience.years} Years
              </Text>
            </Container>
          </Container>
        ))}
        {skill.educations.length > 0 && (
          <Text color="var(--primary)" fontSize={18} fontWeight={'bold'}>
            Education
          </Text>
        )}
        {skill.educations.map((education) => (
          <Container key={education.education.name}>
            <Text color="black" fontSize={16} fontWeight={'bold'}>
              {education.education.university.name}
            </Text>
            <Container flex align="center" mb={12} gap={4}>
              <Text color="black" fontSize={16}>
                {formatDateNamed(education.education.startDate)} -{' '}
                {formatDateNamed(education.education.endDate)}
              </Text>
              <Text fontSize={24} fontWeight="bold">
                ·
              </Text>
              <Text color="var(--secondary)" fontSize={16}>
                {education.years} Years
              </Text>
            </Container>
          </Container>
        ))}
      </BadgeContent>
    </StyledBadge>
  );
};

export default SkillBadge;
