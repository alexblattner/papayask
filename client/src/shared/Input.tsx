import styled from 'styled-components';

const StyledInput = styled.input<InputProps>`
  width: ${(props) => props.width || '100%'};
  height: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
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
  placeholder: string;
}

export const Input = (props: InputProps) => {
  return <StyledInput {...props} />;
};
