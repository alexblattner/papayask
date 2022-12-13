import styled from 'styled-components';
import { useRef } from 'react';

import { Education, Experience } from '../profile/profileService';

const StyledInput = styled('input')`
  all: unset;
  font-size: 16px;
  font-weight: 500;
  width: 80%;
  padding-left: 15px;
  font-size: 12px;
`;

const Wrapper = styled.div<{ value: string; placeholder: string }>`
  height: 35px;
  width: 50%;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
  border-radius: 8px;
  position: relative;
  background-color: transparent;
  margin-bottom: 30px;
  padding-top: 4px;

  &::before {
    content: ${(props) => (!props.value ? 'attr(placeholder)' : 'none')};
    position: absolute;
    left: 15px;
    width: calc(100% - 60px);
    color: #aaa;
    background-color: white;
    transition: all 0.2s;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};

    &::before {
      content: none;
    }
  }
`;

interface InputProps {
  name: string;
  value: Date | null | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  inputEducation?: Education;
  inputExperience?: Experience;
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
    day = dateArr[2].slice(0, 2);
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }

  return `${year}-${month}-${day}`;
};

export const DateInput = (props: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const minDate = () => {
    let date = '1977-01-01';
    if (props.name.includes('end')) {
      if (props.inputExperience) {
        if (props.inputExperience.startDate) {
          date = formatedDate(props.inputExperience.startDate);
        }
      }
      if (props.inputEducation) {
        if (props.inputEducation.startDate) {
          date = formatedDate(props.inputEducation.startDate);
        }
      }
    }
    return date;
  };

  const maxDate = () => {
    let date = formatedDate(new Date());
    if (props.name.includes('start')) {
      if (props.inputExperience) {
        if (props.inputExperience.endDate) {
          date = formatedDate(props.inputExperience.endDate);
        }
      }
      if (props.inputEducation) {
        if (props.inputEducation.endDate) {
          date = formatedDate(props.inputEducation.endDate);
        }
      }
    }

    return date;
  };
  return (
    <Wrapper
      value={formatedDate(props.value)}
      placeholder={props.placeholder}
      onClick={() => inputRef.current?.click()}
    >
      <StyledInput
        {...props}
        ref={inputRef}
        value={formatedDate(props.value)}
        type="date"
        max={maxDate()}
        min={minDate()}
        onChange={(e) => {
          props.onChange(e);
        }}
      />
    </Wrapper>
  );
};
