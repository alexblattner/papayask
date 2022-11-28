import styled from 'styled-components';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  children: React.ReactNode;
  width?: number;
}

const StyledButton = styled('button')<ButtonProps>`
  background-color: ${(props) =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.primary_L2};
  color: ${(props) =>
    props.variant === 'secondary' ? props.theme.colors.primary : 'white'};
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    &:not(:disabled) {
      opacity: 0.8;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

export const Button = (props: ButtonProps) => {
  return <StyledButton {...props}>{props.children}</StyledButton>;
};
