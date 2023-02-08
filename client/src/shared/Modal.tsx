import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import SvgIcon from './SvgIcon';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: grid;
  place-items: center;
  padding-top: 50px;
`;

const StyledModal = styled.div<{
  modalLoaded: boolean;
  fullscreen?: boolean;
  size?: 'sm' | 'normal';
}>`
  background-color: #fff;
  width: ${(props) =>
    props.fullscreen ? '90%' : props.size === 'sm' ? '35%' : '50%'};
  height: ${(props) => (props.fullscreen ? '85vh' : 'auto')};
  border-radius: 8px;
  transform: translateY(${(props) => (props.modalLoaded ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  text-align: center;
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;

  @media (max-width: 1300px) {
    width: ${(props) =>
      props.fullscreen ? '90%' : props.size === 'sm' ? '45%' : '70%'};
  }

  @media (max-width: 950px) {
    width: 90%;
  }
`;

const CloseButton = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  font-weight: bold;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  closeButton: boolean;
  fullScreen?: boolean;
  size?: 'sm' | 'normal';
}

const Modal = (props: Props) => {
  const [modalLoaded, setModalLoaded] = useState<boolean>(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setModalLoaded(true);
  }, []);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.body.style.overflow = 'unset';
    if (e.target === e.currentTarget) {
      props.setShowModal(false);
    }
  };
  return (
    <BackDrop onClick={(e) => closeModal(e)}>
      <StyledModal
        modalLoaded={modalLoaded}
        fullscreen={props.fullScreen}
        size={props.size}
      >
      { props.closeButton ? <CloseButton onClick={() => props.setShowModal(false)}>
          <SvgIcon src="x" color="white" size={12}/>
        </CloseButton> : null}
        {props.children}
      </StyledModal>
    </BackDrop>
  );
};

export default Modal;
