import styled from 'styled-components';

interface TextProps {
  children: React.ReactNode;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  mb?: number;
  ml?: number;
  align?: string;
}

const StyledText = styled('p')<TextProps>`
  font-size: ${(props) => (props.fontSize ? props.fontSize + 'px' : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 400)};
  margin: 0;
  margin-bottom: ${(props) => (props.mb ? props.mb + 'px' : '0')};
  margin-left: ${(props) => (props.ml ? props.ml + 'px' : '0')};
  text-align: ${(props) => (props.align ? props.align : 'start')};
  color: ${(props) =>
    !props.color
      ? '#000'
      : props.color === 'primary'
      ? props.theme.colors.primary
      : props.color};
`;

export const Text = (props: TextProps) => {
  return <StyledText {...props}>{props.children}</StyledText>;
};
