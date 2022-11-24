import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { Text } from './Text';

const StyledAlert = styled('div')<{
  type: 'success' | 'error' | 'info';
  show: boolean;
}>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  color: #fff;
  background-color: ${(props) =>
    props.type === 'error'
      ? '#dc3545'
      : props.type === 'success'
      ? '#28a745'
      : '#1E92F4'};

  padding: 8px 16px;
  border-radius: 8px;
  align-items: center;
  grid-gap: 16;
  margin-bottom: 16px;
  width: 100%;
`;

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  loading: boolean;
}

const Alert = (props: Props) => {
  return (
    <StyledAlert type={props.type} show={props.show}>
      {props.loading && <Spinner animation="border" />}
      <Text color="#fff" fontWeight={'bold'} ml={16}>
        {props.message}
      </Text>
    </StyledAlert>
  );
};

export default Alert;
