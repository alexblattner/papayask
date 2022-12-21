import styled from 'styled-components';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'outline' | 'text';
  disabled?: boolean;
  children: React.ReactNode;
  width?: number | string;
}

const StyledButton = styled('button')<ButtonProps>`
  background-color: ${(props) =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.variant === 'secondary'
      ? props.theme.colors.primary_L2
      : 'transparent'};
  color: ${(props) =>
    props.variant === 'secondary' || props.variant === 'outline'
      ? props.theme.colors.primary
      : props.variant === 'primary'
      ? 'white'
      : 'black'};
  border: ${(props) =>
    props.variant === 'outline'
      ? `2px solid ${props.theme.colors.primary}`
      : 'none'};
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  padding: 4px 16px;
  width: ${(props) => (props.width ? `${props.width}` : 'auto')};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    &:not(:disabled) {
      opacity: 0.8;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) =>
      props.variant === 'text'
        ? 'transparent'
        : props.theme.colors.secondary_L1};
  }
`;

export const Button = (props: ButtonProps) => {
  return <StyledButton {...props}>{props.children}</StyledButton>;
};
