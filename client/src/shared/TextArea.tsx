import { forwardRef } from 'react';
import styled from 'styled-components';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  border: 2px solid ${(props) => props.theme.colors.secondary_L1};
  border-radius: 8px;
  padding: 16px;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 30px;

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

export const TextArea = forwardRef(
  (props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
    return <StyledTextArea ref={ref} {...props} />;
  }
);
