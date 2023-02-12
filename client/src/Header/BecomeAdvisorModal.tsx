import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import { EditProfileContext } from '../profile/profileService';
import { AuthContext } from '../Auth/ContextProvider';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { AdvisorStatus } from '../models/User';
interface Props {
  setShowBecomeAdvisorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdvisor: React.Dispatch<React.SetStateAction<AdvisorStatus | boolean>>;
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

const BecomeAdvisorModal = (props: Props) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { progress } = useContext(EditProfileContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const newSuggestions: string[] = [];
    if (!user) return;
    if (!user.picture || user.picture === '') {
      newSuggestions.push('Add a profile image (required)');
    }
    if (user.title === '') {
      newSuggestions.push('Add a title');
    }

    if (user.bio === '') {
      newSuggestions.push('Add a bio');
    }
    if (user.skills.length === 0) {
      newSuggestions.push(
        'Add skills and connect them to your experience and education'
      );
    } else {
      const skillsWithoutExperienceOrEducation = user.skills.filter(
        (skill) =>
          skill.experiences.length === 0 || skill.educations.length === 0
      );
      if (skillsWithoutExperienceOrEducation.length > 0) {
        newSuggestions.push(
          'Connect your skills to your experience and education'
        );
      }
    }
    if (user.education.length === 0) {
      newSuggestions.push('Add your education');
    }
    if (user.experience.length === 0) {
      newSuggestions.push('Add your experience');
    }

    if (user.country === '') {
      newSuggestions.push('Add your country');
    }
    if (user.languages.length === 0) {
      newSuggestions.push('Add your languages');
    }
    setSuggestions(newSuggestions);
  }, []);
  console.log(suggestions);
  return (
    <Modal
      setShowModal={props.setShowBecomeAdvisorModal}
      size="sm"
      closeButton={true}
    >
      {!user?.advisorStatus ? (
        <Container flex dir="column" align="center">
          <Container mb={36}>
            {progress < 75 ? (
              <Text
                fontSize={32}
                fontWeight="bold"
                color="primary"
                align="center"
              >
                You haven't completed your set up!
              </Text>
            ) : (
              <Text
                fontSize={32}
                fontWeight="bold"
                color="primary"
                align="center"
              >
                Thank you for your interest in becoming an advisor
              </Text>
            )}
          </Container>
          {progress < 75 ? (
            <Text fontSize={18} mb={24} align="justify">
              In order to become an advisor your have to complete at least 75%
              of the process
            </Text>
          ) : (
            <Text fontSize={18} mb={24} align="justify">
              In order to ensure that we are able to provide the best possible
              service to our clients, we carefully review all applications to
              become an advisor.
            </Text>
          )}

          {progress < 75 ? (
            <>
              <Text fontSize={24} color="primary">
                Current progress: <StyledSpan>{progress}%</StyledSpan>
              </Text>
              <SuggestionsList>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index}>{suggestion}</ListItem>
                ))}
              </SuggestionsList>
            </>
          ) : (
            <Text fontSize={18} mb={24} align="justify">
              We appreciate your patience as we review your information and make
              a decision on your application.
            </Text>
          )}
        </Container>
      ) : user?.advisorStatus === 'pending' ? (
        <Container flex dir="column" align="center">
          <Container mb={36}>
            <Text
              fontSize={32}
              fontWeight="bold"
              color="primary"
              align="center"
            >
              Your application is pending!
            </Text>
          </Container>
          <Container width="100%">
            <Text fontSize={18} mb={24} align="justify">
              Please be aware that the review process can take some time.
            </Text>

            <Text fontSize={18} mb={24} align="justify">
              We appreciate your patience and will be in touch with you as soon
              as a decision has been made regarding your application.
            </Text>

            <Text fontSize={18} mb={24} align="justify">
              In the meantime, you can continue to edit your profile and add
              more information.
            </Text>
          </Container>
        </Container>
      ) : null}

      <Container flex gap={12} mt={36}>
        <Button
          variant="outline"
          onClick={() => props.setShowBecomeAdvisorModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.setShowBecomeAdvisorModal(false);
            props.setIsAdvisor(true);
            props.setShowProfileSetup(true);
          }}
        >
          Edit profile
        </Button>
      </Container>
    </Modal>
  );
};

export default BecomeAdvisorModal;
