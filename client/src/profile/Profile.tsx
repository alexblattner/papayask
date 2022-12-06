import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import ProfileSetup from './ProfileSetup';
import Creator from '../Question/Creator';
import { UserProps } from '../models/User';
import api from '../utils/api';
import ProfilePicture from '../shared/ProfilePicture';
import SvgIcon from '../shared/SvgIcon';
import RequestSettingsModal from './RequestSettingsModal';
import { formatDateNamed } from '../utils/formatDate';
import Badge from '../shared/Badge';
import flags from '../data/flags';
import useWidth from '../Hooks/useWidth';

const ProfileImage = styled.div`
  position: absolute;
  top: 150px;
  left: 0;
  width: 250px;
  height: 250px;
  border: 1px solid #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const EditPictureButton = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary_L2};
  border-radius: 6px;
`;

const Profile = () => {
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
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
    const id = window.location.pathname.split('/')[2];

    if (id) {
      if (id === user?._id) {
        setProfileUser(user);
      } else {
        getProfileUser(id);
      }
    }
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
      width="70%"
      mx={'auto'}
      overflow={showProfileSetup ? 'hidden' : 'scroll'}
      position="relative"
    >
      {showSettings && (
        <RequestSettingsModal setShowRequestSettingsModal={setShowSettings} />
      )}
      {showQuestionModal && (
        <Creator
          setShowQuestionModal={setShowQuestionModal}
          user={profileUser}
        />
      )}
      {showProfileSetup && (
        <ProfileSetup
          setShowProfileSetup={setShowProfileSetup}
          type={editType}
          initialStep={initialSetupStep}
        />
      )}
      <Container width="100%" height="300px" position="relative" maxH="300px">
        <ProfileImage>
          <ProfilePicture src={profileUser?.picture} size={250} />
          <EditPictureButton onClick={() => openProfileSetupInStep(0)}>
            <SvgIcon src="pencil_fill" size={20} color="#dc693f" />
          </EditPictureButton>
        </ProfileImage>
      </Container>

      <Container mt={115}>
        <Container
          flex
          align="center"
          justify="space-between"
          gap={12}
          flexWrap
        >
          <Container flex align="center" gap={12}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <SvgIcon src="star_fill" size={30} key={i} color="#DC693F" />
              ))}
            <Text color="primary">(12)</Text>
          </Container>
          <Container>
            {isOwner ? (
              <Container flex gap={12}>
                {profileUser.verified ? (
                  <Button
                    variant="primary"
                    onClick={() => setShowSettings(true)}
                  >
                    <Container flex align="center" gap={8}>
                      <SvgIcon src="settings" size={25} /> Settings
                    </Container>
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => {}}>
                    <Container flex align="center" gap={8}>
                      Verify my account
                    </Container>
                  </Button>
                )}
                <Button variant="primary" onClick={openProfileSetup}>
                  <Container flex align="center" gap={8}>
                    <SvgIcon src="pencil_fill" size={20} color="white" /> EDIT
                  </Container>
                </Button>
              </Container>
            ) : (
              <Container flex align="center" gap={12}>
                {profileUser.verified && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowQuestionModal(true);
                    }}
                  >
                    <SvgIcon src="send" size={25} />
                  </Button>
                )}
                <Button variant="secondary" onClick={() => {}}>
                  <SvgIcon src="share" size={25} />
                </Button>
                <Button variant="secondary" onClick={() => {}}>
                  <SvgIcon src="heart" size={25} />
                </Button>
              </Container>
            )}
          </Container>
        </Container>
        <Container flex align="center" gap={12} mt={12}>
          <Text fontSize={46} fontWeight={700}>
            {profileUser.name}
          </Text>
          <Text fontSize={46}>{profileFlag}</Text>
        </Container>
        <Text fontSize={24} fontWeight={500}>
          {profileUser.title}
        </Text>
        <Container flex flexWrap justify="space-between" mt={24} gap={36}>
          <Container
            width={width > 750 ? '45%' : '100%'}
            flex
            dir="column"
            gap={12}
          >
            <Container
              flex
              align="center"
              gap={16}
              onClick={() => openProfileSetupInStep(0)}
            >
              {' '}
              {isOwner && <SvgIcon src="pencil_fill" size={25} />}
              {'  '}
              <Text fontSize={32} fontWeight={600}>
                {' '}
                Bio:
              </Text>
            </Container>
            <Text fontSize={18} mb={12} align="justify">
              {profileUser.bio}
            </Text>

            <Container
              flex
              align="center"
              gap={16}
              onClick={() => openProfileSetupInStep(2)}
            >
              {' '}
              {isOwner && <SvgIcon src="pencil_fill" size={25} />}
              {'  '}
              <Text fontSize={32} fontWeight={600}>
                Skills
              </Text>
            </Container>
            <Container width="100%" flex flexWrap gap={16}>
              {profileUser.skills.map((skill, i) => (
                <Badge key={i} text={skill.name}></Badge>
              ))}
            </Container>
            <Container
              flex
              align="center"
              gap={16}
              onClick={() => openProfileSetupInStep(3)}
            >
              {' '}
              {isOwner && <SvgIcon src="pencil_fill" size={25} />}
              {'  '}
              <Text fontSize={32} fontWeight={600}>
                Languages
              </Text>
            </Container>
            <Container width="100%" flex flexWrap gap={16}>
              {profileUser.languages.map((language, i) => (
                <Badge key={i} text={language}></Badge>
              ))}
            </Container>
          </Container>
          <Container
            flex
            dir="column"
            gap={24}
            width={width > 750 ? '45%' : '100%'}
          >
            {profileUser.experience?.length > 0 && (
              <div>
                <Container
                  flex
                  align="center"
                  gap={16}
                  mb={16}
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <SvgIcon src="pencil_fill" size={25} />}{' '}
                  <Text fontSize={32} fontWeight={600}>
                    Experience
                  </Text>
                </Container>
                {profileUser.experience.map((exp, i) => (
                  <Container flex align="center" mb={12} key={i}>
                    <Container
                      flex
                      align="center"
                      justify="center"
                      width="100px"
                    >
                      <SvgIcon src="work" size={50} />
                    </Container>
                    <Container
                      key={i}
                      flex
                      dir="column"
                      justify="space-between"
                    >
                      <Text fontSize={18} fontWeight="bold">
                        {exp.name}
                      </Text>
                      <Text fontSize={18}>{exp.company.name}</Text>
                      <Text>
                        {formatDateNamed(exp.startDate)} -{' '}
                        {formatDateNamed(exp.endDate)}
                      </Text>
                    </Container>
                  </Container>
                ))}
              </div>
            )}
            {profileUser.education.length > 0 && (
              <div>
                <Container
                  flex
                  align="center"
                  gap={16}
                  mb={16}
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <SvgIcon src="pencil_fill" size={25} />}{' '}
                  <Text fontSize={32} fontWeight={600}>
                    Education
                  </Text>
                </Container>
                {profileUser.education.map((edu, i) => (
                  <Container flex align="center" mb={12} key={i}>
                    <Container
                      flex
                      align="center"
                      justify="center"
                      width="100px"
                    >
                      <SvgIcon src="study" size={50} />
                    </Container>
                    <Container
                      flex
                      dir="column"
                      justify="space-between"
                      key={i}
                    >
                      <Text fontSize={18} fontWeight="bold">
                        {edu.name}
                      </Text>
                      <Text fontSize={18}>{edu.university.name}</Text>
                      <Text>
                        {formatDateNamed(edu.startDate)} -{' '}
                        {formatDateNamed(edu.endDate)}
                      </Text>
                    </Container>
                  </Container>
                ))}
              </div>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default Profile;
