import styled from "styled-components";

export const Suggestions = styled('div')<{ show: boolean }>`
  position: absolute;
  top: 35px;
  left: 0;
  max-height: 240px;
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  background-color: #fff;
  width: 300px;
  z-index: 999;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: auto;
`;

export const Suggestion = styled('div')`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary_L2};
  }
`;
