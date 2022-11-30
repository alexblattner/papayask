import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as FullLogo } from '../full_logo.svg';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const StyledDrawer = styled.div<{ isOpen: boolean }>`
  width: 60%;
  margin-left: 40%;
  height: 100vh;
  background-color: white;
  z-index: 10001;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
  transition: all 0.3s ease-in-out;
`;

const DrawerHeader = styled.div`
  height: 80px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;

interface Props {
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const Drawer = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeDrawer = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
    }
    props.setShowDrawer(false);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Backdrop onClick={(e) => closeDrawer(e)}>
      <StyledDrawer isOpen={isOpen}>
        <DrawerHeader>
          {' '}
          <FullLogo width={150} height={50} />
        </DrawerHeader>
        <DrawerContent>
          <Container py={12}>
            <Text fontSize={22} fontWeight={'bold'}>
              Search
            </Text>
          </Container>
          <Container py={12}>
            <Text fontSize={22} fontWeight={'bold'}>
              Requests
            </Text>
          </Container>
          <Container py={12}>
            <Text fontSize={22} fontWeight={'bold'}>
              Notifications
            </Text>
          </Container>
          <Container py={12}>
            <Text fontSize={22} fontWeight={'bold'}>
              Favorites
            </Text>
          </Container>
        </DrawerContent>
      </StyledDrawer>
    </Backdrop>
  );
};

export default Drawer;
