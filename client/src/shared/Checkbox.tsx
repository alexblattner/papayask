import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled('div')<Props>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) =>
    props.checked ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

interface Props {
  checked: boolean;
}

const Checkbox = (props: Props) => {
  return <StyledCheckbox {...props}></StyledCheckbox>;
};

export default Checkbox;
