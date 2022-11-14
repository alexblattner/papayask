import { useState } from 'react';
import styled from 'styled-components';

const StyledInput = styled('input')`
  width: 143px;
  height: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  background-color: transparent;

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

interface InputProps {
  name: string;
  value: Date | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
}

const formatedDate = (date: Date | null | string): string => {
  if (!date) return '';
  let year: number | string;
  let month: number | string;
  let day: number | string;
  if (typeof date === 'string') {
    const dateArr = date.split('-');
    year = dateArr[0];
    month = dateArr[1];
    day = dateArr[2];
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }
  return `${day}/${month}/${year}`;
};

export const DateInput = (props: InputProps) => {
  const [inputType, setInputType] = useState('text');
  return (
    <StyledInput
      {...props}
      value={formatedDate(props.value)}
      type={inputType}
      onFocus={() => setInputType('date')}
      onBlur={() => setInputType('text')}
    />
  );
};
