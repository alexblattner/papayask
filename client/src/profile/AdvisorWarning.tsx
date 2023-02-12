import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import { EditProfileContext } from './profileService';

interface Props {
  setAdvisorWarning: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledSpan = styled.span`
  font-weight: bold;
`;

const SuggestionsList = styled.ul`
  width: 100%;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  text-align: start;

  ::marker {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const AdvisorWarning = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const {
    progress,
    submit,
    title,
    image,
    bio,
    skills,
    education,
    experience,
    country,
    languages,
  } = useContext(EditProfileContext);

  const saveProgress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await submit();
    setIsLoading(false);
    props.setAdvisorWarning(false);
    props.setShowProfileSetup(false);
  };

  useEffect(() => {
    const newSuggestions: string[] = [];
    if (!image || image === '') {
      newSuggestions.push('Add a profile image (required)');
    }
    if (title === '') {
      newSuggestions.push('Add a title');
    }
    if (bio === '') {
      newSuggestions.push('Add a bio');
    }
    if (skills.length === 0) {
      newSuggestions.push(
        'Add skills and connect them to your experience and education'
      );
    } else {
      const skillsWithoutExperienceOrEducation = skills.filter(
        (skill) =>
          skill.experiences.length === 0 || skill.educations.length === 0
      );
      if (skillsWithoutExperienceOrEducation.length > 0) {
        newSuggestions.push(
          'Connect your skills to your experience and education'
        );
      }
    }
    if (education.length === 0) {
      newSuggestions.push('Add your education');
    }
    if (experience.length === 0) {
      newSuggestions.push('Add your experience');
    }

    if (country === '') {
      newSuggestions.push('Add your country');
    }
    if (languages.length === 0) {
      newSuggestions.push('Add your languages');
    }
    setSuggestions(newSuggestions);
  }, []);

  return (
    <Modal setShowModal={props.setAdvisorWarning} size="sm" closeButton={true}>
      <Container flex dir="column" align="center">
        <Container mb={36}>
          <Text fontSize={32} fontWeight="bold" color="primary" align="center">
            You haven't completed your set up!
          </Text>
        </Container>

        <Text fontSize={18} mb={24} align="justify">
          In order to become an advisor your have to complete at least 75% of
          the process
        </Text>

        <Text fontSize={24} color="primary">
          Current progress: <StyledSpan>{progress}%</StyledSpan>
        </Text>

        <Container width="100%" mt={16}>
          <Text fontSize={16} mb={12} fontWeight="bold">
            To complete your profile, you can
          </Text>
        </Container>
        <SuggestionsList>
          {suggestions.map((suggestion, index) => (
            <ListItem key={index}>{suggestion}</ListItem>
          ))}
        </SuggestionsList>
      </Container>

      <Container flex gap={12} mt={36}>
        <Button
          variant="outline"
          onClick={() => {
            props.setAdvisorWarning(false);
            props.setShowProfileSetup(false);
          }}
        >
          Keep editing
        </Button>
        <Button variant="primary" onClick={saveProgress} disabled={isLoading}>
          Save progress
        </Button>
      </Container>
    </Modal>
  );
};

export default AdvisorWarning;
