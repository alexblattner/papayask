import { UserSkill } from '../models/User';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import SvgIcon from '../shared/SvgIcon';
import { formatDateNamed } from '../utils/formatDate';

interface Props {
  skill: UserSkill;
  index: number;
  removeSkill: (index: number) => void;
  currentSkill: UserSkill;
  setCurrentSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  setMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>;
}

export const DetailedSkill = ({
  skill,
  removeSkill,
  index,
  setCurrentSkill,
  setMode,
  currentSkill,
}: Props) => {
  return (
    <Container
    border={currentSkill._id === skill._id ? '2px solid var(--primary)' : 'none'}
      background="var(--primary-l2)"
      borderRadius="8px"
      px={16}
      py={16}
    >
      <Container flex align="center" gap={12} mb={12}>
        <Text fontSize={24} fontWeight={'bold'} color="var(--primary-d2)">
          {skill.name}
        </Text>
        <Container
          onClick={() => {
            setCurrentSkill(skill);
            setMode('edit');
          }}
          ml="auto"
        >
          <SvgIcon src="pencil_fill" color="var(--primary)" />
        </Container>
        <Container onClick={() => removeSkill(index)}>
          <SvgIcon src="delete" color="var(--primary)" />
        </Container>
      </Container>
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
    </Container>
  );
};
