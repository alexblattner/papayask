import React from 'react';
import styled from 'styled-components';
import Divider from './Divider';

const StyledBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  cursor: pointer;
  gap: 12px;
`;

interface Props {
  text: string;
  isRemovable?: boolean;
  onRemove?: (text: string) => void;
}

const Badge = (props: Props) => {
  const removeBadge = (text: string) => {
    if (!props.onRemove) {
      return;
    }
    props.onRemove(text);
  };
  return (
    <StyledBadge>
      {props.text}

      {props.isRemovable && <Divider orientation="vertical" />}
      {props.isRemovable && (
        <span onClick={() => removeBadge(props.text)}>X</span>
      )}
    </StyledBadge>
  );
};

export default Badge;
