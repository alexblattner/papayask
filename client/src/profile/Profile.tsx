import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import ProfileSetup from './ProfileSetup';
import { UserEducation, UserExperience, UserProps } from '../models/User';
import api from '../utils/api';
import ProfilePicture from '../shared/ProfilePicture';
import SvgIcon from '../shared/SvgIcon';
import RequestSettingsModal from './RequestSettingsModal';
import { formatDateNamed } from '../utils/formatDate';
import Badge from '../shared/Badge';
import flags from '../data/flags';
import useWidth from '../Hooks/useWidth';
import EducationModal from './EducationModal';
import { Education, Experience } from './profileService';
import ExperienceModal from './ExperienceModal';
import SkillsModal from './SkillsModal';
import LanguagesModal from './LanguagesModal';
import ProfileButtons from './ProfileButtons';

const ProfileImage = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border: 1px solid #fff;
  border-radius: 16px;
  overflow: hidden;
`;

const HiddenSpan = styled('span')`
  opacity: 0;
  position: absolute;
  top: 5px;
  right: 5px;
  transition: all 0.2s ease-in-out;
`;

const ItemContainer = styled(Container)`
  cursor: pointer;
  &:hover ${HiddenSpan} {
    opacity: 1;
  }
`;

const EditPictureButton = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const InfoContainer = styled('div')<{ width?: string }>`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  width: ${({ width }) => (width ? width : '')};
`;

const Profile = () => {
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [bioEdit, setBioEdit] = React.useState<boolean>(false);
  const [showEducationModal, setShowEducationModal] =
    React.useState<boolean>(false);
  const [showQuestionModal, setShowQuestionModal] =
    React.useState<boolean>(false);
  const [profileUser, setProfileUser] = React.useState<UserProps | null>(null);
  const [editType, setEditType] = React.useState<
    'initial' | 'edit-all' | 'edit-one'
  >('edit-all');
  const [initialSetupStep, setInitialSetupStep] = React.useState<number | null>(
    null
  );
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  const [profileFlag, setProfileFlag] = React.useState<string>('');
  const [selectedEducation, setSelectedEducation] =
    React.useState<Education | null>(null);
  const [educationModalType, setEducationModalType] = React.useState<
    'Initial' | 'Edit' | 'Add'
  >('Add');
  const [showExperienceModal, setShowExperienceModal] =
    React.useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] =
    React.useState<Experience | null>(null);
  const [experienceModalType, setExperienceModalType] = React.useState<
    'Initial' | 'Edit' | 'Add'
  >('Add');
  const [showSkillsModal, setShowSkillsModal] = React.useState<boolean>(false);
  const [showLanguagesModal, setShowLanguagesModal] =
    React.useState<boolean>(false);

  const { user } = React.useContext(AuthContext);

  const { width } = useWidth();

  const openProfileSetup = () => {
    setEditType('edit-all');
    setShowProfileSetup(true);
  };

  const openProfileSetupInStep = (step: number) => {
    setEditType('edit-one');
    setInitialSetupStep(step);
    setShowProfileSetup(true);
  };

  const getProfileUser = async (id: string) => {
    const res = await api.get(`/user/${id}`);

    setProfileUser({ id: res.data._id, ...res.data });
  };

  const openEducationModal = (
    education: Education | null,
    type: 'Add' | 'Edit'
  ) => {
    setSelectedEducation(education);
    setEducationModalType(type);
    setShowEducationModal(true);
  };

  const openExperienceModal = (
    experience: Experience | null,
    type: 'Add' | 'Edit'
  ) => {
    setSelectedExperience(experience);
    setExperienceModalType(type);
    setShowExperienceModal(true);
  };

  useEffect(() => {
    if (profileUser?.country) {
      const flag = flags.find(
        (f) => f.name.toLowerCase() === profileUser.country.toLowerCase()
      );
      if (flag) {
        setProfileFlag(flag.emoji);
      }
    }
  }, [profileUser]);

  useEffect(() => {
    if (user) {
      setProfileUser(user);
    }
    // const id = window.location.pathname.split('/')[2];

    // if (id) {
    //   if (id === user?._id) {
    //     setProfileUser(user);
    //   } else {
    //     getProfileUser(id);
    //   }
    // }
  }, [window.location.pathname, user]);

  useEffect(() => {
    if (profileUser) {
      if (profileUser?._id === user?._id) {
        setIsOwner(true);
      }
    }
  }, [profileUser]);

  if (!profileUser) return null;

  return (
    <Container
      width={width > 600 ? '70%' : '85%'}
      mx={'auto'}
      overflow={showProfileSetup ? 'hidden' : 'auto'}
      position="relative"
    >
      {showSettings && (
        <RequestSettingsModal setShowRequestSettingsModal={setShowSettings} />
      )}
      {showProfileSetup && (
        <ProfileSetup
          setShowProfileSetup={setShowProfileSetup}
          type={editType}
          initialStep={initialSetupStep}
        />
      )}
      {showEducationModal && (
        <EducationModal
          setShowModal={setShowEducationModal}
          education={selectedEducation}
          type={educationModalType}
          user={profileUser}
          index={profileUser.education.indexOf(
            selectedEducation as UserEducation
          )}
        />
      )}
      {showExperienceModal && (
        <ExperienceModal
          setShowModal={setShowExperienceModal}
          experience={selectedExperience}
          type={experienceModalType}
          user={profileUser}
          index={profileUser.experience.indexOf(
            selectedExperience as UserExperience
          )}
        />
      )}
      {showSkillsModal && (
        <SkillsModal setShowModal={setShowSkillsModal} user={profileUser} />
      )}
      {showLanguagesModal && (
        <LanguagesModal
          setShowModal={setShowLanguagesModal}
          user={profileUser}
        />
      )}
      <Container position="relative" mb={48}>
        <Container
          flex
          align={width > 600 ? 'flex-end' : 'center'}
          gap={12}
          dir={width > 600 ? 'row' : 'column'}
        >
          <Container height="150px" position="relative" maxH="150px">
            <ProfileImage>
              <ProfilePicture src={profileUser?.picture} size={150} />
              <EditPictureButton onClick={() => openProfileSetupInStep(0)}>
                <SvgIcon src="pencil_fill" size={20} color="white" />
              </EditPictureButton>
            </ProfileImage>
          </Container>

          <Container
            position={width > 600 ? 'absolute' : 'relative'}
            top="0"
            right="0"
          >
            <ProfileButtons
              isOwner={isOwner}
              openProfileSetup={openProfileSetup}
              setShowQuestionModal={setShowQuestionModal}
              profileUser={profileUser}
            />
          </Container>

          <Container>
            <Container flex align="center" gap={12}>
              <Text fontSize={width > 1145 ? 46 : 40} fontWeight={700}>
                {profileUser.name}
              </Text>
              <Text fontSize={width > 1145 ? 46 : 40}>{profileFlag}</Text>
            </Container>
            <Text
              fontSize={width > 1145 ? 24 : 22}
              fontWeight={700}
              align={width < 600 ? 'center' : 'left'}
            >
              {profileUser.title}
            </Text>
          </Container>
        </Container>
      </Container>
      <InfoContainer>
        <Container flex align="center" gap={16} mb={12}>
          <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
            Bio:
          </Text>
          {isOwner && (
            <Container onClick={() => openProfileSetupInStep(0)}>
              <SvgIcon src="pencil_fill" size={16} color="black" />
            </Container>
          )}
          {/* bioEdit && (
          <Container flex gap={8}>
            <textarea />
            <Button variant="outline" onClick={() => {}}>
              Save
            </Button>
            <Button variant="outline" onClick={() => {}}>
              Cancel
            </Button>
          </Container>
          ) */}
        </Container>
        <Text fontSize={width > 1145 ? 18 : 16} mb={12} align="justify">
          {profileUser.bio}
        </Text>
      </InfoContainer>
      <Container flex flexWrap gap={16}>
        <InfoContainer width={width > 1144 ? '49%' : '100%'}>
          <Container
            flex
            align="center"
            justify="space-between"
            gap={16}
            mb={12}
          >
            <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
              Experience:
            </Text>
            {isOwner && (
              <Container
                onClick={() => {
                  openExperienceModal(null, 'Add');
                }}
              >
                <SvgIcon src="plus" size={16} color="black" />
              </Container>
            )}
          </Container>
          {profileUser.experience.map((exp, i) => (
            <ItemContainer
              flex
              align="center"
              mb={12}
              key={i}
              position="relative"
            >
              {isOwner && (
                <HiddenSpan
                  onClick={() => {
                    openExperienceModal(exp as Experience, 'Edit');
                  }}
                >
                  <SvgIcon src="pencil_fill" size={16} color="black" />
                </HiddenSpan>
              )}
              <Container flex align="center" justify="center" width="100px">
                <SvgIcon src="work" size={50} />
              </Container>
              <Container key={i} flex dir="column" justify="space-between">
                <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
                  {exp.name}
                </Text>
                <Text fontSize={width > 1145 ? 18 : 16}>
                  {exp.company.name}
                </Text>
                <Text fontSize={width > 1145 ? 16 : 14}>
                  {formatDateNamed(exp.startDate)} -{' '}
                  {formatDateNamed(exp.endDate)}
                </Text>
              </Container>
            </ItemContainer>
          ))}
        </InfoContainer>
        <InfoContainer width={width > 1144 ? '49%' : '100%'}>
          <Container
            flex
            align="center"
            justify="space-between"
            gap={16}
            mb={12}
          >
            <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
              Education:
            </Text>
            {isOwner && (
              <Container onClick={() => openEducationModal(null, 'Add')}>
                <SvgIcon src="plus" size={16} color="black" />
              </Container>
            )}
          </Container>
          {profileUser.education.map((edu, i) => (
            <ItemContainer
              flex
              align="center"
              mb={12}
              key={i}
              position="relative"
            >
              {isOwner && (
                <HiddenSpan
                  onClick={() => openEducationModal(edu as Education, 'Edit')}
                >
                  <SvgIcon src="pencil_fill" size={16} color="black" />
                </HiddenSpan>
              )}
              <Container flex align="center" justify="center" width="100px">
                <SvgIcon src="study" size={50} />
              </Container>
              <Container flex dir="column" justify="space-between" key={i}>
                <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
                  {edu.name}
                </Text>
                <Text fontSize={width > 1145 ? 18 : 16}>
                  {edu.university.name}
                </Text>
                <Text fontSize={width > 1145 ? 16 : 14}>
                  {formatDateNamed(edu.startDate)} -{' '}
                  {formatDateNamed(edu.endDate)}
                </Text>
              </Container>
            </ItemContainer>
          ))}
        </InfoContainer>
      </Container>
      <InfoContainer width="100%">
        <Container flex align="center" justify="space-between" gap={16} mb={12}>
          <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
            Skills:
          </Text>
          {isOwner && (
            <Container
              onClick={() => {
                setShowSkillsModal(true);
              }}
            >
              <SvgIcon src="pencil_fill" size={16} color="black" />
            </Container>
          )}
        </Container>
        <Container flex flexWrap gap={16}>
          {profileUser.skills.map((skill, i) => (
            <Badge key={i} text={skill.name}></Badge>
          ))}
        </Container>
      </InfoContainer>
      <InfoContainer width="100%">
        <Container flex align="center" justify="space-between" gap={16} mb={12}>
          <Text fontSize={width > 1145 ? 18 : 16} fontWeight="bold">
            Languages:
          </Text>
          {isOwner && (
            <Container onClick={() => setShowLanguagesModal(true)}>
              <SvgIcon src="pencil_fill" size={16} color="black" />{' '}
            </Container>
          )}
        </Container>
        <Container flex flexWrap gap={16}>
          {profileUser.languages.map((language, i) => (
            <Badge key={i} text={language}></Badge>
          ))}
        </Container>
      </InfoContainer>
    </Container>
  );
};

export default Profile;
