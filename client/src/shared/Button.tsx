import styled from 'styled-components';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: string;
  disabled?: boolean;
  children: React.ReactNode;
  width?: number | string;
}

const StyledButton = styled('button')<ButtonProps>`
  background-color: ${(props) =>
    props.variant&&!props.variant.includes('outline')&&!props.variant.includes('text')? 'var(--'+props.variant+')'
      :'transparent'};
  color: ${(props) =>
    props.variant === 'secondary' || props.variant === 'outline'
      ? props.theme.colors.primary
      : props.variant.includes('primary')
      ? 'white'
      : 'black'};
  border: ${(props) =>
    props.variant === 'outline'
      ? `2px solid ${props.theme.colors.primary}`
      : 'none'};
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
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
