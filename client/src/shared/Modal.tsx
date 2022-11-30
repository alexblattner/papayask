import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: grid;
  place-items: center;
  padding-top: 50px;
`;

const StyledModal = styled.div<{ modalLoaded: boolean }>`
  background-color: #fff;
  width: 50%;
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

  @media (max-width: 1200px) {
    width: 70%;
  }

  @media (max-width: 950px) {
    width: 90%;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 32px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal = (props: Props) => {
  const [modalLoaded, setModalLoaded] = useState<boolean>(false);
  useEffect(() => {
    setModalLoaded(true);
  }, []);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.setShowModal(false);
    }
  };
  return (
    <BackDrop onClick={(e) => closeModal(e)}>
      <StyledModal modalLoaded={modalLoaded}>
        <CloseButton onClick={() => props.setShowModal(false)}>X</CloseButton>
        {props.children}
      </StyledModal>
    </BackDrop>
  );
};

export default Modal;
