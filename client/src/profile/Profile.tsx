import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import Icon from '../shared/Icon';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import ProfileSetup from './ProfileSetup';
import Creator from '../Question/Creator';
import { UserProps } from '../models/User';
import api from '../utils/api';
import Image from '../shared/Image';
import RequestSettingsModal from './RequestSettingsModal';

const SkillBadge = styled.div`
  background-color: ${(props) => props.theme.colors.primary_L2};
  color: ${(props) => props.theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16;
`;

const CoverImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const ProfileImage = styled.div`
  position: absolute;
  top: 150px;
  left: 64px;
  width: 250px;
  height: 250px;
  right: 0;
  bottom: 0;
  border: 1px solid #fff;
  border-radius: 8px;
  overflow: hidden;
  z-index: 99;
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

  const { user } = React.useContext(AuthContext);

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
    const id = window.location.pathname.split('/')[2];

    if (id) {
      if (id === user?.id) {
        setProfileUser(user);
      } else {
        getProfileUser(id);
      }
    }
  }, [window.location.pathname, user]);

  useEffect(() => {
    if (profileUser) {
      if (profileUser?.id === user?.id) {
        setIsOwner(true);
      }
    }
  }, [profileUser]);

  if (!profileUser) return null;
  return (
    <Container width="65%" mx={'auto'} position="relative">
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
        <CoverImage
          src={profileUser.coverPicture ?? 'https://source.unsplash.com/random'}
          alt="cover-img"
        />

        <ProfileImage>
          <Image src={profileUser?.picture} size={250} />
        </ProfileImage>
      </Container>

      <Container mt={135} pl={64}>
        <Container flex align="center" justify="space-between">
          <Container flex align="center" gap={12}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Icon src="Star_Fill" width={30} height={30} key={i} />
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
                      <Icon src="Edit_White" width={20} height={20} /> Settings
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
                    <Icon src="Edit_White" width={20} height={20} /> EDIT
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
                    <Icon src="Send" width={25} height={25} />
                  </Button>
                )}
                <Button variant="secondary" onClick={() => {}}>
                  <Icon src="Share" width={25} height={25} />
                </Button>
                <Button variant="secondary" onClick={() => {}}>
                  <Icon src="Heart" width={25} height={25} />
                </Button>
              </Container>
            )}
          </Container>
        </Container>
        <Text fontSize={46} fontWeight={600}>
          {profileUser.name}
        </Text>
        <Text fontSize={32} fontWeight={600}>
          {profileUser.title}
        </Text>
        {/* <Container flex flexWrap justify="space-between" mt={24}>
          <Container flex dir="column" gap={24} width="50%">
            {user.experience?.length > 0 && (
              <div>
                <Container
                  flex
                  align="center"
                  gap={16}
                  mb={16}
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <Icon src="Edit_Black" width={25} height={25} />}{' '}
                  <Text fontSize={32} fontWeight={600}>
                    Experience
                  </Text>
                </Container>
                {user.experience.map((exp, i) => (
                  <Container mb={12} key={i}>
                    <Text fontSize={18} fontWeight="bold">
                      {exp.name}
                    </Text>
                    <Text fontSize={18}>{exp.company}</Text>
                    <Text>{exp.startDate.toString()} - {exp.endDate?.toString() ?? 'Present'}</Text>
                  </Container>
                ))}
              </div>
            )}
            {user.education.length > 0 && (
              <div>
                <Container
                  flex
                  align="center"
                  gap={16}
                  mb={16}
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <Icon src="Edit_Black" width={25} height={25} />}{' '}
                  <Text fontSize={32} fontWeight={600}>
                    Education
                  </Text>
                </Container>
                {user.education.map((edu, i) => (
                  <Container mb={12} key={i}>
                    <Text fontSize={18} fontWeight="bold">
                      {edu.name}
                    </Text>
                    <Text fontSize={18}>{edu.university.name}</Text>
                    <Text>{edu.startDate.toString()} - {edu.endDate?.toString() ?? 'Present'}</Text>
                  </Container>
                ))}
              </div>
            )}
            <div>
              <Container
                flex
                align="center"
                gap={16}
                onClick={() => openProfileSetupInStep(2)}
              >
                {' '}
                {isOwner && <Icon src="Edit_Black" width={25} height={25} />}
                {'  '}
                <Text fontSize={32} fontWeight={600}>
                  Skills
                </Text>
              </Container>
              <Container width="100%" flex flexWrap gap={16}>
                {user.skills.map((skill, i) => (
                  <SkillBadge key={i}>{skill.name}</SkillBadge>
                ))}
              </Container>
            </div>
          </Container>
          <Container flex align="center" gap={12}>
            <div>
              <Container
                flex
                align="center"
                gap={16}
                onClick={() => openProfileSetupInStep(0)}
              >
                {' '}
                {isOwner && <Icon src="Edit_Black" width={25} height={25} />}
                {'  '}
                <Text fontSize={32} fontWeight={600}>
                  {' '}
                  Bio:
                </Text>
              </Container>
              <Text fontSize={18}>{user.bio}</Text>
            </div>
          </Container>
        </Container> */}
      </Container>
    </Container>
  );
};

export default Profile;
