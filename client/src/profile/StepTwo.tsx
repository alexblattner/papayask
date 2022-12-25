import formatDate from '../utils/formatDate';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import useWidth from '../Hooks/useWidth';
import SvgIcon from '../shared/SvgIcon';
import { useEditProfile } from './profileService';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import CompanyLogo from '../shared/CompanyLogo';
import UniversityLogo from '../shared/UniversityLogo';

const StepTwo = () => {
  const {
    education,
    addEducation,
    onChangeEducation,
    addExperience,
    removeEducation,
    experience,
    removeExperience,
    inputEducation,
    onChangeCountry,
    onChangeExperience,
    onChangeExperienceCompany,
    inputExperience,
    onChangeExperienceCountry,
  } = useEditProfile();

  const { width } = useWidth();

  return (
    <Container flex justify="space-between" height="100%" flexWrap gap={12}>
      <Container width={width > 750 ? '45%' : '90%'} mx="auto">
        <EducationForm
          onAddEducation={addEducation}
          onChangeEducation={onChangeEducation}
          inputEducation={inputEducation}
          onChangeCountry={onChangeCountry}
          type="Initial"
        />
        <Container my={20}>
          {education.map((edu, i) => (
            <Container
              key={i}
              width="100%"
              border="2px solid var(--secondary-l1)"
              background="var(--secondary-l2)"
              position="relative"
              borderRadius="8px"
              px={16}
              py={16}
              mb={16}
              flex
              align="center"
              gap={8}
            >
              <UniversityLogo logo={edu.university.logo} />
              <Container>
                <Text fontSize={18} fontWeight="bold">
                  {edu.name}
                </Text>
                <Text fontSize={16}>{edu.university.name}</Text>
                <Text fontSize={14}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Text>
              </Container>
              <Container
                position="absolute"
                top={'10px'}
                right={'15px'}
                onClick={() => removeEducation(i)}
              >
                <SvgIcon src="close" size={20} />
              </Container>
            </Container>
          ))}
        </Container>
      </Container>
      <Container width={width > 750 ? '45%' : '90%'} mx="auto">
        <ExperienceForm
          onAddExperience={() => addExperience(inputExperience)}
          onChangeExperience={onChangeExperience}
          inputExperience={inputExperience}
          onChangeExperienceCountry={onChangeExperienceCountry}
          onChangeExperienceCompany={onChangeExperienceCompany}
          type="Initial"
        />
        <Container flex dir="column">
          <Container my={20}>
            {experience.map((exp, i) => (
              <Container
                key={i}
                width="100%"
                border="2px solid var(--secondary-l1)"
                background="var(--secondary-l2)"
                borderRadius="8px"
                position="relative"
                px={16}
                py={16}
                mb={16}
                flex
                align="center"
                gap={8}
              >
                <CompanyLogo logo={exp.company.logo} />
                <Container>
                  <Text fontSize={20} fontWeight="bold">
                    {exp.company.name}
                  </Text>
                  <Text fontSize={18}>{exp.name}</Text>
                  <Text fontSize={16}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </Container>
                <Container
                  onClick={() => removeExperience(i)}
                  position="absolute"
                  top={'10px'}
                  right={'15px'}
                >
                  <SvgIcon src="close" size={20} />
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
