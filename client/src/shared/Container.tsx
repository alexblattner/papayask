import styled from 'styled-components';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | React.ReactNode[];
  onClick?: () => void;
  width?: string;
  height?: string;
  flex?: boolean;
  dir?: 'row' | 'column';
  flexWrap?: boolean;
  align?: 'center' | 'flex-start' | 'flex-end';
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  gap?: number;
  px?: number | 'auto';
  py?: number | 'auto';
  pt?: number | 'auto';
  pb?: number | 'auto';
  pl?: number | 'auto';
  pr?: number | 'auto';
  mx?: number | 'auto';
  my?: number | 'auto';
  mt?: number | 'auto';
  mb?: number | 'auto';
  ml?: number | 'auto';
  mr?: number | 'auto';
  borderRadius?: string;
  border?: string;
  borderRight?: string;
  borderLeft?: string;
  borderTop?: string;
  borderBottom?: string;
  position?: 'relative' | 'absolute' | 'fixed';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  maxH?: string;
  minH?: string;
  maxW?: string;
  minW?: string;
  overflow?: 'hidden' | 'scroll' | 'auto';
}

const StyledContainer = styled('div')<ContainerProps>`
  width: ${(props) => (props.width ? props.width : '')};
  height: ${(props) => (props.height ? props.height : '')};
  position: ${(props) => (props.position ? props.position : '')};
  top: ${(props) => (props.top ? props.top : '')};
  right: ${(props) => (props.right ? props.right : '')};
  bottom: ${(props) => (props.bottom ? props.bottom : '')};
  left: ${(props) => (props.left ? props.left : '')};
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  flex-direction: ${(props) => props.dir};
  flex-wrap: ${(props) => (props.flexWrap ? 'wrap' : '')};
  align-items: ${(props) => props.align};
  justify-content: ${(props) => props.justify};
  gap: ${(props) => (props.gap ? props.gap + 'px' : '')};
  padding-block: ${(props) =>
    props.py === 'auto' ? 'auto' : props.py ? props.py + 'px' : ''};
  padding-inline: ${(props) =>
    props.px === 'auto' ? 'auto' : props.px ? props.px + 'px' : ''};
  padding-top: ${(props) =>
    props.pt === 'auto' ? 'auto' : props.pt ? props.pt + 'px' : ''};
  padding-bottom: ${(props) =>
    props.pb === 'auto' ? 'auto' : props.pb ? props.pb + 'px' : ''};
  padding-left: ${(props) =>
    props.pl === 'auto' ? 'auto' : props.pl ? props.pl + 'px' : ''};
  padding-right: ${(props) =>
    props.pr === 'auto' ? 'auto' : props.pr ? props.pr + 'px' : ''};
  margin-block: ${(props) =>
    props.my === 'auto' ? 'auto' : props.my ? props.my + 'px' : ''};
  margin-inline: ${(props) =>
    props.mx === 'auto' ? 'auto' : props.mx ? props.mx + 'px' : ''};
  margin-top: ${(props) =>
    props.mt === 'auto' ? 'auto' : props.mt ? props.mt + 'px' : ''};
  margin-bottom: ${(props) =>
    props.mb === 'auto' ? 'auto' : props.mb ? props.mb + 'px' : ''};
  margin-left: ${(props) =>
    props.ml === 'auto' ? 'auto' : props.ml ? props.ml + 'px' : ''};
  margin-right: ${(props) =>
    props.mr === 'auto' ? 'auto' : props.mr ? props.mr + 'px' : ''};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '')};
  border: ${(props) => (props.border ? props.border : '')};
  border-right: ${(props) => (props.borderRight ? props.borderRight : '')};
  border-left: ${(props) => (props.borderLeft ? props.borderLeft : '')};
  border-top: ${(props) => (props.borderTop ? props.borderTop : '')};
  border-bottom: ${(props) => (props.borderBottom ? props.borderBottom : '')};
  z-index: ${(props) => (props.zIndex ? props.zIndex : '')};
  max-height: ${(props) => (props.maxH ? props.maxH : '')};
  min-height: ${(props) => (props.minH ? props.minH : '')};
  max-width: ${(props) => (props.maxW ? props.maxW : '')};
  min-width: ${(props) => (props.minW ? props.minW : '')};
  overflow: ${(props) => (props.overflow ? props.overflow : '')};
  cursor: ${(props) => (props.onClick ? 'pointer' : '')};
  &:hover {
    background-color: ${(props) => (props.onClick ? '#f5f5f5' : '')};
  }
`;

export const Container = (props: ContainerProps) => {
  return <StyledContainer {...props}>{props.children}</StyledContainer>;
};
