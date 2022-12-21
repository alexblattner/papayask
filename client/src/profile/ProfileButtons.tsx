import React from 'react';
import { UserProps } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import SvgIcon from '../shared/SvgIcon';
import useWidth from '../Hooks/useWidth';

interface Props {
  isOwner: boolean;
  openProfileSetup: () => void;
  profileUser: UserProps;
  setShowQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileButtons = (props: Props) => {
  const { isOwner, openProfileSetup, profileUser, setShowQuestionModal } =
    props;

  const { width } = useWidth();
  return (
    <>
      {isOwner ? (
        <Container flex gap={12}>
          {/*profileUser.verified ? (
        <Button variant="outline" onClick={() => setShowSettings(true)}>
          <Container flex align="center" gap={8}>
            <SvgIcon src="settings" size={25} /> Settings
          </Container>
        </Button>
      ) : (
        <Button variant="outline" onClick={() => {}}>
          <Container flex align="center" gap={8}>
            Verify my account
          </Container>
        </Button>
      )*/}
          <Button
            variant="text"
            onClick={openProfileSetup}
            width={width < 600 ? '150px' : 'auto'}
          >
            <Container flex align="center" justify="center" gap={8}>
              <SvgIcon src="pencil_fill" size={20} /> EDIT
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
    </>
  );
};

export default ProfileButtons;
