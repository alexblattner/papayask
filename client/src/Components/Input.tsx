import styled from 'styled-components';

const StyledInput = styled.input`
  width: ${(props) => (props.type === 'text' ? '300px' : '143px')};
  height: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary20};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;

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

interface InputProps {
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  type: string;
  placeholder: string;
}

export const Input = (props: InputProps) => {
  return <StyledInput {...props} />;
};
