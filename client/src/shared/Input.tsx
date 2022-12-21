import styled from 'styled-components';
import { Text } from './Text';

const InputContainer = styled.div<InputProps>`
  width: ${(props) => props.width || '100%'};
`;

const StyledInput = styled.input<InputProps>`
  width: 100%;
  height: 50px;
  border: 2px solid
    ${(props) => (props.color ? props.color : props.theme.colors.secondary_L1)};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: ${(props) => props.mb || '30px'};

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string | number;
  error?: string;
  type: string;
  width?: string;
  mb?: string;
  color?: string;
  placeholder?: string;
  label?: string;
}

export const Input = (props: InputProps) => {
  return (
    <InputContainer {...props}>
      <Text fontWeight={'bold'} color= '#8e8e8e' mb={6}>{props.label}</Text>
      <StyledInput {...props} />
    </InputContainer>
  );
};
